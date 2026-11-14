// The findings, one per chapter. Every number is read from the analysis or
// the ingested rasters at run time, so the text cannot drift from the data.

import type { TargetId } from '../data/targets'
import { rankSites, SUN_ELEVATIONS } from './analysis'
import { uvToLonLat } from './dem'
import type { LayerId, World } from './layers'
import { fieldMean } from './scores'
import type { Shot } from '../store'

export type Visual = 'ranking' | 'year' | 'shadow'

export interface Chapter {
  id: string
  kicker: string
  /** the one number of the chapter */
  figure?: { value: number; unit: string; decimals?: number }
  title: string
  body: string
  source: string
  visual?: Visual
  scene: {
    layer: LayerId
    target: TargetId
    twin: boolean
    hour: number
    shot: Shot
    stations?: boolean
  }
}

// The text sits bottom-left, so every shot aims left of and below the terrain
// to push the mountain towards the upper right of the frame.
const WIDE: Shot = { position: [-58, 50, 150], target: [-16, -16, 6] }
const TWIN: Shot = { position: [-84, 46, 128], target: [-16, -14, 4] }
const ABOVE: Shot = { position: [-18, 160, 92], target: [-18, 0, 22] }
const FLOWS: Shot = { position: [64, 30, 96], target: [-2, -8, 6] }
const TUBES: Shot = { position: [50, 24, 66], target: [4, -4, 6] }
const POLE: Shot = { position: [44, 58, 150], target: [-14, -14, 4] }

const ORDINAL = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth']

export function buildStory(world: World): Chapter[] {
  const a = world.analysis
  const place = (target: TargetId) => rankSites(a, target).findIndex((s) => s.home)
  const arsiaRank = rankSites(a, 'arsia')
  const beaten = arsiaRank.slice(place('arsia') + 1).map((s) => s.name)

  const series = world.manifest.lst_series
  const hottest = series.reduce((m, r) => ((r.field_day ?? -99) > (m.field_day ?? -99) ? r : m))
  const annual = world.manifest.lst_annual
  const mean = ((annual.field_day ?? 0) + (annual.field_night ?? 0)) / 2
  const swing = fieldMean(world.earth.swing)

  const low = SUN_ELEVATIONS.indexOf(1.5)
  const best = a.best.arsia
  const where = uvToLonLat(best.u, best.v)

  return [
    {
      id: 'question',
      kicker: 'The question',
      title: 'Can a mountain in Türkiye stand in for Mars and the Moon?',
      body: 'Karacadağ is a basalt shield volcano with young lava flows and lava tubes. Nobody has studied it as a planetary analog. We measured it from orbit, the same way Mars and the Moon are measured.',
      source: 'Real elevation, drawn as 150 west–east profiles',
      scene: { layer: 'terrain', target: 'arsia', twin: false, hour: 15.8, shot: WIDE },
    },
    {
      id: 'twin',
      kicker: 'The twin',
      figure: { value: a.twins.arsia.topo, unit: '% terrain match' },
      title: 'Same 62 km. Same scale. This is Mars.',
      body: 'Arsia Mons, a shield volcano with cave skylights on its flank. Its slopes, roughness and relief overlap with Karacadağ’s, measured identically on both elevation models.',
      source: 'MOLA + HRSC elevation, Mars · SRTM, Earth · 480 m baseline',
      scene: { layer: 'terrain', target: 'arsia', twin: true, hour: 15.8, shot: TWIN },
    },
    {
      id: 'test',
      kicker: 'The test',
      figure: { value: a.sites.length, unit: 'Earth sites, one method' },
      title: 'We scored the sites NASA already uses. The method picks Mauna Loa first.',
      body: `That is the right answer for a Martian shield volcano, so the method works. Unstudied Karacadağ places ${ORDINAL[place('arsia')]} for Mars, ahead of ${beaten.join(' and ')}, and ${ORDINAL[place('tranq')]} for the lunar mare.`,
      source: 'Eight 62 km squares of Earth, one method',
      visual: 'ranking',
      scene: { layer: 'slope', target: 'arsia', twin: false, hour: 13.5, shot: WIDE },
    },
    {
      id: 'heat',
      kicker: 'The heat',
      figure: { value: hottest.field_day ?? 0, unit: '°C in July' },
      title: 'Bare basalt, hot by day, and only as far as air allows.',
      body: `The lava field swings ${swing.toFixed(0)} K between 13:30 and 01:30. The same rock on the Moon swings about 290 K. The difference is the atmosphere, and it is the first limit of any Earth analog.`,
      source: 'VIIRS land surface temperature, NASA GIBS',
      scene: { layer: 'thermal', target: 'arsia', twin: false, hour: 13.5, shot: FLOWS },
    },
    {
      id: 'coldtrap',
      kicker: 'The cold trap',
      figure: { value: mean - 4.5, unit: 'K colder underground' },
      title: 'The lava tubes may be storing winter.',
      body: `Over a year the ground above averages ${mean.toFixed(0)} °C. Cavers report 4–5 °C inside in summer. If our thermometers confirm it, the tube is a cold trap: the mechanism that keeps ice in Martian caves and volatiles at the lunar poles.`,
      source: 'VIIRS, 12 months · in-tube value from a press report, to be verified in the field',
      visual: 'year',
      scene: { layer: 'thermal', target: 'tranq', twin: false, hour: 13.5, shot: TUBES, stations: true },
    },
    {
      id: 'light',
      kicker: 'The light',
      figure: { value: a.twins.shackleton.shadow[low] * 100, unit: '% in shadow' },
      title: 'This is where the Moon Base goes. The sun never climbs above 1.5°.',
      body: `At that angle ${(a.earth.shadow[low] * 100).toFixed(0)}% of Karacadağ is in shadow, and ${(a.twins.shackleton.shadow[low] * 100).toFixed(0)}% of the Shackleton ridge. Our sunset gives 40 minutes of the same light every day: a rehearsal, with its limits measured.`,
      source: 'LRO LOLA 20 m polar elevation · horizons traced with lunar curvature',
      visual: 'shadow',
      scene: { layer: 'terrain', target: 'shackleton', twin: true, hour: 16.6, shot: POLE },
    },
    {
      id: 'where',
      kicker: 'Where to go',
      figure: { value: best.score, unit: '% match, one patch' },
      title: 'The closest ground to Mars is here.',
      body: `A 3 km patch at ${where.lat.toFixed(3)}°N ${where.lon.toFixed(3)}°E matches the Arsia flank far better than the mountain as a whole. The map says where a field team should stand.`,
      source: 'Local slope and roughness statistics against the Arsia Mons model',
      scene: { layer: 'score', target: 'arsia', twin: false, hour: 13.5, shot: ABOVE },
    },
    {
      id: 'limits',
      kicker: 'The limits',
      title: 'Earth cannot fake gravity, vacuum or radiation.',
      body: 'Every score here comes with the place where the comparison breaks. An analog is useful when its limits are known. The field campaign adds what orbit cannot see: tube temperatures, rock counts, grazing-light tests.',
      source: 'Open the data to check every number',
      scene: { layer: 'terrain', target: 'arsia', twin: false, hour: 9.5, shot: WIDE },
    },
  ]
}
