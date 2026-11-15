// The collapse pit visited on 14 November 2026.
//
// MEASURED is real: one handheld reading at the pit and outside it.
// Everything else in this file is DEMO DATA, marked † in the UI. It shows what
// the figures will look like once the loggers are deployed and the published
// pit catalogues are ingested. Replace, do not cite.

import { PIT_SCAN } from './pitScan'

/**
 * One handheld reading, at about 15:00. The thermometers then stayed in place
 * overnight, inside and outside, until 06:00 the next morning; that record has
 * not been entered yet.
 */
export const MEASURED = {
  date: '14 Nov 2026',
  hour: 15,
  loggedUntil: 6,
  inside: 13.0,
  outside: 10.3,
  humidity: 75,
}

// ── † 24-hour curve ──────────────────────────────────────────────────────────
// Illustrative shapes, anchored so the pit and air curves pass through the one
// real reading. The damping they show is the hypothesis, not a result.

export interface DayPoint {
  hour: number
  surface: number
  air: number
  pit: number
}

const cosine = (hour: number, peak: number) => Math.cos((2 * Math.PI * (hour - peak)) / 24)

export const DAY_CURVE: DayPoint[] = Array.from({ length: 49 }, (_, i) => {
  const hour = i * 0.5
  const sun = Math.max(0, Math.sin((Math.PI * (hour - 6.6)) / 10.2))
  return {
    hour,
    surface: +(3.4 + 15.8 * sun ** 1.3 + 1.6 * cosine(hour, 15)).toFixed(2),
    air: +(6.93 + 3.4 * cosine(hour, 14.5)).toFixed(2),
    pit: +(12.64 + 0.45 * cosine(hour, 17.5)).toFixed(2),
  }
})

/** Published model result for the Moon, for the caption (Horvath et al. 2022). */
export const LUNAR_PIT = { surfaceSwingK: 290, shadowedFloorC: 17 }

// ── † Pit catalogue ──────────────────────────────────────────────────────────
// Illustrative width / depth points standing in for the LROC lunar pit atlas
// and the USGS Mars cave candidate catalogue. The named points use rounded
// dimensions quoted from memory of the literature and still need checking.

export interface CatalogPit {
  body: 'moon' | 'mars'
  width: number
  depth: number
  name?: string
}

function lcg(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

function scatter(body: CatalogPit['body'], n: number, seed: number, w: [number, number], ratio: [number, number]) {
  const rnd = lcg(seed)
  return Array.from({ length: n }, (): CatalogPit => {
    const width = Math.exp(Math.log(w[0]) + rnd() * (Math.log(w[1]) - Math.log(w[0])))
    const r = ratio[0] + (rnd() + rnd()) * 0.5 * (ratio[1] - ratio[0])
    return { body, width: +width.toFixed(1), depth: +(width * r).toFixed(1) }
  })
}

export const CATALOG: CatalogPit[] = [
  ...scatter('moon', 70, 11, [6, 420], [0.18, 1.05]),
  ...scatter('mars', 55, 29, [55, 340], [0.3, 1.3]),
  { body: 'moon', width: 100, depth: 105, name: 'Mare Tranquillitatis' },
  { body: 'moon', width: 53, depth: 40, name: 'Marius Hills' },
  { body: 'mars', width: 150, depth: 178, name: 'Arsia skylight' },
]

/** Our pit, from the scan. This point is real. */
export const OUR_PIT = {
  width: PIT_SCAN.equivalent_diameter_m,
  depth: PIT_SCAN.depth_m,
  ratio: PIT_SCAN.depth_m / PIT_SCAN.equivalent_diameter_m,
}
