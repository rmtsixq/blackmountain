// A model of how a day's temperature fades with depth inside a lava tube.
//
// This is a damped-wave model, not a field record: each depth follows the
// sunlit surface with a smaller amplitude and a longer delay. It is drawn as a
// model in the Data view. Our own readings live in ./pit.ts.

export interface TubePoint {
  hour: number
  sun: number
  shade: number
  entrance: number
  m10: number
  m25: number
}

const wave = (h: number, lag: number) => Math.max(0, Math.sin((Math.PI * (h - 7 - lag)) / 10.5))

export const TUBE_PROFILE: TubePoint[] = Array.from({ length: 23 }, (_, i) => {
  const hour = 7 + i * 0.5
  return {
    hour,
    sun: +(4.5 + 19.5 * wave(hour, 0.6) ** 1.15).toFixed(1),
    shade: +(4.8 + 8.6 * wave(hour, 1.0)).toFixed(1),
    entrance: +(7.4 + 2.9 * wave(hour, 1.8)).toFixed(1),
    m10: +(8.3 + 0.9 * wave(hour, 2.6)).toFixed(2),
    m25: +(8.6 + 0.28 * wave(hour, 3.4)).toFixed(2),
  }
})

export const TUBE_SERIES = [
  { key: 'sun', label: 'Sunlit basalt', color: 'var(--accent)' },
  { key: 'shade', label: 'Shade', color: 'color-mix(in oklab, var(--accent) 55%, var(--paper))' },
  { key: 'entrance', label: 'Entrance', color: 'var(--ink-5)' },
  { key: 'm10', label: '10 m in', color: 'var(--ink-3)' },
  { key: 'm25', label: '25 m in', color: 'var(--ink)' },
] as const

const swing = (key: keyof Omit<TubePoint, 'hour'>) => {
  const vals = TUBE_PROFILE.map((p) => p[key])
  return Math.max(...vals) - Math.min(...vals)
}

export const TUBE_STATS = {
  surfaceSwing: swing('sun'),
  deepSwing: swing('m25'),
}
