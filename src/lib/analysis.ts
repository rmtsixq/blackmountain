// The terrain comparison. Every number here is computed from real elevation:
// Karacadağ and the three targets, all resampled to the same 121 m grid over
// the same 62 km square.

import { cellMetres, type Dem } from './dem'
import type { TargetId } from '../data/targets'

/** Baseline, in cells, for slope and roughness (≈ 480 m). Coarser than the
 *  worst native resolution (Mars, 200 m), so no DEM is flattered by detail. */
const B = 2
export const BASELINE_M = 484

export const SLOPE_BINS = 30 // 1° each, last bin open-ended
export const ROUGH_BINS = 24 // log10 metres from -1 to 2
export const SUN_ELEVATIONS = [1.5, 3, 5, 8, 12, 20, 30]

export const RADIUS_KM = { earth: 6371, moon: 1737.4, mars: 3389.5 }

export interface BodyStats {
  slope: Float32Array
  rough: Float32Array
  slopeHist: number[]
  roughHist: number[]
  medianSlope: number
  p90Slope: number
  medianRough: number
  relief: number
  /** share of ground in shadow at each of SUN_ELEVATIONS */
  shadow: number[]
}

export interface TwinStats extends BodyStats {
  slopeSim: number
  roughSim: number
  /** smaller relief over larger relief */
  reliefSim: number
  /** 0–100, mean of slope, roughness and relief similarity */
  topo: number
  /** 0–100, shared area of the two shadow curves */
  light: number
}

export interface BestPatch {
  u: number
  v: number
  score: number
}

/** One Earth site scored against every target with the same method. */
export interface SiteScore {
  id: string
  name: string
  region: string
  why: string
  /** Karacadağ itself */
  home: boolean
  medianSlope: number
  relief: number
  topo: Record<TargetId, number>
  light: Record<TargetId, number>
}

export interface SiteInput {
  id: string
  name: string
  region: string
  why: string
  dem: Dem
}

export interface Analysis {
  earth: BodyStats
  twins: Record<TargetId, TwinStats>
  /** Karacadağ and the established analog sites, unsorted */
  sites: SiteScore[]
  /** local terrain match, 0–100, on the 512 grid */
  match: Record<TargetId, Float32Array>
  best: Record<TargetId, BestPatch>
}

const DEG = 180 / Math.PI

function slopeAndRoughness(dem: Dem) {
  const N = dem.size
  const h = dem.heights
  const cell = cellMetres(dem)
  const slope = new Float32Array(N * N)
  const rough = new Float32Array(N * N)
  const cl = (i: number) => (i < 0 ? 0 : i >= N ? N - 1 : i)
  for (let y = 0; y < N; y++) {
    const ym = cl(y - B)
    const yp = cl(y + B)
    for (let x = 0; x < N; x++) {
      const xm = cl(x - B)
      const xp = cl(x + B)
      const e = h[y * N + xp]
      const w = h[y * N + xm]
      const nn = h[ym * N + x]
      const s = h[yp * N + x]
      const gx = (e - w) / ((xp - xm) * cell)
      const gy = (nn - s) / ((yp - ym) * cell)
      const i = y * N + x
      slope[i] = Math.atan(Math.hypot(gx, gy)) * DEG
      // height above or below the mean of the ring one baseline away
      const ring =
        (e + w + nn + s + h[ym * N + xm] + h[ym * N + xp] + h[yp * N + xm] + h[yp * N + xp]) / 8
      rough[i] = Math.abs(h[i] - ring)
    }
  }
  return { slope, rough }
}

const slopeBin = (s: number) => Math.min(SLOPE_BINS - 1, Math.floor(s))
const roughBin = (r: number) =>
  Math.min(ROUGH_BINS - 1, Math.max(0, Math.floor(((Math.log10(r + 1e-3) + 1) / 3) * ROUGH_BINS)))

function normalise(counts: number[]) {
  const total = counts.reduce((a, b) => a + b, 0) || 1
  return counts.map((c) => c / total)
}

function quantile(values: Float32Array, q: number) {
  const sorted = Float32Array.from(values).sort()
  return sorted[Math.floor(q * (sorted.length - 1))]
}

/** 1 − Jensen–Shannon distance (base 2): 1 = identical, 0 = disjoint. */
export function similarity(p: number[], q: number[]) {
  let js = 0
  for (let i = 0; i < p.length; i++) {
    const m = (p[i] + q[i]) / 2
    if (p[i] > 0) js += 0.5 * p[i] * Math.log2(p[i] / m)
    if (q[i] > 0) js += 0.5 * q[i] * Math.log2(q[i] / m)
  }
  return 1 - Math.sqrt(Math.max(0, js))
}

/**
 * Share of ground in shadow for a range of sun elevations, averaged over four
 * sun azimuths. Uses the horizon angle along each direction, including the
 * planet's curvature — over 62 km that matters a lot on the Moon.
 */
function shadowCurve(dem: Dem, radiusKm: number) {
  const step = 4
  const N = dem.size / step
  const cell = cellMetres(dem) * step
  const h = new Float32Array(N * N)
  for (let y = 0; y < N; y++)
    for (let x = 0; x < N; x++) h[y * N + x] = dem.heights[y * step * dem.size + x * step]

  const R = radiusKm * 1000
  const tans = SUN_ELEVATIONS.map((e) => Math.tan(e / DEG))
  const counts = SUN_ELEVATIONS.map(() => 0)
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ]
  const reach = 60 // cells, ≈ 29 km
  let samples = 0
  for (let y = 0; y < N; y += 1) {
    for (let x = 0; x < N; x += 1) {
      const h0 = h[y * N + x]
      for (const [dx, dy] of dirs) {
        let horizon = -Infinity
        for (let k = 1; k <= reach; k++) {
          const xx = x + dx * k
          const yy = y + dy * k
          if (xx < 0 || yy < 0 || xx >= N || yy >= N) break
          const d = k * cell
          const t = (h[yy * N + xx] - h0 - (d * d) / (2 * R)) / d
          if (t > horizon) horizon = t
        }
        samples++
        for (let e = 0; e < tans.length; e++) if (horizon > tans[e]) counts[e]++
      }
    }
  }
  return counts.map((c) => c / samples)
}

function bodyStats(dem: Dem, radiusKm: number): BodyStats {
  const { slope, rough } = slopeAndRoughness(dem)
  const sh = new Array<number>(SLOPE_BINS).fill(0)
  const rh = new Array<number>(ROUGH_BINS).fill(0)
  for (let i = 0; i < slope.length; i++) {
    sh[slopeBin(slope[i])]++
    rh[roughBin(rough[i])]++
  }
  return {
    slope,
    rough,
    slopeHist: normalise(sh),
    roughHist: normalise(rh),
    medianSlope: quantile(slope, 0.5),
    p90Slope: quantile(slope, 0.9),
    medianRough: quantile(rough, 0.5),
    relief: dem.max - dem.min,
    shadow: shadowCurve(dem, radiusKm),
  }
}

// Local windows are small, so their histograms use merged bins.
const merge = (hist: number[], by: number) => {
  const out: number[] = []
  for (let i = 0; i < hist.length; i += by) {
    let s = 0
    for (let k = i; k < i + by && k < hist.length; k++) s += hist[k]
    out.push(s)
  }
  return out
}
const S_MERGE = 3
const R_MERGE = 3
const WIN = 24 // cells, ≈ 2.9 km
const STRIDE = 8

function localMatch(earth: BodyStats, twin: BodyStats, N: number) {
  const ts = merge(twin.slopeHist, S_MERGE)
  const tr = merge(twin.roughHist, R_MERGE)
  const count = Math.floor((N - WIN) / STRIDE) + 1
  const coarse = new Float32Array(count * count)
  let best: BestPatch = { u: 0.5, v: 0.5, score: -1 }
  for (let wy = 0; wy < count; wy++) {
    for (let wx = 0; wx < count; wx++) {
      const sh = new Array<number>(SLOPE_BINS).fill(0)
      const rh = new Array<number>(ROUGH_BINS).fill(0)
      for (let y = wy * STRIDE; y < wy * STRIDE + WIN; y++) {
        for (let x = wx * STRIDE; x < wx * STRIDE + WIN; x++) {
          const i = y * N + x
          sh[slopeBin(earth.slope[i])]++
          rh[roughBin(earth.rough[i])]++
        }
      }
      const score =
        50 *
        (similarity(merge(normalise(sh), S_MERGE), ts) + similarity(merge(normalise(rh), R_MERGE), tr))
      coarse[wy * count + wx] = score
      if (score > best.score) {
        best = {
          u: (wx * STRIDE + WIN / 2) / N,
          v: (wy * STRIDE + WIN / 2) / N,
          score,
        }
      }
    }
  }
  // spread the window scores back over the grid
  const out = new Float32Array(N * N)
  const at = (c: number) => Math.min(count - 1, Math.max(0, (c - WIN / 2) / STRIDE))
  for (let y = 0; y < N; y++) {
    const fy = at(y)
    const y0 = Math.min(count - 2, Math.floor(fy))
    const ty = fy - y0
    for (let x = 0; x < N; x++) {
      const fx = at(x)
      const x0 = Math.min(count - 2, Math.floor(fx))
      const tx = fx - x0
      const i = y0 * count + x0
      out[y * N + x] =
        coarse[i] * (1 - tx) * (1 - ty) +
        coarse[i + 1] * tx * (1 - ty) +
        coarse[i + count] * (1 - tx) * ty +
        coarse[i + count + 1] * tx * ty
    }
  }
  return { map: out, best }
}

export const TARGET_RADIUS: Record<TargetId, number> = {
  arsia: RADIUS_KM.mars,
  tranq: RADIUS_KM.moon,
  shackleton: RADIUS_KM.moon,
}

function compare(e: BodyStats, t: BodyStats) {
  const slopeSim = similarity(e.slopeHist, t.slopeHist)
  const roughSim = similarity(e.roughHist, t.roughHist)
  const reliefSim = Math.min(e.relief, t.relief) / Math.max(e.relief, t.relief)
  // Ružička similarity of the two shadow curves: shared area over total area.
  let shared = 0
  let total = 0
  for (let i = 0; i < e.shadow.length; i++) {
    shared += Math.min(e.shadow[i], t.shadow[i])
    total += Math.max(e.shadow[i], t.shadow[i])
  }
  return {
    slopeSim,
    roughSim,
    reliefSim,
    topo: (100 * (slopeSim + roughSim + reliefSim)) / 3,
    light: total > 0 ? (100 * shared) / total : 100,
  }
}

/** Every grid must be the same size and cover the same ground width. */
export function analyse(earth: Dem, twins: Record<TargetId, Dem>, sites: SiteInput[]): Analysis {
  const e = bodyStats(earth, RADIUS_KM.earth)
  const out = { earth: e, twins: {}, match: {}, best: {}, sites: [] } as unknown as Analysis
  const ids = Object.keys(twins) as TargetId[]
  const stats = {} as Record<TargetId, BodyStats>
  for (const id of ids) {
    const t = bodyStats(twins[id], TARGET_RADIUS[id])
    stats[id] = t
    out.twins[id] = { ...t, ...compare(e, t) }
    const local = localMatch(e, t, earth.size)
    out.match[id] = local.map
    out.best[id] = local.best
  }

  const score = (s: BodyStats, meta: Pick<SiteScore, 'id' | 'name' | 'region' | 'why' | 'home'>) => {
    const row = {
      ...meta,
      medianSlope: s.medianSlope,
      relief: s.relief,
      topo: {},
      light: {},
    } as SiteScore
    for (const id of ids) {
      const c = compare(s, stats[id])
      row.topo[id] = c.topo
      row.light[id] = c.light
    }
    return row
  }
  out.sites.push(
    score(e, { id: 'karacadag', name: 'Karacadağ', region: 'Türkiye', why: 'This study', home: true }),
  )
  for (const s of sites) {
    out.sites.push(
      score(bodyStats(s.dem, RADIUS_KM.earth), {
        id: s.id,
        name: s.name,
        region: s.region,
        why: s.why,
        home: false,
      }),
    )
  }
  return out
}

/** Sites ordered by terrain match for one target, best first. */
export const rankSites = (analysis: Analysis, target: TargetId) =>
  [...analysis.sites].sort((a, b) => b.topo[target] - a.topo[target])
