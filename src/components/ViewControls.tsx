import { motion } from 'framer-motion'
import { Rotate3d, RotateCcw } from 'lucide-react'
import { useStore } from '../store'
import { useT } from '../lib/i18n'

const MIN = 1
const MAX = 8

const icon = 'flex size-7 items-center justify-center rounded-full transition-colors'

/**
 * Relief, rotation and reset. Relief is a hairline slider beside a ridge that
 * grows as tall as the terrain is stretched.
 */
export function ViewControls() {
  const exag = useStore((s) => s.exag)
  const setExag = useStore((s) => s.setExag)
  const autoRotate = useStore((s) => s.autoRotate)
  const setAutoRotate = useStore((s) => s.setAutoRotate)
  const resetView = useStore((s) => s.resetView)
  const { x } = useT()
  const share = (exag - MIN) / (MAX - MIN)

  return (
    <div className="pointer-events-auto flex shrink-0 items-center gap-1 text-ink">
      <div className="mr-2 hidden items-center gap-2 md:flex" title={x('Relief: how far heights are stretched')}>
        <svg aria-hidden viewBox="0 0 22 12" className="h-3 w-[22px]">
          <motion.path
            d="M0 12 L6 5 L9 8 L14 0 L22 12 Z"
            fill="currentColor"
            style={{ transformOrigin: '50% 100%', transformBox: 'fill-box' }}
            animate={{ scaleY: 0.3 + share * 0.7 }}
            transition={{ type: 'spring', stiffness: 380, damping: 26 }}
          />
        </svg>
        <span className="relative flex h-7 w-20 items-center has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink">
          <span className="h-0.5 w-full rounded-full bg-ink/25" />
          <span className="absolute left-0 h-0.5 rounded-full bg-ink" style={{ width: `${share * 100}%` }} />
          <span
            className="absolute size-2.5 -translate-x-1/2 rounded-full bg-ink"
            style={{ left: `${share * 100}%` }}
          />
          <input
            type="range"
            min={MIN}
            max={MAX}
            step={1}
            value={exag}
            onChange={(e) => setExag(Number(e.target.value))}
            aria-label={x('Relief')}
            aria-valuetext={`×${exag}`}
            className="absolute inset-0 size-full cursor-ew-resize opacity-0"
          />
        </span>
        <span className="w-5 text-[13px] tabular-nums">×{exag}</span>
      </div>
      <button
        type="button"
        aria-pressed={autoRotate}
        aria-label={x('Rotate the view')}
        title={x('Rotate the view')}
        onClick={() => setAutoRotate(!autoRotate)}
        className={`${icon} ${autoRotate ? 'bg-ink text-paper' : 'text-ink-2 hover:text-ink'}`}
      >
        <Rotate3d className="size-4" strokeWidth={2} />
      </button>
      <button
        type="button"
        aria-label={x('Reset the view')}
        title={x('Reset the view')}
        onClick={resetView}
        className={`${icon} text-ink-2 hover:text-ink`}
      >
        <RotateCcw className="size-4" strokeWidth={2} />
      </button>
    </div>
  )
}
