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
      className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-ink-950"
    >
      <img src="/logo.webp" alt="" className="size-24" />
      <div className="mt-4 h-px w-40 bg-white/15">
        <motion.div
          className="h-px bg-white"
          animate={{ width: `${Math.round(progress * 100)}%` }}
          transition={{ ease: 'easeOut', duration: 0.3 }}
        />
      </div>
      <p className="mt-4 font-mono text-[11px] text-zinc-500">{stage}</p>
    </motion.div>
  )
}
