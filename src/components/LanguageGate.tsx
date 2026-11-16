import { motion } from 'framer-motion'
import type { Lang } from '../lib/i18n'
import { useStore } from '../store'

// Kurmancî is shown as a choice but has no translation yet, so it does nothing.
const CHOICES: { id: Lang | 'ku'; label: string }[] = [
  { id: 'tr', label: 'Türkçe' },
  { id: 'en', label: 'English' },
  { id: 'ku', label: 'Kurmancî' },
]

/** The first screen: the language choices and nothing else. */
export function LanguageGate() {
  const setLang = useStore((s) => s.setLang)
  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.28, 0.11, 0.32, 1] }}
      className="group/gate fixed inset-0 z-50 grid grid-rows-3 divide-y divide-rule bg-paper sm:grid-cols-3 sm:grid-rows-1 sm:divide-x sm:divide-y-0"
    >
      {CHOICES.map((c) => (
        <button
          key={c.id}
          type="button"
          lang={c.id}
          autoFocus={c.id === 'tr'}
          onClick={() => {
            if (c.id !== 'ku') setLang(c.id)
          }}
          className="flex items-center justify-center text-ink outline-none transition-colors duration-300 hover:bg-paper-2 hover:text-ink! focus-visible:bg-paper-2 group-hover/gate:text-ink-5"
        >
          <span className="font-display text-[48px] leading-none sm:text-[56px] xl:text-[80px]">{c.label}</span>
        </button>
      ))}
    </motion.div>
  )
}
