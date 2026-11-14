import { EXTENT_KM } from '../lib/dem'
import type { World } from '../lib/layers'

/** The scene in one line of facts. */
export function StatTiles({ world }: { world: World }) {
  const { dem } = world.earth
  const facts: [string, string][] = [
    [`${dem.min.toFixed(0)}–${dem.max.toFixed(0)} m`, 'elevation'],
    [`${EXTENT_KM.toFixed(0)} km`, 'across'],
    ['11', 'elevation models'],
    ['12', 'months of VIIRS'],
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
