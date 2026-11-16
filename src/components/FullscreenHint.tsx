import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Lang } from '../lib/i18n'

// Browsers on Windows and Linux use F11; macOS uses Control–Command–F.
const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)
const KEYS = isMac ? ['⌃', '⌘', 'F'] : ['F11']

const TEXT: Record<Lang, { title: string; note: string }> = {
  en: { title: 'Best seen full screen', note: isMac ? 'Press Control ⌃ Command ⌘ F' : 'Press F11' },
  tr: { title: 'Tam ekranda izleyin', note: isMac ? 'Control ⌃ Command ⌘ F tuşlarına basın' : 'F11 tuşuna basın' },
}

const EASE = [0.28, 0.11, 0.32, 1] as const
const HOLD = 3800

/**
 * A keyboard keycap drawn in SVG: a sloped skirt lit from above (light top,
 * shaded bottom) around a slightly dished top face.
 */
function Keycap({ label }: { label: string }) {
  const S = 200
  // outer edge and the top face inside it; the bottom skirt is the deepest
  const o = { l: 0, t: 0, r: S, b: S }
  const f = { l: 24, t: 16, r: S - 24, b: S - 34 }
  const id = `kc-${label.length}`
  return (
    <svg viewBox={`0 0 ${S} ${S}`} className="h-48 w-48 drop-shadow-[0_18px_30px_rgba(0,0,0,0.55)]" aria-hidden>
      <defs>
        <clipPath id={`${id}-clip`}>
          <rect x="0" y="0" width={S} height={S} rx="26" />
        </clipPath>
        <linearGradient id={`${id}-face`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbfbfc" />
          <stop offset="1" stopColor="#ececef" />
        </linearGradient>
        <radialGradient id={`${id}-dish`} cx="0.5" cy="0.45" r="0.6">
          <stop offset="0.6" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.05" />
        </radialGradient>
      </defs>
      <g clipPath={`url(#${id}-clip)`}>
        <rect x="0" y="0" width={S} height={S} fill="#dfdfe3" />
        {/* skirt: four sloped sides, each its own light */}
        <polygon points={`${o.l},${o.t} ${o.r},${o.t} ${f.r},${f.t} ${f.l},${f.t}`} fill="#f6f6f8" />
        <polygon points={`${o.l},${o.t} ${f.l},${f.t} ${f.l},${f.b} ${o.l},${o.b}`} fill="#e3e3e7" />
        <polygon points={`${o.r},${o.t} ${o.r},${o.b} ${f.r},${f.b} ${f.r},${f.t}`} fill="#dcdce0" />
        <polygon points={`${o.l},${o.b} ${f.l},${f.b} ${f.r},${f.b} ${o.r},${o.b}`} fill="#c9c9ce" />
      </g>
      {/* top face */}
      <rect x={f.l} y={f.t} width={f.r - f.l} height={f.b - f.t} rx="22" fill={`url(#${id}-face)`} />
      <rect x={f.l} y={f.t} width={f.r - f.l} height={f.b - f.t} rx="22" fill={`url(#${id}-dish)`} />
      <rect
        x={f.l + 0.5}
        y={f.t + 0.5}
        width={f.r - f.l - 1}
        height={f.b - f.t - 1}
        rx="21.5"
        fill="none"
        stroke="#fff"
        strokeOpacity="0.9"
      />
      <text
        x={(f.l + f.r) / 2}
        y={(f.t + f.b) / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fill="#6e6e73"
        fontFamily="-apple-system, 'Segoe UI', system-ui, sans-serif"
        fontSize={label.length > 1 ? 54 : 60}
        fontWeight="400"
      >
        {label}
      </text>
    </svg>
  )
}

/** One key that rises in, then presses down once, like a finger on it. */
function Key({ label, delay }: { label: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.92 }}
      animate={{ opacity: 1, y: [24, 0, 0, 5, 0], scale: [0.92, 1, 1, 0.96, 1] }}
      transition={{
        default: { duration: 1.9, delay, times: [0, 0.32, 0.62, 0.72, 0.86], ease: EASE },
        opacity: { duration: 0.5, delay, ease: EASE },
      }}
      className="relative"
    >
      {/* the soft glow that blooms as the key is pressed */}
      <motion.span
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 0.5, 0] }}
        transition={{ duration: 1.9, delay, times: [0, 0.68, 0.76, 1] }}
        className="pointer-events-none absolute -inset-6 rounded-[48px] bg-white/30 blur-3xl"
      />
      {label === 'F11' ? (
        <img
          src="/ui/f11.png"
          alt=""
          draggable={false}
          className="relative h-72 w-72 select-none drop-shadow-[0_22px_36px_rgba(0,0,0,0.6)]"
        />
      ) : (
        <Keycap label={label} />
      )}
    </motion.div>
  )
}

/** A short cinematic card right after the language choice: go full screen. */
export function FullscreenHint({ lang }: { lang: Lang }) {
  const [show, setShow] = useState(() => typeof document !== 'undefined' && !document.fullscreenElement)

  useEffect(() => {
    if (!show) return
    const hide = () => setShow(false)
    const t = setTimeout(hide, HOLD)
    document.addEventListener('fullscreenchange', hide)
    window.addEventListener('resize', hide)
    window.addEventListener('keydown', hide)
    return () => {
      clearTimeout(t)
      document.removeEventListener('fullscreenchange', hide)
      window.removeEventListener('resize', hide)
      window.removeEventListener('keydown', hide)
    }
  }, [show])

  const t = TEXT[lang]
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.6, ease: EASE } }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: EASE } }}
          onClick={() => setShow(false)}
          className="fixed inset-0 z-[60] hidden cursor-pointer flex-col items-center justify-center bg-black lg:flex"
        >
          <div className="flex items-end gap-4">
            {KEYS.map((k, i) => (
              <Key key={k} label={k} delay={0.35 + i * 0.12} />
            ))}
          </div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
            className="mt-12 font-display text-[56px] leading-none font-semibold tracking-tight text-white"
          >
            {t.title}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2, ease: EASE }}
            className="mt-4 text-[22px] text-white/60"
          >
            {t.note}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
