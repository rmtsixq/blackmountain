import { useEffect } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'
import { targetById } from '../data/targets'
import { rankSites } from '../lib/analysis'
import type { World } from '../lib/layers'
import { terrainScore } from '../lib/scores'
import { useStore } from '../store'

const ORDINAL = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth']

/** The answer in one number and one sentence. */
export function ScoreHeader({ world }: { world: World }) {
  const target = targetById(useStore((s) => s.target))
  const score = terrainScore(target, world)
  const spring = useSpring(score, { stiffness: 80, damping: 20 })
  const text = useTransform(spring, (v) => v.toFixed(0))

  useEffect(() => {
    spring.set(score)
  }, [score, spring])

  const ranked = rankSites(world.analysis, target.id)
  const place = ranked.findIndex((s) => s.home)
  const behind = ranked.slice(place + 1, place + 3).map((s) => s.name)
  const leader = ranked[0]

  return (
    <div>
      <p className="font-display leading-[0.82] text-white">
        <motion.span className="text-[132px] tracking-tight">{text}</motion.span>
        <span className="ml-2 font-mono text-[11px] text-zinc-600">% terrain match</span>
      </p>
      <p className="mt-4 text-[15px] leading-snug text-white">
        Karacadağ ranks {ORDINAL[place]} of {ranked.length} Earth sites for the terrain of{' '}
        {target.name}
        <span className="text-zinc-500">
          {place === 0
            ? ', ahead of every established analog tested.'
            : behind.length
              ? `, ahead of ${behind.join(' and ')}. ${leader.name} leads.`
              : `. ${leader.name} leads.`}
        </span>
      </p>
      <p className="mt-2 max-w-[48ch] text-[13px] leading-relaxed text-zinc-500">{target.summary}</p>
    </div>
  )
}
