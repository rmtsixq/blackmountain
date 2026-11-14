import type { Dem } from '../lib/dem'
import { layerById, layerDomain } from '../lib/layers'
import { targetById } from '../data/targets'
import { useStore } from '../store'

export function Legend({ dem }: { dem: Dem }) {
  const layerId = useStore((s) => s.layer)
  const targetId = useStore((s) => s.target)
  const layer = layerById(layerId)
  const [lo, hi] = layerDomain(layerId, dem)
  const mid = (lo + hi) / 2

  return (
    <div className="pointer-events-auto w-full rounded-xl border border-white/10 bg-ink-900/80 px-3.5 py-3 shadow-lg shadow-black/50 backdrop-blur-md md:w-56">
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-[12px] font-medium text-zinc-100">
          {layer.label}
          {layerId === 'score' && (
            <span className="text-zinc-500"> · {targetById(targetId).name}</span>
          )}
        </p>
        {layer.simulated && (
          <span className="rounded bg-amber-400/10 px-1 font-mono text-[9px] uppercase tracking-wider text-amber-300/80">
            sim
          </span>
        )}
      </div>
      <div
        className="mt-2 h-2 rounded-full ring-1 ring-white/10"
        style={{ background: `linear-gradient(to right, ${layer.stops.join(',')})` }}
      />
      <div className="mt-1 flex justify-between font-mono text-[10px] tabular-nums text-zinc-500">
        <span>{lo}</span>
        <span>{mid}</span>
        <span>
          {hi} {layer.unit}
        </span>
      </div>
    </div>
  )
}
