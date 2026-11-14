// Real elevation for Karacadağ, read from Terrarium-encoded tiles in /public/dem
// (AWS Terrain Tiles, zoom 11). Falls back to a procedural shield volcano.

import { fbm } from './noise'

export const GRID = 1024
const Z = 11
const X0 = 1249
const Y0 = 790
const TILES = 4
const TILE_PX = GRID / TILES
const n = 2 ** Z

const tileLon = (x: number) => (x / n) * 360 - 180
const tileLat = (y: number) =>
  (Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / n))) * 180) / Math.PI

export const BOUNDS = {
  west: tileLon(X0),
  east: tileLon(X0 + TILES),
  north: tileLat(Y0),
  south: tileLat(Y0 + TILES),
}

export const SITE_LAT = 37.67
/** Ground width of the square scene, km. */
export const EXTENT_KM =
  ((40075.017 * Math.cos((SITE_LAT * Math.PI) / 180)) / n) * TILES
export const CELL_M = (EXTENT_KM * 1000) / GRID
/** Scene units across the terrain. */
export const WORLD = 100

export interface Dem {
  size: number
  heights: Float32Array
  min: number
  max: number
  /** false when the procedural fallback is in use */
  real: boolean
}

export interface UV {
  u: number
  v: number
}

/** u: west→east, v: north→south, both 0..1 */
export function uvToLonLat(u: number, v: number) {
  return {
    lon: BOUNDS.west + u * (BOUNDS.east - BOUNDS.west),
    lat: tileLat(Y0 + v * TILES),
  }
}

export function lonLatToUV(lon: number, lat: number): UV {
  const rad = (lat * Math.PI) / 180
  const y = ((1 - Math.asinh(Math.tan(rad)) / Math.PI) / 2) * n
  return {
    u: (lon - BOUNDS.west) / (BOUNDS.east - BOUNDS.west),
    v: (y - Y0) / TILES,
  }
}

export function uvToIndex(u: number, v: number, size = GRID) {
  const x = Math.min(size - 1, Math.max(0, Math.round(u * (size - 1))))
  const y = Math.min(size - 1, Math.max(0, Math.round(v * (size - 1))))
  return y * size + x
}

export function sampleHeight(dem: Dem, u: number, v: number) {
  return dem.heights[uvToIndex(u, v, dem.size)]
}

/** Metres above the DEM minimum → scene units (before vertical exaggeration). */
export function heightToY(h: number, dem: Dem) {
  return (h - dem.min) / ((EXTENT_KM * 1000) / WORLD)
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load ${src}`))
    img.src = src
  })
}

function finish(heights: Float32Array, real: boolean): Dem {
  let min = Infinity
  let max = -Infinity
  for (let i = 0; i < heights.length; i++) {
    const h = heights[i]
    if (h < min) min = h
    if (h > max) max = h
  }
  return { size: GRID, heights, min, max, real }
}

export async function loadDem(onProgress?: (p: number) => void): Promise<Dem> {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = GRID
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) throw new Error('Canvas 2D unavailable')

  const jobs: Promise<void>[] = []
  let done = 0
  for (let i = 0; i < TILES; i++) {
    for (let j = 0; j < TILES; j++) {
      const src = `${import.meta.env.BASE_URL}dem/${X0 + i}_${Y0 + j}.png`
      jobs.push(
        loadImage(src).then((img) => {
          ctx.drawImage(img, i * TILE_PX, j * TILE_PX)
          onProgress?.(++done / (TILES * TILES))
        }),
      )
    }
  }
  await Promise.all(jobs)

  const { data } = ctx.getImageData(0, 0, GRID, GRID)
  const heights = new Float32Array(GRID * GRID)
  for (let i = 0; i < heights.length; i++) {
    const p = i * 4
    heights[i] = data[p] * 256 + data[p + 1] + data[p + 2] / 256 - 32768
  }
  const dem = finish(heights, true)
  if (!Number.isFinite(dem.min) || dem.max - dem.min < 50 || dem.max > 6000) {
    throw new Error('Elevation tiles decoded to an implausible range')
  }
  return dem
}

/** Synthetic shield volcano used only when the tiles cannot be read. */
export function proceduralDem(): Dem {
  const heights = new Float32Array(GRID * GRID)
  for (let y = 0; y < GRID; y++) {
    for (let x = 0; x < GRID; x++) {
      const u = x / (GRID - 1)
      const v = y / (GRID - 1)
      const du = u - 0.4
      const dv = (v - 0.6) * 0.6
      const shield = Math.exp(-(du * du + dv * dv) / (2 * 0.16 * 0.16))
      heights[y * GRID + x] =
        700 + 1150 * shield + 160 * fbm(u * 6, v * 6, 5, 5) * (0.3 + shield)
    }
  }
  return finish(heights, false)
}
