import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Lang } from '../lib/i18n'

// Browsers on Windows and Linux use F11; macOS uses Control–Command–F.
const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)
const KEYS = isMac ? ['⌃', '⌘', 'F'] : ['F11']

const TEXT: Record<Lang, { before: string; after: string }> = {
  en: { before: 'Press', after: 'for the best experience' },
  tr: { before: 'En iyi deneyim için', after: 'tuşuna basın' },
}

/** A brief full-screen suggestion, shown once right after the language choice. */
export function FullscreenHint({ lang }: { lang: Lang }) {
  const [show, setShow] = useState(() => typeof document !== 'undefined' && !document.fullscreenElement)

  useEffect(() => {
    if (!show) return
    const hide = () => setShow(false)
    const t = setTimeout(hide, 2600)
    document.addEventListener('fullscreenchange', hide)
    window.addEventListener('resize', hide)
    return () => {
      clearTimeout(t)
      document.removeEventListener('fullscreenchange', hide)
      window.removeEventListener('resize', hide)
    }
  }, [show])

  const t = TEXT[lang]
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.35 } }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
          className="pointer-events-none fixed inset-0 z-40 hidden place-items-center bg-paper/85 lg:grid"
        >
          <div className="flex items-center gap-3 text-[17px] text-ink-2">
            <span>{t.before}</span>
            <span className="flex gap-1">
              {KEYS.map((k) => (
                <kbd
                  key={k}
                  className="grid h-9 min-w-9 place-items-center rounded-lg border border-rule bg-paper px-2 font-sans text-[15px] font-medium text-ink shadow-[0_1px_0_var(--rule)]"
                >
                  {k}
                </kbd>
              ))}
            </span>
            <span>{t.after}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
