import { STATIONS, TUBE_STATS } from '../data/field'
import { EXTENT_KM, type Dem } from '../lib/dem'

export function StatTiles({ dem }: { dem: Dem | null }) {
  const tiles = [
    {
      label: 'Relief',
      value: dem ? `${(dem.max - dem.min).toFixed(0)} m` : null,
      sub: dem ? `${dem.min.toFixed(0)}–${dem.max.toFixed(0)} m` : '',
    },
    {
      label: 'Scene',
      value: `${EXTENT_KM.toFixed(0)} km`,
      sub: '60 m grid',
    },
    {
      label: 'Stations',
      value: String(STATIONS.length),
      sub: `${STATIONS.filter((s) => s.kind === 'tube').length} tube entrances`,
    },
    {
      label: 'Tube damping',
      value: `${(TUBE_STATS.damping * 100).toFixed(0)}%`,
      sub: 'diurnal swing',
    },
  ]

  return (
    <div className="grid grid-cols-4 gap-2">
      {tiles.map((t) => (
        <div key={t.label} className="rounded-lg border border-white/8 bg-ink-800/40 px-2.5 py-2">
          <p className="font-mono text-[9px] uppercase tracking-wider text-zinc-500">{t.label}</p>
          {t.value ? (
            <p className="mt-1 text-[15px] font-semibold tabular-nums leading-none text-white">
              {t.value}
            </p>
          ) : (
            <div className="mt-1 h-[15px] w-12 animate-pulse rounded bg-white/10" />
          )}
          <p className="mt-1 truncate text-[10px] text-zinc-500">{t.sub || ' '}</p>
        </div>
      ))}
    </div>
  )
}
