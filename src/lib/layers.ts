// Raster layers draped on the terrain.
// Elevation, slope and the baked relief shading are computed from the real DEM.
// Thermal, radar roughness and the analog score are SIMULATED placeholders with
// the same shape and units the satellite products will have.

import { CELL_M, GRID, lonLatToUV, type Dem } from './dem'
import { clamp01, fbm, smoothstep } from './noise'
import { solarPosition } from './solar'
import type { TargetId } from '../data/targets'

export type LayerId = 'terrain' | 'thermal' | 'roughness' | 'slope' | 'score'

export interface LayerMeta {
  id: LayerId
  label: string
  unit: string
  source: string
  twin: string
  simulated: boolean
  stops: string[]
}

export const LAYERS: LayerMeta[] = [
  {
    id: 'terrain',
    label: 'Elevation',
    unit: 'm',
    source: 'Terrain tiles (SRTM-derived)',
    twin: 'LOLA · MOLA',
    simulated: false,
    stops: ['#0b0c0f', '#1c1d22', '#34343a', '#5a5856', '#8c8780', '#c9c4bb', '#f2efe9'],
  },
  {
    id: 'thermal',
    label: 'Surface temperature',
    unit: '°C',
    source: 'VIIRS LST · 13:30 overpass',
    twin: 'Diviner · THEMIS',
    simulated: true,
    stops: ['#000004', '#1b0c41', '#4a0c6b', '#781c6d', '#a52c60', '#cf4446', '#ed6925', '#fb9b06', '#f7d13d', '#fcffa4'],
  },
  {
    id: 'roughness',
    label: 'Radar roughness',
    unit: 'dB',
    source: 'Sentinel-1 σ⁰ VV',
    twin: 'Mini-RF · SHARAD',
    simulated: true,
    stops: ['#0b0405', '#2a1c3d', '#3b3472', '#3a5a99', '#3482a4', '#37a8ac', '#5fceac', '#b3e7c5', '#def5e5'],
  },
  {
    id: 'slope',
    label: 'Slope',
    unit: '°',
    source: 'Derived from DEM',
    twin: 'LOLA · HiRISE DTM',
    simulated: false,
    stops: ['#440154', '#482878', '#3e4989', '#31688e', '#26828e', '#1f9e89', '#35b779', '#6ece58', '#b5de2b', '#fde725'],
  },
  {
    id: 'score',
    label: 'Analog score',
    unit: '%',
    source: 'Twin-sensor fusion',
    twin: 'Selected target',
    simulated: true,
    stops: ['#050506', '#1a1020', '#4a1528', '#8f2323', '#d9481c', '#ff8a3d', '#ffd08a', '#ffffff'],
  },
]

export const layerById = (id: LayerId) => LAYERS.find((l) => l.id === id)!

export interface Fields {
  slope: Float32Array
  thermal: Float32Array
  roughness: Float32Array
  /** 0..1 baked relief shading (NW light) */
  shade: Float32Array
  score: Record<TargetId, Float32Array>
}

const DEG = 180 / Math.PI

export function computeFields(dem: Dem): Fields {
  const N = dem.size
  const h = dem.heights
  const size = N * N
  const slope = new Float32Array(size)
  const thermal = new Float32Array(size)
  const roughness = new Float32Array(size)
  const shade = new Float32Array(size)
  const arsia = new Float32Array(size)
  const tranq = new Float32Array(size)
  const shackleton = new Float32Array(size)

  const sun = solarPosition(13.5)
  // Approximate centres of the young Ovabağ field and the summit fissure.
  const field = lonLatToUV(40.0, 37.69)
  const summit = lonLatToUV(39.828, 37.712)

  for (let y = 0; y < N; y++) {
    const ym = y > 0 ? y - 1 : y
    const yp = y < N - 1 ? y + 1 : y
    const v = y / (N - 1)
    for (let x = 0; x < N; x++) {
      const xm = x > 0 ? x - 1 : x
      const xp = x < N - 1 ? x + 1 : x
      const i = y * N + x
      const u = x / (N - 1)

      // gradients: east and north, metres per metre
      const gx = (h[y * N + xp] - h[y * N + xm]) / ((xp - xm) * CELL_M)
      const gn = (h[ym * N + x] - h[yp * N + x]) / ((yp - ym) * CELL_M)
      const sl = Math.atan(Math.hypot(gx, gn)) * DEG
      slope[i] = sl

      const ex = 3
      shade[i] = Math.max(
        0,
        (gx * ex * 0.5 - gn * ex * 0.5 + 0.7071) / Math.hypot(gx * ex, gn * ex, 1),
      )

      const f1 = fbm(u * 9, v * 9, 11, 4)
      const f2 = fbm(u * 42, v * 42, 23, 3)

      // simulated young-lava mask
      const d = Math.hypot(u - field.u, v - field.v)
      let lava = Math.exp(-(d * d) / (2 * 0.11 * 0.11)) * (0.35 + 1.1 * f1)
      const dr = Math.abs(u - summit.u - (v - summit.v) * 0.1)
      const dv = v - summit.v
      lava +=
        0.5 *
        Math.exp(-(dr * dr) / (2 * 0.035 * 0.035)) *
        Math.exp(-(dv * dv) / (2 * 0.2 * 0.2)) *
        (0.3 + f1)
      lava = smoothstep(0.38, 0.72, lava)

      const insolation =
        (-gx * sun.e - gn * sun.n + sun.up) / Math.hypot(gx, gn, 1)
      thermal[i] =
        17 -
        (6.5 * (h[i] - 700)) / 1000 +
        6.5 * lava +
        14 * (insolation - sun.up) +
        2 * (f2 - 0.5)

      roughness[i] =
        -19.5 + 8.5 * lava * (0.55 + 0.45 * f2) + 0.22 * sl + 2.5 * (f1 - 0.5)

      const flat = 1 - smoothstep(3, 12, sl)
      const steep = smoothstep(6, 22, sl)
      const northFacing = clamp01(0.5 - gn * 6)
      arsia[i] =
        100 * clamp01(0.12 + 0.5 * lava + 0.2 * flat + 0.18 * lava * f2 + 0.08 * (f1 - 0.5))
      tranq[i] =
        100 * clamp01(0.08 + 0.62 * lava * flat + 0.12 * flat + 0.1 * (f2 - 0.5))
      shackleton[i] =
        100 *
        clamp01(
          0.04 +
            0.42 * steep +
            0.22 * northFacing * steep +
            0.1 * smoothstep(1400, 1900, h[i]) +
            0.06 * (f1 - 0.5),
        )
    }
  }

  return { slope, thermal, roughness, shade, score: { arsia, tranq, shackleton } }
}

export function layerDomain(layer: LayerId, dem: Dem): [number, number] {
  switch (layer) {
    case 'terrain':
      return [Math.floor(dem.min / 50) * 50, Math.ceil(dem.max / 50) * 50]
    case 'thermal':
      return [4, 30]
    case 'roughness':
      return [-22, -6]
    case 'slope':
      return [0, 25]
    case 'score':
      return [0, 100]
  }
}

export function layerField(
  layer: LayerId,
  dem: Dem,
  fields: Fields,
  target: TargetId,
): Float32Array {
  switch (layer) {
    case 'terrain':
      return dem.heights
    case 'thermal':
      return fields.thermal
    case 'roughness':
      return fields.roughness
    case 'slope':
      return fields.slope
    case 'score':
      return fields.score[target]
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
export function bakeLayer(
  dem: Dem,
  fields: Fields,
  layer: LayerId,
  target: TargetId,
): HTMLCanvasElement {
  const N = dem.size
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = N
  const ctx = canvas.getContext('2d')!
  const img = ctx.createImageData(N, N)
  const out = img.data
  const src = layerField(layer, dem, fields, target)
  const [lo, hi] = layerDomain(layer, dem)
  const lut = getLut(layer)
  const h = dem.heights
  const base = layer === 'terrain' ? 0.62 : 0.8
  const amp = layer === 'terrain' ? 0.55 : 0.28
  const contour = layer === 'terrain' ? 1 : 0.6

  for (let i = 0; i < N * N; i++) {
    const k = (clamp01((src[i] - lo) / (hi - lo)) * 255) | 0
    const s = base + amp * fields.shade[i]
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

export const GRID_SIZE = GRID
