import { TARGETS, overallScore } from '../data/targets'
import { useStore } from '../store'

export function TargetSelector() {
  const target = useStore((s) => s.target)
  const setTarget = useStore((s) => s.setTarget)

  return (
    <div className="grid grid-cols-3 gap-2">
      {TARGETS.map((t) => {
        const on = t.id === target
        return (
          <button
            key={t.id}
            type="button"
            aria-pressed={on}
            onClick={() => setTarget(t.id)}
            className={`rounded-xl border p-2.5 text-left transition-all ${
              on
                ? 'border-white/30 bg-white/8 shadow-lg shadow-black/40'
                : 'border-white/8 bg-ink-800/40 hover:border-white/20 hover:bg-white/4'
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className="font-mono text-[9px] uppercase tracking-[0.18em]"
                style={{ color: t.color }}
              >
                {t.body}
              </span>
              <span className="font-mono text-[11px] tabular-nums text-zinc-400">
                {overallScore(t).toFixed(0)}
              </span>
            </div>
            <p className={`mt-1.5 text-[12px] font-medium leading-tight ${on ? 'text-white' : 'text-zinc-300'}`}>
              {t.name}
            </p>
            <div className="mt-2 h-0.5 overflow-hidden rounded-full bg-white/8">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${overallScore(t)}%`, background: t.color, opacity: on ? 1 : 0.45 }}
              />
            </div>
          </button>
        )
      })}
    </div>
  )
}
