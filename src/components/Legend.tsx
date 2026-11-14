import type { Dem } from '../lib/dem'
import { layerById, layerDomain } from '../lib/layers'
import { targetById } from '../data/targets'
import { useStore } from '../store'

export function Legend({ dem }: { dem: Dem }) {
  const layerId = useStore((s) => s.layer)
  const targetId = useStore((s) => s.target)
  const layer = layerById(layerId)
  const [lo, hi] = layerDomain(layerId, dem)

  return (
    <div className="w-full">
      <p className="truncate text-[12px] text-zinc-300">
        {layer.label}
        {layerId === 'score' && <span className="text-zinc-500">, {targetById(targetId).name}</span>}
        {layer.simulated && <sup className="ml-0.5 text-zinc-600">†</sup>}
      </p>
      <div
        className="mt-2 h-[3px]"
        style={{ background: `linear-gradient(to right, ${layer.stops.join(',')})` }}
      />
      <div className="mt-1.5 flex justify-between font-mono text-[10px] tabular-nums text-zinc-500">
        <span>{lo}</span>
        <span>{(lo + hi) / 2}</span>
        <span>
          {hi} {layer.unit}
        </span>
      </div>
    </div>
  )
}
