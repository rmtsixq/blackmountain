import { motion } from 'framer-motion'

interface Props {
  progress: number
  stage: string
}

export function LoadingScreen({ progress, stage }: Props) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
      className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-paper"
    >
      <img src="/logo.webp" alt="" className="size-20 rounded-[18px]" />
      <div className="mt-4 h-px w-40 bg-ink/15">
        <motion.div
          className="h-px bg-ink"
          animate={{ width: `${Math.round(progress * 100)}%` }}
          transition={{ ease: 'easeOut', duration: 0.3 }}
        />
      </div>
      <p className="mt-4 text-[13px] text-ink-4">{stage}</p>
    </motion.div>
  )
}
