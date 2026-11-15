import { useEffect } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'
import { targetById } from '../data/targets'
import { rankSites } from '../lib/analysis'
import { useT } from '../lib/i18n'
import type { World } from '../lib/layers'
import { terrainScore } from '../lib/scores'
import { useStore } from '../store'

const ORDINAL = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth']

/** The answer in one number and one sentence. */
export function ScoreHeader({ world }: { world: World }) {
  const target = targetById(useStore((s) => s.target))
  const { x } = useT()
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
      <p className="font-display leading-[0.82] text-ink">
        <motion.span className="text-[132px] tracking-tight">{text}</motion.span>
        <span className="ml-2 font-label text-[11px] text-ink-4">{x('% terrain match')}</span>
      </p>
      <p className="mt-4 text-[15px] leading-snug text-ink">
        {x('Karacadağ ranks {ord} of {n} Earth sites for the terrain of {name}', {
          ord: ORDINAL[place],
          place: place + 1,
          n: ranked.length,
          name: x(target.name),
        })}
        <span className="text-ink-3">
          {place === 0
            ? x(', ahead of every established analog tested.')
            : behind.length
              ? x(', ahead of {names}. {leader} leads.', { names: behind.join(x(' and ')), leader: leader.name })
              : x('. {leader} leads.', { leader: leader.name })}
        </span>
      </p>
      <p className="mt-2 max-w-[48ch] text-[13px] leading-relaxed text-ink-3">{x(target.summary)}</p>
    </div>
  )
}
