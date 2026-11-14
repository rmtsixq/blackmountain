import { Satellite, Sun, Sunset } from 'lucide-react'
import { formatHour, solarPosition } from '../lib/solar'
import { useStore } from '../store'

const PRESETS = [
  { hour: 12, label: 'Noon', icon: Sun },
  { hour: 13.5, label: 'VIIRS pass', icon: Satellite },
  { hour: 16.6, label: 'Polar-light test', icon: Sunset },
]

export function SunControl() {
  const hour = useStore((s) => s.hour)
  const setHour = useStore((s) => s.setHour)
  const sun = solarPosition(hour)

  return (
    <div className="pointer-events-auto w-full rounded-xl border border-white/10 bg-ink-900/80 px-3.5 py-3 shadow-lg shadow-black/50 backdrop-blur-md md:w-[340px]">
      <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-wider text-zinc-500">
        <span>Sun simulation · 14 Nov</span>
        <span className="text-zinc-300">
          az {sun.azimuth.toFixed(0)}° · el{' '}
          <span className={sun.elevation < 6 ? 'text-ember' : ''}>
            {sun.elevation.toFixed(1)}°
          </span>
        </span>
      </div>
      <div className="mt-2 flex items-center gap-3">
        <span className="w-12 font-mono text-lg tabular-nums text-white">
          {formatHour(hour)}
        </span>
        <input
          type="range"
          min={6.8}
          max={17.2}
          step={0.05}
          value={hour}
          onChange={(e) => setHour(Number(e.target.value))}
          className="h-1 flex-1 cursor-pointer accent-ember"
          aria-label="Local solar time"
        />
      </div>
      <div className="mt-2.5 flex gap-1.5">
        {PRESETS.map((p) => {
          const on = Math.abs(hour - p.hour) < 0.03
          return (
            <button
              key={p.label}
              type="button"
              onClick={() => setHour(p.hour)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-2 py-1.5 text-[11px] transition-colors ${
                on
                  ? 'border-ember/60 bg-ember/15 text-ember'
                  : 'border-white/10 text-zinc-400 hover:border-white/25 hover:text-zinc-100'
              }`}
            >
              <p.icon className="size-3.5 shrink-0" strokeWidth={1.75} />
              <span className="truncate">{p.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
