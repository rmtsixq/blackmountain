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
      transition={{ duration: 0.6 }}
      className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-6 bg-ink-950"
    >
      <motion.img
        src="/logo.webp"
        alt=""
        className="size-28 rounded-2xl"
        animate={{ opacity: [0.55, 1, 0.55] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="w-56">
        <div className="h-0.5 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full bg-white"
            animate={{ width: `${Math.round(progress * 100)}%` }}
            transition={{ ease: 'easeOut', duration: 0.3 }}
          />
        </div>
        <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
          {stage}
        </p>
      </div>
    </motion.div>
  )
}
