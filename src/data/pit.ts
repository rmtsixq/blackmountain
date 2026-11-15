// The collapse pit visited on 14–15 November 2026.
//
// What is ours:      LOG (thermometer readings) and OUR_PIT (from the scan).
// What is published: WEATHER (hourly weather-model air temperature for the
//                    site) and CATALOG (pits on the Moon and Mars).
// What is a model:   pitModel(), a damped response with stated assumptions.

import { PIT_SCAN } from './pitScan'

/** Clock hours counted from 00:00 on 14 November, so 30 is 06:00 on the 15th. */
export interface Reading {
  hour: number
  inside: number
  outside: number
}

/**
 * Our thermometer readings, inside the pit and outside it. The thermometers
 * stayed in place from 16:00 until 06:00 the next morning. Add each further
 * reading here (for example `{ hour: 30, inside: …, outside: … }` for 06:00);
 * the chart and the text pick them up.
 */
export const LOG: Reading[] = [{ hour: 16, inside: 13.0, outside: 10.3 }]

export const MEASURED = {
  date: '14 Nov 2026',
  hour: LOG[0].hour,
  /** 06:00 on the 15th */
  loggedUntil: 30,
  inside: LOG[0].inside,
  outside: LOG[0].outside,
  humidity: 75,
}

// ── Hourly air temperature for the site ─────────────────────────────────────
// Open-Meteo weather-model analysis, 2 m air temperature, grid cell at
// 37.70°N 40.01°E (1029 m), Europe/Istanbul time, 14 Nov 10:00 to 15 Nov 08:00.
// Fetched 15 Nov 2026 from api.open-meteo.com/v1/forecast.

const FIRST_HOUR = 10
const AIR = [
  11.3, 12.2, 13.0, 14.2, 14.9, 14.1, 13.3, 12.5, 11.4, 10.9, 10.6, 10.3, 10.0, 9.8, 9.3, 9.2, 9.0, 8.7, 8.6, 8.6,
  8.5, 8.7, 9.5,
]

export const WEATHER = AIR.map((air, i) => ({ hour: FIRST_HOUR + i, air }))

const airAt = (hour: number) => {
  const i = Math.min(AIR.length - 1, Math.max(0, hour - FIRST_HOUR))
  const a = Math.floor(i)
  const b = Math.min(AIR.length - 1, a + 1)
  return AIR[a] + (AIR[b] - AIR[a]) * (i - a)
}

/** How far the air around the site cooled between the first reading and 06:00. */
export const NIGHT_DROP = airAt(MEASURED.hour) - airAt(MEASURED.loggedUntil)

/**
 * Air outside the pit through the night: the hourly weather data, shifted so
 * it passes through our own outside reading.
 */
export const outsideAt = (hour: number) => MEASURED.outside + airAt(hour) - airAt(MEASURED.hour)

// Assumptions of the pit model: the pit floor follows the outside air at a
// fifth of its amplitude, two hours late. They are assumptions, not a fit.
export const PIT_MODEL = { damping: 0.2, lagHours: 2 }

export const pitModel = (hour: number) =>
  MEASURED.inside +
  PIT_MODEL.damping * (airAt(hour - PIT_MODEL.lagHours) - airAt(MEASURED.hour - PIT_MODEL.lagHours))

/** The chart's time axis: noon on the 14th to 08:00 on the 15th. */
export const NIGHT_HOURS: [number, number] = [12, 32]

/** Published model result for the Moon (Horvath et al. 2022). */
export const LUNAR_PIT = { surfaceSwingK: 290, shadowedFloorC: 17 }

// ── Pits on the Moon and Mars ───────────────────────────────────────────────
// Moon: LROC narrow-angle camera measurements (Robinson et al. 2012 and the
// LROC featured-image notes): Mare Tranquillitatis about 100 m across and
// 105 m deep, Mare Ingenii about 120 m and 70 m, Marius Hills 65 × 90 m and
// about 34 m. Mars: Cushing et al. 2007, THEMIS; depths are minimums because
// the floors are in shadow.

export interface CatalogPit {
  body: 'moon' | 'mars'
  name: string
  width: number
  depth: number
  /** the depth is a lower bound */
  atLeast?: boolean
}

export const CATALOG: CatalogPit[] = [
  { body: 'moon', name: 'Mare Tranquillitatis', width: 100, depth: 105 },
  { body: 'moon', name: 'Mare Ingenii', width: 120, depth: 70 },
  { body: 'moon', name: 'Marius Hills', width: Math.sqrt(65 * 90), depth: 34 },
  { body: 'mars', name: 'Annie', width: 225, depth: 101, atLeast: true },
  { body: 'mars', name: 'Dena', width: 162, depth: 80, atLeast: true },
]

/** How many such features are catalogued (LROC pit atlas; USGS MGC³). */
export const PIT_COUNTS = { moon: 300, mars: 1000 }

/** Our pit, from the scan. */
export const OUR_PIT = {
  width: PIT_SCAN.equivalent_diameter_m,
  depth: PIT_SCAN.depth_m,
  ratio: PIT_SCAN.depth_m / PIT_SCAN.equivalent_diameter_m,
}

const ratios = CATALOG.map((p) => p.depth / p.width)
const widths = CATALOG.map((p) => p.width)

/** Where our pit sits among the published ones. */
export const PIT_RANGE = {
  ratio: [Math.min(...ratios), Math.max(...ratios)] as [number, number],
  timesSmaller: [Math.min(...widths) / OUR_PIT.width, Math.max(...widths) / OUR_PIT.width] as [number, number],
}
