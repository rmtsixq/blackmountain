import { Unlink } from 'lucide-react'
import { AXES, EARTH_LIMITS, TARGETS } from '../data/targets'
import { Panel } from './Panel'

export function LimitsPanel() {
  return (
    <>
      <Panel
        title="What Earth cannot reproduce"
        hint="Stating the limits is part of the result. None of these change with more data."
      >
        <ul className="space-y-3">
          {EARTH_LIMITS.map((l) => (
            <li key={l.title} className="flex gap-2.5">
              <Unlink className="mt-0.5 size-3.5 shrink-0 text-ember" strokeWidth={2} />
              <div>
                <p className="text-[13px] font-medium text-zinc-100">{l.title}</p>
                <p className="mt-0.5 text-[11px] leading-snug text-zinc-400">{l.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Weakest axis per target" hint="Where each comparison should not be trusted." demo>
        <ul className="space-y-3">
          {TARGETS.map((t) => {
            const worst = [...AXES].sort((a, b) => t.axes[a.id].score - t.axes[b.id].score)[0]
            const axis = t.axes[worst.id]
            return (
              <li key={t.id} className="rounded-lg border border-white/8 bg-ink-900/60 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-[12px] font-medium text-white">
                    <span className="mr-1.5 inline-block size-2 rounded-full" style={{ background: t.color }} />
                    {t.name}
                  </p>
                  <p className="font-mono text-[11px] text-zinc-400">
                    {worst.label} · <span className="text-white">{axis.score}</span>
                  </p>
                </div>
                <p className="mt-1.5 text-[11px] leading-snug text-zinc-400">{axis.note}</p>
              </li>
            )
          })}
        </ul>
      </Panel>
    </>
  )
}
