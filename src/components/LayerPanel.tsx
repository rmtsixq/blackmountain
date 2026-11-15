import { LAYERS, effectiveLayer, layerById } from '../lib/layers'
import { useT } from '../lib/i18n'
import { useStore } from '../store'

export function LayerPanel() {
  const layer = useStore((s) => s.layer)
  const twin = useStore((s) => s.twin)
  const setLayer = useStore((s) => s.setLayer)
  const { x } = useT()
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
                title={unavailable ? x('Not loaded for the twin terrain') : undefined}
                onClick={() => setLayer(l.id)}
                className={`flex items-baseline gap-3 transition-colors ${
                  on
                    ? 'text-ink'
                    : unavailable
                      ? 'cursor-not-allowed text-ink-5 line-through'
                      : 'text-ink-3 hover:text-ink'
                }`}
              >
                <span className={`hidden font-label text-[10px] sm:inline ${on ? 'text-accent' : 'text-ink-5'}`}>
                  0{i + 1}
                </span>
                {x(l.label)}
              </button>
            </li>
          )
        })}
      </ul>
      <p className="mt-5 hidden max-w-[26ch] font-label text-[10px] leading-relaxed text-ink-4 sm:block">
        {x(twin && shown === 'terrain' ? 'LOLA / MOLA elevation' : active.source)}
      </p>
    </div>
  )
}
