import { useStore } from '../store'

export function ViewControls() {
  const exag = useStore((s) => s.exag)
  const setExag = useStore((s) => s.setExag)
  const autoRotate = useStore((s) => s.autoRotate)
  const setAutoRotate = useStore((s) => s.setAutoRotate)
  const resetView = useStore((s) => s.resetView)
  const link = 'transition-colors hover:text-white'

  return (
    <div className="pointer-events-auto flex items-center gap-4 font-mono text-[11px] text-zinc-500">
      <span className="hidden items-center gap-2 md:flex">
        relief
        <button type="button" aria-label="Less relief" className={link} onClick={() => setExag(Math.max(1, exag - 1))}>
          −
        </button>
        <span className="w-5 text-center text-white">×{exag}</span>
        <button type="button" aria-label="More relief" className={link} onClick={() => setExag(Math.min(8, exag + 1))}>
          +
        </button>
      </span>
      <button
        type="button"
        aria-pressed={autoRotate}
        onClick={() => setAutoRotate(!autoRotate)}
        className={autoRotate ? 'text-white' : link}
      >
        orbit
      </button>
      <button type="button" onClick={resetView} className={link}>
        reset
      </button>
    </div>
  )
}
