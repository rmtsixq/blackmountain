import { MousePointer2 } from 'lucide-react'
import { uvToIndex, uvToLonLat, type Dem } from '../lib/dem'
import type { Fields } from '../lib/layers'
import { useStore } from '../store'

interface Props {
  dem: Dem
  fields: Fields
}

export function ProbeReadout({ dem, fields }: Props) {
  const probe = useStore((s) => s.probe)
  const target = useStore((s) => s.target)

  if (!probe) {
    return (
      <div className="pointer-events-none hidden items-center gap-2 rounded-xl border border-white/10 bg-ink-900/70 px-3 py-2.5 font-mono text-[10px] uppercase tracking-wider text-zinc-500 backdrop-blur-md lg:flex">
        <MousePointer2 className="size-3.5" strokeWidth={1.75} />
        Hover terrain to probe
      </div>
    )
  }

  const i = uvToIndex(probe.u, probe.v, dem.size)
  const { lon, lat } = uvToLonLat(probe.u, probe.v)
  const rows: [string, string][] = [
    ['ELEV', `${dem.heights[i].toFixed(0)} m`],
    ['SLOPE', `${fields.slope[i].toFixed(1)}°`],
    ['LST', `${fields.thermal[i].toFixed(1)} °C`],
    ['σ⁰', `${fields.roughness[i].toFixed(1)} dB`],
    ['SCORE', `${fields.score[target][i].toFixed(0)} %`],
  ]

  return (
    <div className="pointer-events-none hidden w-44 rounded-xl border border-white/10 bg-ink-900/85 px-3 py-2.5 font-mono text-[11px] shadow-lg shadow-black/50 backdrop-blur-md lg:block">
      <p className="tabular-nums text-zinc-200">
        {lat.toFixed(4)}°N {lon.toFixed(4)}°E
      </p>
      <dl className="mt-1.5 space-y-0.5 border-t border-white/8 pt-1.5">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between">
            <dt className="text-zinc-600">{k}</dt>
            <dd className="tabular-nums text-zinc-200">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
