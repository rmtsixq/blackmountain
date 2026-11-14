// Real elevation for Karacadağ, read from Terrarium-encoded tiles in /public/dem
// (AWS Terrain Tiles, zoom 11).

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
/** Ground width of the square scene, km. Twin terrains cover the same width. */
export const EXTENT_KM =
  ((40075.017 * Math.cos((SITE_LAT * Math.PI) / 180)) / n) * TILES
/** Scene units across the terrain. */
export const WORLD = 100

/** A square elevation grid, row 0 = north. */
export interface Dem {
  size: number
  heights: Float32Array
  min: number
  max: number
}

export interface UV {
  u: number
  v: number
}

export const cellMetres = (dem: Dem) => (EXTENT_KM * 1000) / dem.size

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

export function makeDem(heights: Float32Array, size: number): Dem {
  let min = Infinity
  let max = -Infinity
  for (let i = 0; i < heights.length; i++) {
    const h = heights[i]
    if (h < min) min = h
    if (h > max) max = h
  }
  return { size, heights, min, max }
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load ${src}`))
    img.src = src
  })
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
  const dem = makeDem(heights, GRID)
  if (!Number.isFinite(dem.min) || dem.max - dem.min < 50 || dem.max > 6000) {
    throw new Error('Elevation tiles decoded to an implausible range')
  }
  return dem
}

/** Halve a grid by averaging 2×2 blocks. */
export function downsample(dem: Dem): Dem {
  const size = dem.size / 2
  const out = new Float32Array(size * size)
  const h = dem.heights
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = y * 2 * dem.size + x * 2
      out[y * size + x] = (h[i] + h[i + 1] + h[i + dem.size] + h[i + dem.size + 1]) / 4
    }
  }
  return makeDem(out, size)
}

/** Bilinear resample of a square grid to a new size. */
export function resample(src: Float32Array, from: number, to: number) {
  const out = new Float32Array(to * to)
  const k = (from - 1) / (to - 1)
  for (let y = 0; y < to; y++) {
    const fy = y * k
    const y0 = Math.min(from - 2, Math.floor(fy))
    const ty = fy - y0
    for (let x = 0; x < to; x++) {
      const fx = x * k
      const x0 = Math.min(from - 2, Math.floor(fx))
      const tx = fx - x0
      const i = y0 * from + x0
      out[y * to + x] =
        src[i] * (1 - tx) * (1 - ty) +
        src[i + 1] * tx * (1 - ty) +
        src[i + from] * (1 - tx) * ty +
        src[i + from + 1] * tx * ty
    }
  }
  return out
}
