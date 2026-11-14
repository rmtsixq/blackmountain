import { Crosshair, Mountain, Radar, Thermometer, TrendingUp, type LucideIcon } from 'lucide-react'
import { LAYERS, layerById, type LayerId } from '../lib/layers'
import { useStore } from '../store'

const ICONS: Record<LayerId, LucideIcon> = {
  terrain: Mountain,
  thermal: Thermometer,
  roughness: Radar,
  slope: TrendingUp,
  score: Crosshair,
}

export function LayerPanel() {
  const layer = useStore((s) => s.layer)
  const setLayer = useStore((s) => s.setLayer)
  const active = layerById(layer)

  return (
    <div className="pointer-events-auto w-fit rounded-xl border border-white/10 bg-ink-900/80 p-1.5 shadow-lg shadow-black/50 backdrop-blur-md sm:w-56">
      <p className="hidden px-2 pb-1.5 pt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 sm:block">
        Data layers
      </p>
      <div className="flex gap-1 sm:flex-col">
        {LAYERS.map((l) => {
          const Icon = ICONS[l.id]
          const on = l.id === layer
          return (
            <button
              key={l.id}
              type="button"
              title={l.label}
              aria-pressed={on}
              onClick={() => setLayer(l.id)}
              className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors ${
                on
                  ? 'bg-white text-black'
                  : 'text-zinc-400 hover:bg-white/8 hover:text-zinc-100'
              }`}
            >
              <Icon className="size-4 shrink-0" strokeWidth={1.75} />
              <span className="hidden flex-1 sm:block">{l.label}</span>
              {l.simulated && (
                <span
                  className={`hidden rounded px-1 font-mono text-[9px] uppercase tracking-wider sm:block ${
                    on ? 'bg-black/10 text-black/60' : 'bg-amber-400/10 text-amber-300/80'
                  }`}
                >
                  sim
                </span>
              )}
            </button>
          )
        })}
      </div>
      <dl className="mt-1.5 hidden space-y-1 border-t border-white/8 px-2 pb-1 pt-2 font-mono text-[10px] leading-snug sm:block">
        <div className="flex justify-between gap-3">
          <dt className="text-zinc-600">EARTH</dt>
          <dd className="text-right text-zinc-300">{active.source}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-zinc-600">TWIN</dt>
          <dd className="text-right text-zinc-300">{active.twin}</dd>
        </div>
      </dl>
    </div>
  )
}
