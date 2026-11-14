import { useStore, type Mode } from '../store'

const MODES: { id: Mode; label: string }[] = [
  { id: 'story', label: 'Findings' },
  { id: 'explore', label: 'Data' },
]

export function Header() {
  const mode = useStore((s) => s.mode)
  const setMode = useStore((s) => s.setMode)

  return (
    <header className="z-40 flex h-12 shrink-0 items-center justify-between gap-6 border-b border-white/10 px-5">
      <div className="flex min-w-0 items-center gap-2.5">
        <img src="/logo.webp" alt="" className="size-7" />
        <span className="text-[14px] font-medium text-white">BlackMountain</span>
        <span className="hidden truncate text-[13px] text-zinc-500 md:inline">
          Karacadağ as a Moon and Mars analog
        </span>
      </div>
      <nav className="flex shrink-0 items-center gap-5 text-[13px]">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            aria-pressed={mode === m.id}
            onClick={() => setMode(m.id)}
            className={`underline-offset-[6px] transition-colors ${
              mode === m.id ? 'text-white underline decoration-ember' : 'text-zinc-500 hover:text-white'
            }`}
          >
            {m.label}
          </button>
        ))}
        <span className="hidden font-mono text-[11px] text-zinc-600 sm:inline">Space Apps 2026</span>
      </nav>
    </header>
  )
}
