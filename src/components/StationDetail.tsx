import { KIND_META, STATIONS, stationById } from '../data/field'
import { useStore } from '../store'
import { EmptyState } from './EmptyState'
import { Panel } from './Panel'

export function StationDetail() {
  const stationId = useStore((s) => s.stationId)
  const select = useStore((s) => s.selectStation)
  const station = stationById(stationId)

  return (
    <Panel title="Stations" hint="Pick one here or on the terrain; the camera follows." demo>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 font-label text-[11px]">
        {STATIONS.map((s) => {
          const on = s.id === stationId
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => select(on ? null : s.id)}
              className={`underline-offset-4 transition-colors ${
                on
                  ? 'text-accent underline'
                  : s.kind === 'tube'
                    ? 'text-ink hover:text-accent'
                    : 'text-ink-3 hover:text-ink'
              }`}
            >
              {s.code}
            </button>
          )
        })}
      </div>

      <div className="mt-6">
        {!station ? (
          <EmptyState title="No station selected" text="Readings for a station appear here." />
        ) : (
          <>
            <p className="text-[15px] text-ink">{station.name}</p>
            <p className="mt-1 font-label text-[11px] tabular-nums text-ink-3">
              {KIND_META[station.kind].label.toLowerCase()} · {station.lat.toFixed(4)}°N{' '}
              {station.lon.toFixed(4)}°E
            </p>
            <dl className="mt-4 grid grid-cols-4 gap-4">
              {[
                ['surface', `${station.surfaceTemp.toFixed(1)}°`],
                ['air', `${station.airTemp.toFixed(1)}°`],
                ['humidity', `${station.humidity}%`],
                ['rock cover', station.rockCover != null ? `${station.rockCover}%` : '—'],
              ].map(([k, v]) => (
                <div key={k}>
                  <dd className="font-display text-[28px] leading-none tabular-nums text-ink">{v}</dd>
                  <dt className="mt-1.5 font-label text-[10px] text-ink-3">{k}</dt>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-[13px] leading-relaxed text-ink-2">{station.note}</p>
          </>
        )}
      </div>
    </Panel>
  )
}
