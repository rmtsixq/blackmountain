import { useEffect } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'
import { overallScore, targetById } from '../data/targets'
import { useStore } from '../store'

const verdict = (score: number) =>
  score >= 65 ? 'a strong analog' : score >= 50 ? 'a partial analog' : 'a weak analog'

export function ScoreHeader() {
  const target = targetById(useStore((s) => s.target))
  const score = overallScore(target)
  const spring = useSpring(score, { stiffness: 80, damping: 20 })
  const text = useTransform(spring, (v) => v.toFixed(0))

  useEffect(() => {
    spring.set(score)
  }, [score, spring])

  return (
    <div>
      <p className="flex items-start font-display leading-[0.82] text-white">
        <motion.span className="text-[132px] tracking-tight">{text}</motion.span>
        <sup className="ml-1 mt-3 font-sans text-[13px] text-zinc-600">†</sup>
      </p>
      <p className="mt-4 text-[15px] leading-snug text-white">
        Karacadağ is {verdict(score)} for {target.name}
        <span className="text-zinc-500"> — {target.subtitle}.</span>
      </p>
      <p className="mt-2 max-w-[48ch] text-[13px] leading-relaxed text-zinc-500">{target.summary}</p>
    </div>
  )
}
