// Raster layers draped on the terrain. All of them are real data:
// elevation and slope from the DEMs, surface temperature from VIIRS,
// radar backscatter from Sentinel-1, and a terrain match computed in
// src/lib/analysis.ts.

import { cellMetres, type Dem } from './dem'
import { clamp01 } from './noise'
import type { Analysis } from './analysis'
import type { Manifest } from './data'
import type { TargetId } from '../data/targets'

export type LayerId = 'terrain' | 'thermal' | 'swing' | 'radar' | 'slope' | 'score'
export type Side = 'earth' | 'twin'

export interface LayerMeta {
  id: LayerId
  label: string
  unit: string
  source: string
  /** also available on the Moon / Mars twin terrain */
  onTwin: boolean
  stops: string[]
}

const INFERNO = ['#000004', '#1b0c41', '#4a0c6b', '#781c6d', '#a52c60', '#cf4446', '#ed6925', '#fb9b06', '#f7d13d', '#fcffa4']

export const LAYERS: LayerMeta[] = [
  {
    id: 'terrain',
    label: 'Elevation',
    unit: 'm',
    source: 'SRTM-derived terrain tiles',
    onTwin: true,
    stops: ['#0b0c0f', '#1c1d22', '#34343a', '#5a5856', '#8c8780', '#c9c4bb', '#f2efe9'],
  },
  {
    id: 'thermal',
    label: 'Surface temperature, 13:30',
    unit: '°C',
    source: 'VIIRS S-NPP, Oct 2026 mean (NASA GIBS)',
    onTwin: false,
    stops: INFERNO,
  },
  {
    id: 'swing',
    label: 'Day–night swing',
    unit: 'K',
    source: 'VIIRS 13:30 minus 01:30, Oct 2026',
    onTwin: false,
    stops: ['#03051a', '#2a1150', '#5f187f', '#982d80', '#d3436e', '#f8765c', '#febb81', '#fcfdbf'],
  },
  {
    id: 'radar',
    label: 'Radar backscatter',
    unit: 'dB',
    source: 'Sentinel-1 C-band VV, Sep–Nov',
    onTwin: false,
    stops: ['#0b0405', '#2a1c3d', '#3b3472', '#3a5a99', '#3482a4', '#37a8ac', '#5fceac', '#b3e7c5', '#def5e5'],
  },
  {
    id: 'slope',
    label: 'Slope',
    unit: '°',
    source: 'Derived from elevation',
    onTwin: true,
    stops: ['#440154', '#482878', '#3e4989', '#31688e', '#26828e', '#1f9e89', '#35b779', '#6ece58', '#b5de2b', '#fde725'],
  },
  {
    id: 'score',
    label: 'Terrain match',
    unit: '%',
    source: 'Slope + roughness statistics vs target',
    onTwin: false,
    stops: ['#050506', '#1a1020', '#4a1528', '#8f2323', '#d9481c', '#ff8a3d', '#ffd08a', '#ffffff'],
  },
]

export const layerById = (id: LayerId) => LAYERS.find((l) => l.id === id)!

/** The layer actually drawn: twins only carry elevation and slope. */
export const effectiveLayer = (layer: LayerId, side: Side): LayerId =>
  side === 'twin' && !layerById(layer).onTwin ? 'terrain' : layer

/** A terrain with what is needed to draw it. */
export interface Surface {
  dem: Dem
  slope: Float32Array
  /** 0..1 baked relief shading (NW light) */
  shade: Float32Array
}

export interface EarthSurface extends Surface {
  thermal: Float32Array
  swing: Float32Array
  radar: Float32Array
  score: Record<TargetId, Float32Array>
}

export interface World {
  earth: EarthSurface
  twins: Record<TargetId, Surface>
  analysis: Analysis
  manifest: Manifest
  domains: Record<'thermal' | 'swing' | 'radar', [number, number]>
}

const DEG = 180 / Math.PI

export function derive(dem: Dem): Surface {
  const N = dem.size
  const h = dem.heights
  const cell = cellMetres(dem)
  const slope = new Float32Array(N * N)
  const shade = new Float32Array(N * N)
  for (let y = 0; y < N; y++) {
    const ym = y > 0 ? y - 1 : y
    const yp = y < N - 1 ? y + 1 : y
    for (let x = 0; x < N; x++) {
      const xm = x > 0 ? x - 1 : x
      const xp = x < N - 1 ? x + 1 : x
      const i = y * N + x
      const gx = (h[y * N + xp] - h[y * N + xm]) / ((xp - xm) * cell)
      const gn = (h[ym * N + x] - h[yp * N + x]) / ((yp - ym) * cell)
      slope[i] = Math.atan(Math.hypot(gx, gn)) * DEG
      const ex = 3
      shade[i] = Math.max(
        0,
        (gx * ex * 0.5 - gn * ex * 0.5 + 0.7071) / Math.hypot(gx * ex, gn * ex, 1),
      )
    }
  }
  return { dem, slope, shade }
}

/** Robust display range: the 2nd to 98th percentile, rounded outward. */
export function percentileDomain(values: Float32Array): [number, number] {
  const sample = new Float32Array(Math.ceil(values.length / 16))
  for (let i = 0; i < sample.length; i++) sample[i] = values[i * 16]
  sample.sort()
  return [
    Math.floor(sample[Math.floor(sample.length * 0.02)]),
    Math.ceil(sample[Math.floor(sample.length * 0.98)]),
  ]
}

export interface LayerData {
  layer: LayerId
  surface: Surface
  values: Float32Array
  domain: [number, number]
}

/** Values, range and terrain for what is on screen. */
export function layerData(world: World, layer: LayerId, target: TargetId, side: Side): LayerData {
  const id = effectiveLayer(layer, side)
  const surface = side === 'twin' ? world.twins[target] : world.earth
  const { dem } = surface
  switch (id) {
    case 'terrain':
      return {
        layer: id,
        surface,
        values: dem.heights,
        domain: [Math.floor(dem.min / 50) * 50, Math.ceil(dem.max / 50) * 50],
      }
    case 'slope':
      return { layer: id, surface, values: surface.slope, domain: [0, 30] }
    case 'thermal':
      return { layer: id, surface, values: world.earth.thermal, domain: world.domains.thermal }
    case 'swing':
      return { layer: id, surface, values: world.earth.swing, domain: world.domains.swing }
    case 'radar':
      return { layer: id, surface, values: world.earth.radar, domain: world.domains.radar }
    case 'score': {
      const values = world.earth.score[target]
      return { layer: id, surface, values, domain: percentileDomain(values) }
    }
  }
}

const lutCache = new Map<LayerId, Uint8Array>()

function hexToRgb(hex: string) {
  const v = parseInt(hex.slice(1), 16)
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255]
}

function getLut(layer: LayerId) {
  const cached = lutCache.get(layer)
  if (cached) return cached
  const stops = layerById(layer).stops.map(hexToRgb)
  const lut = new Uint8Array(256 * 3)
  for (let k = 0; k < 256; k++) {
    const t = (k / 255) * (stops.length - 1)
    const a = Math.min(stops.length - 2, Math.floor(t))
    const f = t - a
    for (let c = 0; c < 3; c++) {
      lut[k * 3 + c] = stops[a][c] + (stops[a + 1][c] - stops[a][c]) * f
    }
  }
  lutCache.set(layer, lut)
  return lut
}

/** Paint a layer to a canvas: colour ramp × relief shading + 100 m contours. */
export function bakeLayer({ layer, surface, values, domain }: LayerData): HTMLCanvasElement {
  const N = surface.dem.size
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = N
  const ctx = canvas.getContext('2d')!
  const img = ctx.createImageData(N, N)
  const out = img.data
  const [lo, hi] = domain
  const lut = getLut(layer)
  const h = surface.dem.heights
  const base = layer === 'terrain' ? 0.62 : 0.8
  const amp = layer === 'terrain' ? 0.55 : 0.28
  const contour = layer === 'terrain' ? 1 : 0.6

  for (let i = 0; i < N * N; i++) {
    const k = (clamp01((values[i] - lo) / (hi - lo)) * 255) | 0
    const s = base + amp * surface.shade[i]
    let r = lut[k * 3] * s
    let g = lut[k * 3 + 1] * s
    let b = lut[k * 3 + 2] * s

    const x = i % N
    if (x < N - 1 && i < N * (N - 1)) {
      const c0 = Math.floor(h[i] / 100)
      if (c0 !== Math.floor(h[i + 1] / 100) || c0 !== Math.floor(h[i + N] / 100)) {
        const major =
          Math.floor(h[i] / 500) !== Math.floor(h[i + 1] / 500) ||
          Math.floor(h[i] / 500) !== Math.floor(h[i + N] / 500)
        const a = (major ? 0.34 : 0.13) * contour
        r += (255 - r) * a
        g += (255 - g) * a
        b += (255 - b) * a
      }
    }

    const p = i * 4
    out[p] = r
    out[p + 1] = g
    out[p + 2] = b
    out[p + 3] = 255
  }
  ctx.putImageData(img, 0, 0)
  return canvas
}

/** Colour of a layer value as 0..1 RGB, for vertex colouring. */
export function layerColor(
  layer: LayerId,
  value: number,
  domain: [number, number],
  out: [number, number, number],
) {
  const lut = getLut(layer)
  const k = (clamp01((value - domain[0]) / (domain[1] - domain[0])) * 255) | 0
  out[0] = lut[k * 3] / 255
  out[1] = lut[k * 3 + 1] / 255
  out[2] = lut[k * 3 + 2] / 255
  return out
}
