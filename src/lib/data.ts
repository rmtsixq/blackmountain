import { fetchPacked, unpackRaster } from './pack'
// Rasters written by scripts/ingest.py into /public/data.

export interface RasterMeta {
  file: string
  /** value range of a packed raster (scripts/pack.py) */
  scale: [number, number]
  min: number
  max: number
  mean: number
  unit?: string
  source?: string
  date?: string
  resolution_m?: number
  body?: string
  lat?: number
  lon?: number
}

export interface LstRow {
  month: string
  field_day: number | null
  field_night: number | null
  summit_day: number | null
  summit_night: number | null
}

export interface Manifest {
  size: number
  extent_km: number
  rasters: Record<string, RasterMeta>
  lst_series: LstRow[]
  lst_annual: Record<'field_day' | 'field_night' | 'summit_day' | 'summit_night', number | null>
  /** established analog sites, each with a `site_<id>` raster */
  sites: SiteMeta[]
}

export interface SiteMeta {
  id: string
  name: string
  region: string
  lat: number
  lon: number
  why: string
}

export const RASTERS = ['lst_day', 'lst_night', 'lst_swing', 's1_vv', 'arsia', 'tranq', 'shackleton'] as const
export type RasterName = (typeof RASTERS)[number]

export interface SceneData {
  manifest: Manifest
  grids: Record<RasterName, Float32Array>
  /** elevation of each benchmark site, by site id */
  sites: Record<string, Float32Array>
}

export async function loadData(onProgress?: (p: number) => void): Promise<SceneData> {
  const base = `${import.meta.env.BASE_URL}data/`
  const res = await fetch(`${base}manifest.json`)
  if (!res.ok) throw new Error('Data manifest missing — run scripts/ingest.py')
  const manifest = (await res.json()) as Manifest

  const siteNames = (manifest.sites ?? []).map((s) => `site_${s.id}`)
  const names = [...RASTERS, ...siteNames]
  let done = 0
  const entries = await Promise.all(
    names.map(async (name) => {
      const meta = manifest.rasters[name]
      if (!meta) throw new Error(`Raster "${name}" missing from manifest`)
      const grid = unpackRaster(await fetchPacked(base + meta.file), manifest.size, meta.scale)
      onProgress?.(++done / names.length)
      return [name, grid] as const
    }),
  )
  const all = Object.fromEntries(entries)
  return {
    manifest,
    grids: all as Record<RasterName, Float32Array>,
    sites: Object.fromEntries((manifest.sites ?? []).map((s) => [s.id, all[`site_${s.id}`]])),
  }
}
