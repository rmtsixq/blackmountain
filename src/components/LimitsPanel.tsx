import { AXES, EARTH_LIMITS, TARGETS } from '../data/targets'
import { Panel } from './Panel'

export function LimitsPanel() {
  return (
    <>
      <Panel
        title="What Earth cannot reproduce"
        hint="Stating the limits is part of the result. None of these change with more data."
      >
        <ol className="space-y-5">
          {EARTH_LIMITS.map((l, i) => (
            <li key={l.title} className="flex gap-4">
              <span className="font-display text-[28px] leading-none text-zinc-600">{i + 1}</span>
              <p className="text-[13px] leading-relaxed text-zinc-400">
                <span className="text-white">{l.title}.</span> {l.text}
              </p>
            </li>
          ))}
        </ol>
      </Panel>

      <Panel title="The weakest axis for each target" hint="Where each comparison should not be trusted." demo>
        <ul className="space-y-5">
          {TARGETS.map((t) => {
            const worst = [...AXES].sort((a, b) => t.axes[a.id].score - t.axes[b.id].score)[0]
            const axis = t.axes[worst.id]
            return (
              <li key={t.id}>
                <p className="flex items-baseline justify-between text-[14px] text-white">
                  {t.name}
                  <span className="font-mono text-[11px] text-zinc-500">
                    {worst.label.toLowerCase()} <span className="text-ember">{axis.score}</span>
                  </span>
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-400">{axis.note}</p>
              </li>
            )
          })}
        </ul>
      </Panel>
    </>
  )
}
