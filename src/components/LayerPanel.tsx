import { LAYERS, effectiveLayer, layerById } from '../lib/layers'
import { useStore } from '../store'

export function LayerPanel() {
  const layer = useStore((s) => s.layer)
  const twin = useStore((s) => s.twin)
  const setLayer = useStore((s) => s.setLayer)
  const shown = effectiveLayer(layer, twin ? 'twin' : 'earth')
  const active = layerById(shown)

  return (
    <div className="pointer-events-auto">
      <ul className="flex gap-4 overflow-x-auto text-[13px] sm:block sm:space-y-1.5">
        {LAYERS.map((l, i) => {
          const on = l.id === shown
          const unavailable = twin && !l.onTwin
          return (
            <li key={l.id} className="shrink-0">
              <button
                type="button"
                aria-pressed={on}
                disabled={unavailable}
                title={unavailable ? 'Not loaded for the twin terrain' : undefined}
                onClick={() => setLayer(l.id)}
                className={`flex items-baseline gap-3 transition-colors ${
                  on
                    ? 'text-white'
                    : unavailable
                      ? 'cursor-not-allowed text-zinc-800 line-through'
                      : 'text-zinc-500 hover:text-zinc-200'
                }`}
              >
                <span className={`hidden font-mono text-[10px] sm:inline ${on ? 'text-ember' : 'text-zinc-700'}`}>
                  0{i + 1}
                </span>
                {l.label}
              </button>
            </li>
          )
        })}
      </ul>
      <p className="mt-5 hidden max-w-[26ch] font-mono text-[10px] leading-relaxed text-zinc-600 sm:block">
        {twin && shown === 'terrain' ? 'LOLA / MOLA elevation' : active.source}
      </p>
    </div>
  )
}
