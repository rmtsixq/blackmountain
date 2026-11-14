// DEMO DATA — every value in this file is a placeholder generated to look like
// the planned field campaign. Replace with the GPS log and the field sheet.
// Coordinates are approximate positions around the Ovabağ lava field.

export type StationKind = 'tube' | 'thermal' | 'quadrat'

export interface Station {
  id: string
  code: string
  name: string
  kind: StationKind
  lon: number
  lat: number
  /** °C, IR thermometer at 13:30 */
  surfaceTemp: number
  airTemp: number
  humidity: number
  /** % of quadrat area covered by rocks > 5 cm */
  rockCover?: number
  note: string
}

export const KIND_META: Record<StationKind, { label: string; color: string }> = {
  tube: { label: 'Lava tube', color: '#ff6a3d' },
  thermal: { label: 'Thermal point', color: '#ffffff' },
  quadrat: { label: 'Rock quadrat', color: '#8a8a8a' },
}

export const STATIONS: Station[] = [
  { id: 'tube-a', code: 'TUBE-A', name: 'Ovabağ tube · main entrance', kind: 'tube', lon: 40.004, lat: 37.684, surfaceTemp: 9.1, airTemp: 8.8, humidity: 81, note: 'Collapse skylight, roof ~4 m. Thermal profile stations at 0, 10 and 25 m.' },
  { id: 'tube-b', code: 'TUBE-B', name: 'Ovabağ tube · east skylight', kind: 'tube', lon: 40.031, lat: 37.672, surfaceTemp: 10.4, airTemp: 9.6, humidity: 74, note: 'Second opening ~2.5 km downflow. Draught felt at entrance.' },
  { id: 'th-01', code: 'TH-01', name: 'Baruttepe cone flank', kind: 'thermal', lon: 39.972, lat: 37.699, surfaceTemp: 24.6, airTemp: 13.2, humidity: 38, note: 'Fresh scoria, very dark. Hottest surface of the day.' },
  { id: 'th-02', code: 'TH-02', name: 'Young ʻaʻā flow, sunlit', kind: 'thermal', lon: 39.991, lat: 37.692, surfaceTemp: 22.9, airTemp: 13.0, humidity: 40, note: 'Unweathered clinker surface.' },
  { id: 'th-03', code: 'TH-03', name: 'Pāhoehoe ropes', kind: 'thermal', lon: 40.012, lat: 37.676, surfaceTemp: 21.3, airTemp: 13.4, humidity: 41, note: 'Flow wrinkles and lava toes; smooth crust.' },
  { id: 'th-04', code: 'TH-04', name: 'Soil-covered old flow', kind: 'thermal', lon: 40.046, lat: 37.661, surfaceTemp: 16.8, airTemp: 13.6, humidity: 44, note: 'Weathered, grass cover. Control surface.' },
  { id: 'th-05', code: 'TH-05', name: 'North-facing scarp', kind: 'thermal', lon: 39.958, lat: 37.712, surfaceTemp: 11.2, airTemp: 12.1, humidity: 47, note: 'In shade most of the day in November.' },
  { id: 'th-06', code: 'TH-06', name: 'Flow margin', kind: 'thermal', lon: 40.058, lat: 37.693, surfaceTemp: 18.7, airTemp: 13.3, humidity: 42, note: 'Contact between young flow and farmland.' },
  { id: 'qd-01', code: 'QD-01', name: 'Quadrat · fresh flow', kind: 'quadrat', lon: 39.984, lat: 37.686, surfaceTemp: 22.1, airTemp: 13.1, humidity: 40, rockCover: 27, note: 'Blocky ʻaʻā, clasts to 0.9 m.' },
  { id: 'qd-02', code: 'QD-02', name: 'Quadrat · flow levee', kind: 'quadrat', lon: 39.999, lat: 37.698, surfaceTemp: 21.4, airTemp: 13.0, humidity: 40, rockCover: 22, note: 'Levee rubble, angular.' },
  { id: 'qd-03', code: 'QD-03', name: 'Quadrat · tube roof', kind: 'quadrat', lon: 40.009, lat: 37.683, surfaceTemp: 20.2, airTemp: 13.2, humidity: 42, rockCover: 14, note: 'Slabby pāhoehoe above TUBE-A.' },
  { id: 'qd-04', code: 'QD-04', name: 'Quadrat · cone apron', kind: 'quadrat', lon: 39.966, lat: 37.691, surfaceTemp: 23.0, airTemp: 13.2, humidity: 39, rockCover: 18, note: 'Scoria lapilli with bombs.' },
  { id: 'qd-05', code: 'QD-05', name: 'Quadrat · weathered flow', kind: 'quadrat', lon: 40.039, lat: 37.667, surfaceTemp: 17.5, airTemp: 13.5, humidity: 44, rockCover: 8, note: 'Rounded blocks in soil.' },
  { id: 'qd-06', code: 'QD-06', name: 'Quadrat · field wall zone', kind: 'quadrat', lon: 40.066, lat: 37.679, surfaceTemp: 17.1, airTemp: 13.6, humidity: 45, rockCover: 6, note: 'Cleared farmland, stones piled into walls.' },
]

export const stationById = (id: string | null) =>
  STATIONS.find((s) => s.id === id) ?? null

// ── Lava-tube thermal profile ────────────────────────────────────────────────

export interface TubePoint {
  hour: number
  sun: number
  shade: number
  entrance: number
  m10: number
  m25: number
}

const wave = (h: number, lag: number) =>
  Math.max(0, Math.sin((Math.PI * (h - 7 - lag)) / 10.5))

export const TUBE_PROFILE: TubePoint[] = Array.from({ length: 23 }, (_, i) => {
  const hour = 7 + i * 0.5
  const wobble = Math.sin(i * 1.7) * 0.25
  return {
    hour,
    sun: +(4.5 + 19.5 * wave(hour, 0.6) ** 1.15 + wobble).toFixed(1),
    shade: +(4.8 + 8.6 * wave(hour, 1.0) + wobble * 0.6).toFixed(1),
    entrance: +(7.4 + 2.9 * wave(hour, 1.8) + wobble * 0.3).toFixed(1),
    m10: +(8.3 + 0.9 * wave(hour, 2.6) + wobble * 0.1).toFixed(2),
    m25: +(8.6 + 0.28 * wave(hour, 3.4)).toFixed(2),
  }
})

export const TUBE_SERIES = [
  { key: 'sun', label: 'Sunlit basalt', color: '#ff6a3d' },
  { key: 'shade', label: 'Shade', color: '#a8553a' },
  { key: 'entrance', label: 'Entrance', color: '#6b6b6b' },
  { key: 'm10', label: '10 m in', color: '#b4b4b4' },
  { key: 'm25', label: '25 m in', color: '#ffffff' },
] as const

const swing = (key: keyof Omit<TubePoint, 'hour'>) => {
  const vals = TUBE_PROFILE.map((p) => p[key])
  return Math.max(...vals) - Math.min(...vals)
}

export const TUBE_STATS = {
  surfaceSwing: swing('sun'),
  deepSwing: swing('m25'),
  damping: 1 - swing('m25') / swing('sun'),
  deepMean:
    TUBE_PROFILE.reduce((s, p) => s + p.m25, 0) / TUBE_PROFILE.length,
}

// ── Rock abundance vs. Golombek–Rapp model ───────────────────────────────────
// F_k(D) = k · exp(−q(k)·D), q(k) = 1.79 + 0.152 / k   (Golombek & Rapp 1997)

export const rockModel = (k: number, d: number) =>
  100 * k * Math.exp(-(1.79 + 0.152 / k) * d)

const DIAMETERS = [0.05, 0.08, 0.12, 0.18, 0.25, 0.35, 0.5, 0.7, 1.0, 1.4]

export interface RockPoint {
  d: number
  k5: number
  k10: number
  k20: number
  k30: number
  fresh?: number
  weathered?: number
}

export const ROCK_CURVE: RockPoint[] = DIAMETERS.map((d, i) => ({
  d,
  k5: +rockModel(0.05, d).toFixed(3),
  k10: +rockModel(0.1, d).toFixed(3),
  k20: +rockModel(0.2, d).toFixed(3),
  k30: +rockModel(0.3, d).toFixed(3),
  fresh: +(rockModel(0.25, d) * (1 + Math.sin(i * 2.1) * 0.09)).toFixed(3),
  weathered: +(rockModel(0.075, d) * (1 + Math.cos(i * 1.6) * 0.12)).toFixed(3),
}))
