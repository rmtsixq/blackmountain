// DEMO DATA — axis scores and sensor read-outs are placeholders until the
// satellite pipeline and the field campaign deliver real numbers.
// The "note" on each axis (where the analogy breaks) is written from published
// facts and should survive the data swap.

export type TargetId = 'arsia' | 'tranq' | 'shackleton'
export type AxisId = 'thermal' | 'radar' | 'topo' | 'composition' | 'illumination'

export interface AxisMeta {
  id: AxisId
  label: string
  short: string
  earthSensor: string
  field: string
}

export const AXES: AxisMeta[] = [
  {
    id: 'thermal',
    label: 'Thermal behaviour',
    short: 'Thermal',
    earthSensor: 'VIIRS · MODIS · Landsat LST',
    field: 'Surface + in-tube temperature',
  },
  {
    id: 'radar',
    label: 'Radar roughness',
    short: 'Radar',
    earthSensor: 'Sentinel-1 · RADARSAT',
    field: 'Rock-abundance quadrats',
  },
  {
    id: 'topo',
    label: 'Topography',
    short: 'Topo',
    earthSensor: 'Copernicus DEM · SRTM',
    field: 'Photogrammetry / phone LiDAR',
  },
  {
    id: 'composition',
    label: 'Composition',
    short: 'Comp.',
    earthSensor: 'Sentinel-2 · ASTER · EMIT',
    field: 'Samples: density, magnetism',
  },
  {
    id: 'illumination',
    label: 'Illumination',
    short: 'Light',
    earthSensor: 'Sun simulation on DEM',
    field: 'Noon vs sunset photo pairs',
  },
]

export interface AxisScore {
  /** 0–100 similarity */
  score: number
  twinSensor: string
  earth: string
  twin: string
  /** where the analogy breaks down */
  note: string
}

export interface Target {
  id: TargetId
  body: 'Mars' | 'Moon'
  name: string
  subtitle: string
  coords: string
  color: string
  summary: string
  axes: Record<AxisId, AxisScore>
}

export const TARGETS: Target[] = [
  {
    id: 'arsia',
    body: 'Mars',
    name: 'Arsia Mons',
    subtitle: 'Tharsis lava-tube province',
    coords: '8.4°S · 239.9°E',
    color: '#ff6a3d',
    summary:
      'Basaltic shield flank with collapse pits and skylights. The best overall match: same rock family, same low-slope flow morphology.',
    axes: {
      thermal: {
        score: 74,
        twinSensor: 'Mars Odyssey THEMIS',
        earth: 'In-tube diurnal swing < 1 K',
        twin: 'Pit floors warmer than surface at night',
        note: 'A thin CO₂ atmosphere lets Mars swing ~90 K per sol; Earth air caps our surface swing near 20 K.',
      },
      radar: {
        score: 81,
        twinSensor: 'SHARAD · HiRISE rock counts',
        earth: 'σ⁰ −9 dB on young ʻaʻā',
        twin: 'Rock abundance 10–20%',
        note: 'Tharsis flows carry a dust mantle metres thick in places; Ovabağ flows are bare or soil-covered.',
      },
      topo: {
        score: 77,
        twinSensor: 'MOLA · HiRISE DTM',
        earth: 'Flank slope 2–6°',
        twin: 'Flank slope 1–5°',
        note: 'Arsia is ~435 km wide; Karacadağ is a tenth of that. Features match at outcrop scale, not edifice scale.',
      },
      composition: {
        score: 63,
        twinSensor: 'CRISM · TES',
        earth: 'Alkali basalt, olivine-bearing',
        twin: 'Tholeiitic basalt + dust',
        note: 'Karacadağ lavas are alkaline; liquid water and vegetation weather them in ways Mars does not.',
      },
      illumination: {
        score: 58,
        twinSensor: 'HRSC · CTX shadow maps',
        earth: 'Noon sun 33° (Nov)',
        twin: 'Equatorial, high sun',
        note: 'Earth sky scatters light into shadows; Martian shadows are harder, and skylight interiors darker.',
      },
    },
  },
  {
    id: 'tranq',
    body: 'Moon',
    name: 'Mare Tranquillitatis Pit',
    subtitle: 'Lunar skylight candidate shelter',
    coords: '8.34°N · 33.22°E',
    color: '#7dd3fc',
    summary:
      'A ~100 m collapse pit into mare basalt whose shaded floor stays near 17 °C. Ovabağ tubes reproduce the thermal-shelter physics.',
    axes: {
      thermal: {
        score: 69,
        twinSensor: 'LRO Diviner',
        earth: 'In-tube 8–9 °C, ±0.3 K',
        twin: 'Pit shade ~17 °C, stable',
        note: 'Lunar surface runs +127 °C to −173 °C in vacuum; our tube is buffered by air and moisture, not radiation alone.',
      },
      radar: {
        score: 72,
        twinSensor: 'LRO Mini-RF',
        earth: 'σ⁰ −9 dB, blocky',
        twin: 'CPR elevated at pit rim',
        note: 'Lunar regolith is impact-gardened powder; there is no terrestrial equivalent of metres of fine regolith on a flow.',
      },
      topo: {
        score: 66,
        twinSensor: 'LOLA · LROC NAC DTM',
        earth: 'Tube roof 3–5 m high',
        twin: 'Pit depth ~100 m',
        note: 'In one-sixth gravity lunar tubes can be far wider than any tube on Earth.',
      },
      composition: {
        score: 71,
        twinSensor: 'Chandrayaan-1 M³',
        earth: 'Alkali basalt',
        twin: 'High-Ti mare basalt',
        note: 'Both basalt, but mare lavas are dry and titanium-rich; no hydrated minerals, no organics.',
      },
      illumination: {
        score: 44,
        twinSensor: 'LROC NAC multi-angle',
        earth: 'Twilight zone ~10 m',
        twin: 'Permanently shadowed overhang',
        note: 'No sky glow on the Moon: shadow edges are absolute, and a 14-day night follows each day.',
      },
    },
  },
  {
    id: 'shackleton',
    body: 'Moon',
    name: 'Shackleton Connecting Ridge',
    subtitle: 'Moon Base · south-pole site',
    coords: '89.5°S · near-side rim',
    color: '#a78bfa',
    summary:
      'The planned base site. Karacadağ scores low here — and saying so is the point: only the low-sun lighting test transfers.',
    axes: {
      thermal: {
        score: 22,
        twinSensor: 'LRO Diviner polar maps',
        earth: 'Coldest probe ~4 °C',
        twin: 'Cold traps below −220 °C',
        note: 'Nothing on Earth approaches cryogenic cold-trap temperatures; only the trapping mechanism is comparable.',
      },
      radar: {
        score: 48,
        twinSensor: 'LRO Mini-RF',
        earth: 'Blocky basalt',
        twin: 'Mature highland regolith',
        note: 'Boulder fields exist at the ridge, but the matrix is fine anorthositic regolith, not lava.',
      },
      topo: {
        score: 41,
        twinSensor: 'LOLA 5 m polar DEM',
        earth: 'Shield slopes ≤ 12°',
        twin: 'Crater-rim slopes to 30°',
        note: 'A ridge between impact craters, not a volcanic flank. Slope statistics overlap only on the summit cones.',
      },
      composition: {
        score: 18,
        twinSensor: 'M³ · LEND',
        earth: 'Alkali basalt',
        twin: 'Anorthositic highlands',
        note: 'Wrong rock entirely: bright feldspar-rich crust versus dark iron-rich basalt.',
      },
      illumination: {
        score: 35,
        twinSensor: 'LOLA illumination maps',
        earth: 'Sunset test: sun < 5°',
        twin: 'Sun never above ~1.5°',
        note: 'We get 40 minutes of grazing light per day; the pole gets it for months, circling the horizon.',
      },
    },
  },
]

export const targetById = (id: TargetId) => TARGETS.find((t) => t.id === id)!

export function overallScore(t: Target) {
  const vals = AXES.map((a) => t.axes[a.id].score)
  return vals.reduce((s, v) => s + v, 0) / vals.length
}

export const EARTH_LIMITS = [
  {
    title: 'Gravity',
    text: 'Earth cannot reproduce 0.17 g (Moon) or 0.38 g (Mars). Tube widths, dust behaviour and mobility do not transfer directly.',
  },
  {
    title: 'Atmosphere',
    text: 'One bar of air scatters light into shadows, damps temperature extremes and carries moisture. The Moon has vacuum; Mars has under 1% of our pressure.',
  },
  {
    title: 'Radiation',
    text: 'Our magnetosphere and atmosphere block the radiation that makes tubes attractive as shelters in the first place.',
  },
  {
    title: 'Water and life',
    text: 'Ovabağ tubes are humid and inhabited. Rain, soil and vegetation alter the basalt at rates unknown on either target.',
  },
  {
    title: 'Composition',
    text: 'Karacadağ erupts alkali basalt. The Moon Base region is anorthositic highland crust — a different rock.',
  },
]
