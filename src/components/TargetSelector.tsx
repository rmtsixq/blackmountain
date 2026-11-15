import { TARGETS } from '../data/targets'
import { useT } from '../lib/i18n'
import type { World } from '../lib/layers'
import { terrainScore } from '../lib/scores'
import { useStore } from '../store'

/** What Karacadağ is compared with: three rows, one chosen. */
export function TargetSelector({ world }: { world: World }) {
  const target = useStore((s) => s.target)
  const setTarget = useStore((s) => s.setTarget)
  const { x, num } = useT()

  return (
    <div>
      <p className="mb-1 text-[13px] text-ink-3">{x('Compare Karacadağ with')}</p>
      <ul role="radiogroup" aria-label={x('Compare Karacadağ with')}>
        {TARGETS.map((t) => {
          const on = t.id === target
          return (
            <li key={t.id} className="border-b border-rule last:border-b-0">
              <button
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setTarget(t.id)}
                className={`flex w-full items-center gap-3 py-2.5 text-left transition-colors ${
                  on ? 'text-ink' : 'text-ink-3 hover:text-ink'
                }`}
              >
                <span
                  className={`flex size-4 shrink-0 items-center justify-center rounded-full border ${
                    on ? 'border-ink' : 'border-ink-5'
                  }`}
                >
                  {on && <span className="size-2 rounded-full bg-ink" />}
                </span>
                <span className={`min-w-0 flex-1 truncate text-[15px] ${on ? 'font-medium' : ''}`}>{x(t.name)}</span>
                <span className="hidden text-[12px] text-ink-4 sm:inline">{x(t.tag)}</span>
                <span className="w-7 text-right text-[15px] tabular-nums">{num(terrainScore(t, world))}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
