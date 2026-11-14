import { useEffect } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'
import { overallScore, targetById } from '../data/targets'
import { useStore } from '../store'

const verdict = (score: number) =>
  score >= 65 ? 'Strong analog' : score >= 50 ? 'Partial analog' : 'Weak analog'

export function ScoreHeader() {
  const target = targetById(useStore((s) => s.target))
  const score = overallScore(target)
  const spring = useSpring(score, { stiffness: 90, damping: 20 })
  const text = useTransform(spring, (v) => v.toFixed(0))

  useEffect(() => {
    spring.set(score)
  }, [score, spring])

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-baseline gap-1">
        <motion.span
          className="text-5xl font-semibold tabular-nums tracking-tight"
          style={{ color: target.color }}
        >
          {text}
        </motion.span>
        <span className="font-mono text-xs text-zinc-500">/100</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
          {verdict(score)} · {target.coords}
        </p>
        <p className="mt-0.5 truncate text-[14px] font-medium text-white">
          {target.name}
          <span className="font-normal text-zinc-500"> — {target.subtitle}</span>
        </p>
        <p className="mt-1 text-[11px] leading-snug text-zinc-400">{target.summary}</p>
      </div>
    </div>
  )
}
