import { MapPin, X } from 'lucide-react'
import { KIND_META, STATIONS, stationById } from '../data/field'
import { useStore } from '../store'
import { EmptyState } from './EmptyState'
import { Panel } from './Panel'

export function StationDetail() {
  const stationId = useStore((s) => s.stationId)
  const select = useStore((s) => s.selectStation)
  const station = stationById(stationId)

  return (
    <Panel title="Field stations" hint="Click a marker on the terrain or pick one below." demo>
      <div className="mb-3 flex flex-wrap gap-1">
        {STATIONS.map((s) => {
          const on = s.id === stationId
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => select(on ? null : s.id)}
              className={`flex items-center gap-1.5 rounded-md border px-1.5 py-1 font-mono text-[10px] transition-colors ${
                on
                  ? 'border-white bg-white text-black'
                  : 'border-white/10 text-zinc-400 hover:border-white/30 hover:text-white'
              }`}
            >
              <span className="size-1.5 rounded-full" style={{ background: KIND_META[s.kind].color }} />
              {s.code}
            </button>
          )
        })}
      </div>

      {!station ? (
        <EmptyState
          icon={MapPin}
          title="No station selected"
          text="Select a station to see its readings and fly the camera to it."
        />
      ) : (
        <div className="rounded-lg border border-white/8 bg-ink-900/60 p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p
                className="font-mono text-[10px] uppercase tracking-wider"
                style={{ color: KIND_META[station.kind].color }}
              >
                {station.code} · {KIND_META[station.kind].label}
              </p>
              <p className="mt-0.5 text-[13px] font-medium text-white">{station.name}</p>
              <p className="mt-0.5 font-mono text-[10px] tabular-nums text-zinc-500">
                {station.lat.toFixed(4)}°N {station.lon.toFixed(4)}°E
              </p>
            </div>
            <button
              type="button"
              title="Clear selection"
              onClick={() => select(null)}
              className="rounded-md p-1 text-zinc-500 transition-colors hover:bg-white/8 hover:text-white"
            >
              <X className="size-4" />
            </button>
          </div>
          <dl className="mt-3 grid grid-cols-4 gap-2 text-center">
            {[
              ['Surface', `${station.surfaceTemp.toFixed(1)}°`],
              ['Air', `${station.airTemp.toFixed(1)}°`],
              ['RH', `${station.humidity}%`],
              ['Rocks', station.rockCover != null ? `${station.rockCover}%` : '—'],
            ].map(([k, v]) => (
              <div key={k} className="rounded-md bg-white/4 py-1.5">
                <dt className="font-mono text-[9px] uppercase tracking-wider text-zinc-500">{k}</dt>
                <dd className="mt-0.5 text-[13px] font-semibold tabular-nums text-white">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-[11px] leading-snug text-zinc-400">{station.note}</p>
        </div>
      )}
    </Panel>
  )
}
