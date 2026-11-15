import { useState } from 'react'
import { LAYERS, effectiveLayer, layerById, type LayerId } from '../lib/layers'
import { useT } from '../lib/i18n'
import { useStore } from '../store'

/**
 * What is draped on the terrain: one small swatch per layer, each in its own
 * colour ramp. The name beside them is the chosen layer, or the one pointed at.
 */
export function LayerPanel() {
  const layer = useStore((s) => s.layer)
  const twin = useStore((s) => s.twin)
  const setLayer = useStore((s) => s.setLayer)
  const [pointed, setPointed] = useState<LayerId | null>(null)
  const { x } = useT()
  const shown = effectiveLayer(layer, twin ? 'twin' : 'earth')
  const named = layerById(pointed ?? shown)

  return (
    <div className="pointer-events-auto flex w-fit max-w-full items-center gap-3">
      <div role="radiogroup" aria-label={x('Layer')} className="flex items-center gap-2">
        {LAYERS.map((l) => {
          const on = l.id === shown
          const unavailable = twin && !l.onTwin
          return (
            <button
              key={l.id}
              type="button"
              role="radio"
              aria-checked={on}
              aria-label={x(l.label)}
              disabled={unavailable}
              title={unavailable ? x('Not loaded for the twin terrain') : x(l.label)}
              onClick={() => setLayer(l.id)}
              onPointerEnter={() => !unavailable && setPointed(l.id)}
              onPointerLeave={() => setPointed(null)}
              onFocus={() => setPointed(l.id)}
              onBlur={() => setPointed(null)}
              className={`size-5 shrink-0 rounded-[5px] transition-[opacity,box-shadow] ${
                on
                  ? 'shadow-[0_0_0_2px_var(--paper),0_0_0_3.5px_var(--ink)]'
                  : unavailable
                    ? 'cursor-not-allowed opacity-25'
                    : 'opacity-70 hover:opacity-100'
              }`}
              style={{ background: `linear-gradient(135deg, ${l.stops.join(', ')})` }}
            />
          )
        })}
      </div>
      <p className="truncate text-[13px] text-ink">
        {x(named.label)}
        <span className="hidden text-ink-4 xl:inline">
          {' · '}
          {x(twin && named.id === 'terrain' ? 'LOLA / MOLA elevation' : named.source)}
        </span>
      </p>
    </div>
  )
}
