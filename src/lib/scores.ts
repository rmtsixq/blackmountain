// Turns the analysis and the reference data into the five axis results.

import { AXES, type AxisId, type Target } from '../data/targets'
import { SUN_ELEVATIONS } from './analysis'
import { lonLatToUV } from './dem'
import { translator, type Translate } from './i18n'
import type { World } from './layers'

/**
 * computed    — both sides measured from real rasters in this app
 * published   — compared with a published value for the target
 * placeholder — not yet backed by data; marked † in the UI
 */
export type AxisStatus = 'computed' | 'published' | 'placeholder'

export interface AxisResult {
  score: number
  status: AxisStatus
  earthSensor: string
  twinSensor: string
  earth: string
  twin: string
  note: string
}

/** Approximate centre of the young Ovabağ flows. */
export const FIELD = { lon: 40.0, lat: 37.69 }

/** Mean of an Earth raster over a ~5 km window on the lava field. */
export function fieldMean(values: Float32Array) {
  const size = Math.sqrt(values.length)
  const { u, v } = lonLatToUV(FIELD.lon, FIELD.lat)
  const r = Math.round(size * 0.04)
  const cx = Math.round(u * (size - 1))
  const cy = Math.round(v * (size - 1))
  let sum = 0
  let count = 0
  for (let y = cy - r; y <= cy + r; y++)
    for (let x = cx - r; x <= cx + r; x++) {
      sum += values[y * size + x]
      count++
    }
  return sum / count
}

const LOW_SUN = SUN_ELEVATIONS.indexOf(5)

export function axisResults(
  target: Target,
  world: World,
  x: Translate = translator('en'),
): Record<AxisId, AxisResult> {
  const { analysis } = world
  const e = analysis.earth
  const t = analysis.twins[target.id]
  const earthSensor = (id: AxisId) => x(AXES.find((a) => a.id === id)!.earthSensor)
  const swing = fieldMean(world.earth.swing)

  return {
    topo: {
      score: t.topo,
      status: 'computed',
      earthSensor: earthSensor('topo'),
      twinSensor: x(target.demSource),
      earth: x('Median slope {a}°, relief {b} m', { a: e.medianSlope.toFixed(1), b: e.relief.toFixed(0) }),
      twin: x('Median slope {a}°, relief {b} m', { a: t.medianSlope.toFixed(1), b: t.relief.toFixed(0) }),
      note: x(target.notes.topo),
    },
    illumination: {
      score: t.light,
      status: 'computed',
      earthSensor: earthSensor('illumination'),
      twinSensor: x('Sun on {dem}', { dem: x(target.demSource) }),
      earth: x('{n}% of ground shadowed at 5° sun', { n: (e.shadow[LOW_SUN] * 100).toFixed(0) }),
      twin: x('{n}% of ground shadowed at 5° sun', { n: (t.shadow[LOW_SUN] * 100).toFixed(0) }),
      note: x(target.notes.illumination),
    },
    thermal: {
      score: 100 * Math.min(1, swing / target.swingK),
      status: 'published',
      earthSensor: earthSensor('thermal'),
      twinSensor: x(target.swingSource),
      earth: x('{k} K day to night on the lava field', { k: swing.toFixed(0) }),
      twin: x(target.swingText),
      note: x(target.notes.thermal),
    },
    composition: {
      score: target.composition.score,
      status: 'published',
      earthSensor: earthSensor('composition'),
      twinSensor: x(target.composition.twinSensor),
      earth: x(target.composition.earth),
      twin: x(target.composition.twin),
      note: x(target.notes.composition),
    },
  }
}

/** The headline number: terrain match, computed from both elevation models. */
export const terrainScore = (target: Target, world: World) =>
  world.analysis.twins[target.id].topo
