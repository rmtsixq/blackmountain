import type { ReactNode } from 'react'

interface Props {
  title: string
  hint?: string
  /** marks placeholder values with a dagger */
  demo?: boolean
  children: ReactNode
}

/** A section of the reading column: a hairline, a title, then content. */
export function Panel({ title, hint, demo, children }: Props) {
  return (
    <section className="border-t border-ink/10 py-7">
      <h3 className="text-[14px] font-medium text-ink">
        {title}
        {demo && <sup className="ml-0.5 font-normal text-ink-4">†</sup>}
      </h3>
      {hint && (
        <p className="mt-1.5 max-w-[48ch] text-[13px] leading-relaxed text-ink-3">{hint}</p>
      )}
      <div className="mt-5">{children}</div>
    </section>
  )
}
