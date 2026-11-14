import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../store'

/** The tour's narration, set large over the terrain. */
export function Caption() {
  const caption = useStore((s) => s.caption)
  return (
    <AnimatePresence mode="wait">
      {caption && (
        <motion.p
          key={caption}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-[26ch] font-display text-[30px] leading-[1.12] text-white sm:text-[40px]"
        >
          {caption}
        </motion.p>
      )}
    </AnimatePresence>
  )
}
