import { useStore } from '../store'
import { useT } from '../lib/i18n'

export function ViewControls() {
  const exag = useStore((s) => s.exag)
  const setExag = useStore((s) => s.setExag)
  const autoRotate = useStore((s) => s.autoRotate)
  const setAutoRotate = useStore((s) => s.setAutoRotate)
  const resetView = useStore((s) => s.resetView)
  const { x } = useT()
  const link = 'transition-colors hover:text-ink'

  return (
    <div className="pointer-events-auto flex items-center gap-4 font-label text-[11px] text-ink-3">
      <span className="hidden items-center gap-2 md:flex">
        {x('relief')}
        <button type="button" aria-label={x('Less relief')} className={link} onClick={() => setExag(Math.max(1, exag - 1))}>
          −
        </button>
        <span className="w-5 text-center text-ink">×{exag}</span>
        <button type="button" aria-label={x('More relief')} className={link} onClick={() => setExag(Math.min(8, exag + 1))}>
          +
        </button>
      </span>
      <button
        type="button"
        aria-pressed={autoRotate}
        onClick={() => setAutoRotate(!autoRotate)}
        className={autoRotate ? 'text-ink' : link}
      >
        {x('orbit')}
      </button>
      <button type="button" onClick={resetView} className={link}>
        {x('reset')}
      </button>
    </div>
  )
}
