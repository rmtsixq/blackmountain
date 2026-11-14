import { LAYERS, layerById } from '../lib/layers'
import { useStore } from '../store'

export function LayerPanel() {
  const layer = useStore((s) => s.layer)
  const setLayer = useStore((s) => s.setLayer)
  const active = layerById(layer)

  return (
    <div className="pointer-events-auto">
      <ul className="flex gap-4 overflow-x-auto text-[13px] sm:block sm:space-y-1.5">
        {LAYERS.map((l, i) => {
          const on = l.id === layer
          return (
            <li key={l.id} className="shrink-0">
              <button
                type="button"
                aria-pressed={on}
                onClick={() => setLayer(l.id)}
                className={`group flex items-baseline gap-3 transition-colors ${
                  on ? 'text-white' : 'text-zinc-500 hover:text-zinc-200'
                }`}
              >
                <span className={`hidden font-mono text-[10px] sm:inline ${on ? 'text-ember' : 'text-zinc-700'}`}>
                  0{i + 1}
                </span>
                <span>
                  {l.label}
                  {l.simulated && <sup className="ml-0.5 text-zinc-600">†</sup>}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
      <p className="mt-5 hidden max-w-[24ch] font-mono text-[10px] leading-relaxed text-zinc-600 sm:block">
        {active.source}
        <br />
        twin: {active.twin}
      </p>
    </div>
  )
}
