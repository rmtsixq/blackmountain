import type { ReactNode } from 'react'

interface Props {
  title: string
  hint?: string
  demo?: boolean
  children: ReactNode
}

export function Panel({ title, hint, demo, children }: Props) {
  return (
    <section className="rounded-xl border border-white/8 bg-ink-800/60 p-4">
      <header className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[13px] font-semibold text-zinc-100">{title}</h3>
          {hint && <p className="mt-0.5 text-[11px] leading-snug text-zinc-500">{hint}</p>}
        </div>
        {demo && (
          <span
            title="Placeholder values until field and satellite data arrive"
            className="shrink-0 rounded bg-amber-400/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-amber-300/80"
          >
            demo
          </span>
        )}
      </header>
      {children}
    </section>
  )
}
