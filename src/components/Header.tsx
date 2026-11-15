import { useT } from '../lib/i18n'
import { useStore, type Mode } from '../store'

const MODES: { id: Mode; label: 'findings' | 'data' }[] = [
  { id: 'story', label: 'findings' },
  { id: 'explore', label: 'data' },
]

export function Header() {
  const mode = useStore((s) => s.mode)
  const setMode = useStore((s) => s.setMode)
  const { t } = useT()

  return (
    <header className="z-40 grid h-12 shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-rule px-4 lg:px-6">
      <div className="flex min-w-0 items-center gap-2.5">
        <img src="/logo.webp" alt="" className="size-7 rounded-[7px]" />
        <span className="truncate text-[15px] font-semibold tracking-[-0.016em] text-ink">BlackMountain</span>
      </div>
      <div role="group" aria-label={t.view} className="flex rounded-[9px] bg-paper-2 p-0.5">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            aria-pressed={mode === m.id}
            onClick={() => setMode(m.id)}
            className={`min-w-[88px] rounded-[7px] px-4 py-1 text-[13px] font-medium transition-[background-color,color,box-shadow] duration-200 ${
              mode === m.id
                ? 'bg-paper text-ink shadow-[0_1px_3px_rgba(0,0,0,0.12),0_0_0_0.5px_rgba(0,0,0,0.06)]'
                : 'text-ink-3 hover:text-ink'
            }`}
          >
            {t[m.label]}
          </button>
        ))}
      </div>
      <p className="hidden truncate text-right text-[13px] text-ink-4 sm:block">
        {t.tagline}
      </p>
    </header>
  )
}
