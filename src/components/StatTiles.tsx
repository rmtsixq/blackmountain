import { STATIONS, TUBE_STATS } from '../data/field'
import { EXTENT_KM, type Dem } from '../lib/dem'

/** The scene in one line of facts. */
export function StatTiles({ dem }: { dem: Dem | null }) {
  const facts: [string, string][] = [
    [dem ? `${dem.min.toFixed(0)}–${dem.max.toFixed(0)} m` : '…', 'elevation'],
    [`${EXTENT_KM.toFixed(0)} km`, 'across'],
    [String(STATIONS.length), 'stations'],
    [`${(TUBE_STATS.damping * 100).toFixed(0)}%†`, 'swing damped in tube'],
  ]

  return (
    <dl className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] text-zinc-500">
      {facts.map(([value, label]) => (
        <div key={label} className="flex gap-1.5">
          <dd className="tabular-nums text-white">{value}</dd>
          <dt>{label}</dt>
        </div>
      ))}
    </dl>
  )
}
