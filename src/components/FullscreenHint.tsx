import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Lang } from '../lib/i18n'

// Browsers on Windows and Linux use F11; macOS uses Control–Command–F.
const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)
const KEYS = isMac ? ['⌃', '⌘', 'F'] : ['F11']

const TEXT: Record<Lang, { title: string; body: string; go: string; skip: string }> = {
  en: {
    title: 'Better in full screen',
    body: isMac ? 'Press Control–Command–F, or switch here.' : 'Press F11, or switch here.',
    go: 'Go Full Screen',
    skip: 'Not Now',
  },
  tr: {
    title: 'Tam ekranda daha iyi',
    body: isMac ? 'Control–Command–F tuşlarına basın ya da buradan geçin.' : 'F11 tuşuna basın ya da buradan geçin.',
    go: 'Tam Ekrana Geç',
    skip: 'Şimdi Değil',
  },
}

const EASE = [0.28, 0.11, 0.32, 1] as const

/** A keyboard key in the page's own materials: white cap, hairline edge, one press. */
function Key({ label, delay }: { label: string; delay: number }) {
  return (
    <motion.kbd
      initial={{ y: 0 }}
      animate={{ y: [0, 0, 3, 0] }}
      transition={{ duration: 0.9, delay, times: [0, 0.5, 0.65, 1], ease: EASE }}
      className={`grid h-24 place-items-center rounded-2xl border border-rule bg-paper font-sans text-[34px] font-medium text-ink shadow-[0_2px_0_var(--rule),0_12px_32px_rgba(0,0,0,0.06)] ${
        label.length > 1 ? 'w-32' : 'w-24'
      }`}
    >
      {label}
    </motion.kbd>
  )
}

/** Shown once after the language choice: offer full screen, never force it. */
export function FullscreenHint({ lang }: { lang: Lang }) {
  const [show, setShow] = useState(
    () => typeof document !== 'undefined' && !document.fullscreenElement && !!document.fullscreenEnabled,
  )

  useEffect(() => {
    if (!show) return
    const hide = () => setShow(false)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'F11') hide()
    }
    document.addEventListener('fullscreenchange', hide)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('fullscreenchange', hide)
      window.removeEventListener('keydown', onKey)
    }
  }, [show])

  const goFull = () => {
    document.documentElement.requestFullscreen?.().catch(() => setShow(false))
  }

  const t = TEXT[lang]
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="fs-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.4, ease: EASE } }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: EASE } }}
          className="fixed inset-0 z-[60] hidden flex-col items-center justify-center bg-paper text-center lg:flex"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
            className="flex flex-col items-center"
          >
            <div className="flex gap-3" aria-hidden>
              {KEYS.map((k, i) => (
                <Key key={k} label={k} delay={0.7 + i * 0.08} />
              ))}
            </div>
            <h2 id="fs-title" className="mt-12 font-display text-[40px] leading-tight font-semibold tracking-tight text-ink">
              {t.title}
            </h2>
            <p className="mt-3 text-[17px] text-ink-3">{t.body}</p>
            <div className="mt-10 flex items-center gap-3">
              <button
                type="button"
                autoFocus
                onClick={goFull}
                className="h-11 rounded-xl bg-ink px-6 text-[15px] font-medium text-paper transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                {t.go}
              </button>
              <button
                type="button"
                onClick={() => setShow(false)}
                className="h-11 rounded-xl px-5 text-[15px] font-medium text-ink-3 transition-colors hover:bg-paper-2 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                {t.skip}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
