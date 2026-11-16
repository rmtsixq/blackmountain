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

/** One physical key: a dark cap that presses down once, like a finger on it. */
function Key({ label, delay }: { label: string; delay: number }) {
  const wide = label.length > 1
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.92 }}
      animate={{ opacity: 1, y: [24, 0, 0, 6, 0], scale: [0.92, 1, 1, 0.97, 1] }}
      transition={{
        default: { duration: 1.9, delay, times: [0, 0.32, 0.62, 0.72, 0.86], ease: EASE },
        opacity: { duration: 0.5, delay, ease: EASE },
      }}
      className={`relative grid place-items-center rounded-[22px] bg-gradient-to-b from-white to-[#d9d9de] font-sans font-medium text-[#1d1d1f] shadow-[inset_0_-3px_0_rgba(0,0,0,0.08),0_10px_0_#8e8e93,0_30px_80px_rgba(255,255,255,0.18)] ${
        wide ? 'h-32 w-48 text-[52px]' : 'h-32 w-32 text-[56px]'
      }`}
    >
      {label}
      {/* the soft glow that blooms as the key is pressed */}
      <motion.span
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 0.55, 0] }}
        transition={{ duration: 1.9, delay, times: [0, 0.68, 0.76, 1] }}
        className="pointer-events-none absolute -inset-8 -z-10 rounded-[40px] bg-white/25 blur-3xl"
      />
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
            className="mt-16 font-display text-[44px] leading-none tracking-tight text-white"
          >
            {t.title}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2, ease: EASE }}
            className="mt-4 text-[17px] text-white/55"
          >
            {t.note}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
