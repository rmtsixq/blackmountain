import type { CSSProperties } from 'react'
import { formatHour, solarPosition } from '../lib/solar'
import { useT } from '../lib/i18n'
import { rich } from '../lib/rich'
import { useStore } from '../store'

const MIN = 6.8
const MAX = 17.2
const PRESETS = [
  { hour: 12, label: 'noon' },
  { hour: 13.5, label: 'VIIRS overpass' },
  { hour: 16.6, label: 'grazing light' },
]
const TICKS = [7, 9, 11, 13, 15, 17]
const pct = (h: number) => `${((h - MIN) / (MAX - MIN)) * 100}%`

/** The day as a timeline: drag the marker to move the real sun. */
export function SunControl() {
  const hour = useStore((s) => s.hour)
  const setHour = useStore((s) => s.setHour)
  const { x } = useT()
  const sun = solarPosition(hour)
  const low = sun.elevation < 6

  return (
    <div className="pointer-events-auto w-full">
      <div className="flex items-end justify-between gap-4">
        <p className="font-display text-[44px] leading-none text-ink tabular-nums">
          {formatHour(hour)}
        </p>
        <p className="pb-1 text-right font-label text-[11px] leading-relaxed text-ink-3">
          {rich(x('sun {e} above horizon, bearing {a}°', { a: sun.azimuth.toFixed(0) }), {
            e: <span className={low ? 'text-accent' : 'text-ink'}>{sun.elevation.toFixed(1)}°</span>,
          })}
        </p>
      </div>
      <input
        type="range"
        min={MIN}
        max={MAX}
        step={0.05}
        value={hour}
        onChange={(e) => setHour(Number(e.target.value))}
        className="hairline mt-1 block w-full"
        style={{ '--thumb': low ? 'var(--accent)' : 'var(--ink)' } as CSSProperties}
        aria-label={x('Local solar time, 14 November')}
      />
      <div className="relative h-4 font-label text-[10px] text-ink-4">
        {TICKS.map((t) => (
          <span key={t} className="absolute -translate-x-1/2" style={{ left: pct(t) }}>
            {String(t).padStart(2, '0')}
          </span>
        ))}
      </div>
      <div className="mt-2 flex gap-5 text-[12px]">
        {PRESETS.map((p) => {
          const on = Math.abs(hour - p.hour) < 0.03
          return (
            <button
              key={p.label}
              type="button"
              onClick={() => setHour(p.hour)}
              className={`underline-offset-4 transition-colors ${
                on ? 'text-ink underline decoration-accent' : 'text-ink-3 hover:text-ink'
              }`}
            >
              {x(p.label)}
            </button>
          )
        })}
      </div>
    </div>
  )
}
