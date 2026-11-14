import { TARGETS } from '../data/targets'
import type { World } from '../lib/layers'
import { terrainScore } from '../lib/scores'
import { useStore } from '../store'

export function TargetSelector({ world }: { world: World }) {
  const target = useStore((s) => s.target)
  const setTarget = useStore((s) => s.setTarget)

  return (
    <ul>
      {TARGETS.map((t) => {
        const on = t.id === target
        return (
          <li key={t.id} className="border-b border-white/10 last:border-b-0">
            <button
              type="button"
              aria-pressed={on}
              onClick={() => setTarget(t.id)}
              className={`flex w-full items-baseline gap-3 py-2.5 text-left transition-colors ${
                on ? 'text-white' : 'text-zinc-500 hover:text-zinc-200'
              }`}
            >
              <span className={`size-1.5 shrink-0 -translate-y-0.5 ${on ? 'bg-ember' : 'bg-transparent'}`} />
              <span className="w-10 shrink-0 font-mono text-[11px]">{t.body}</span>
              <span className="flex-1 truncate text-[14px]">{t.name}</span>
              <span className="font-mono text-[12px] tabular-nums">
                {terrainScore(t, world).toFixed(0)}
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
