import { layerById, layerData, type World } from '../lib/layers'
import { targetById } from '../data/targets'
import { useStore } from '../store'

export function Legend({ world }: { world: World }) {
  const layerId = useStore((s) => s.layer)
  const targetId = useStore((s) => s.target)
  const side = useStore((s) => s.side)
  const data = layerData(world, layerId, targetId, side)
  const layer = layerById(data.layer)
  const [lo, hi] = data.domain

  return (
    <div className="w-full">
      <p className="truncate text-[12px] text-zinc-300">
        {layer.label}
        {(data.layer === 'score' || side === 'twin') && (
          <span className="text-zinc-500">, {targetById(targetId).name}</span>
        )}
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
