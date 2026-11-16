import { motion } from 'framer-motion'
import type { Lang } from '../lib/i18n'
import { useStore } from '../store'

const CHOICES: { id: Lang; label: string }[] = [
  { id: 'tr', label: 'Türkçe' },
  { id: 'en', label: 'English' },
]

/** The first screen: two choices and nothing else. */
export function LanguageGate() {
  const setLang = useStore((s) => s.setLang)
  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.28, 0.11, 0.32, 1] }}
      className="group/gate fixed inset-0 z-50 grid grid-rows-2 bg-paper sm:grid-cols-2 sm:grid-rows-1"
    >
      {CHOICES.map((c) => (
        <button
          key={c.id}
          type="button"
          lang={c.id}
          autoFocus={c.id === 'tr'}
          onClick={() => setLang(c.id)}
          className="flex items-center justify-center border-rule text-ink outline-none transition-colors duration-300 first:border-b hover:bg-paper-2 hover:text-ink! focus-visible:bg-paper-2 group-hover/gate:text-ink-5 sm:first:border-b-0 sm:first:border-r"
        >
          <span className="font-display text-[56px] leading-none sm:text-[72px] xl:text-[104px]">{c.label}</span>
        </button>
      ))}
    </motion.div>
  )
}
