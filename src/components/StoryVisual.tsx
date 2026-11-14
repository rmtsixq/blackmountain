import { motion } from 'framer-motion'
import { rankSites, SUN_ELEVATIONS } from '../lib/analysis'
import type { World } from '../lib/layers'
import type { Visual } from '../lib/story'

const W = 300
const H = 120

function Ranking({ world }: { world: World }) {
  const ranked = rankSites(world.analysis, 'arsia')
  return (
    <ol className="space-y-2.5">
      {ranked.map((s, i) => (
        <li key={s.id}>
          <div className={`flex items-baseline justify-between text-[13px] ${s.home ? 'text-white' : 'text-zinc-500'}`}>
            <span>
              <span className={`mr-3 font-mono text-[10px] ${s.home ? 'text-ember' : 'text-zinc-700'}`}>
                {i + 1}
              </span>
              {s.name}
            </span>
            <span className="font-mono text-[11px] tabular-nums">{s.topo.arsia.toFixed(0)}</span>
          </div>
          <div className="mt-1.5 h-px bg-white/10">
            <motion.div
              className={`h-px ${s.home ? 'bg-ember' : 'bg-zinc-500'}`}
              initial={{ width: 0 }}
              animate={{ width: `${s.topo.arsia}%` }}
              transition={{ duration: 0.9, delay: 0.25 + i * 0.07, ease: 'easeOut' }}
            />
          </div>
        </li>
      ))}
      <li className="pt-1 font-mono text-[10px] text-zinc-600">terrain match with Arsia Mons, %</li>
    </ol>
  )
}

const draw = {
  initial: { pathLength: 0 },
  animate: { pathLength: 1 },
  transition: { duration: 1.4, ease: 'easeInOut' as const, delay: 0.3 },
}

function Year({ world }: { world: World }) {
  const rows = world.manifest.lst_series
  const a = world.manifest.lst_annual
  const mean = ((a.field_day ?? 0) + (a.field_night ?? 0)) / 2
  const lo = -10
  const hi = 58
  const x = (i: number) => (i / (rows.length - 1)) * W
  const y = (t: number) => H - ((t - lo) / (hi - lo)) * H
  const path = (key: 'field_day' | 'field_night') =>
    rows.map((r, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(r[key] ?? mean).toFixed(1)}`).join(' ')

  return (
    <div>
      <svg width={W} height={H} className="overflow-visible">
        <line x1={0} x2={W} y1={y(mean)} y2={y(mean)} stroke="#ff6a3d" strokeDasharray="2 4" />
        <line x1={0} x2={W} y1={y(4.5)} y2={y(4.5)} stroke="#fff" strokeOpacity={0.6} strokeDasharray="2 4" />
        <motion.path d={path('field_day')} fill="none" stroke="#ff6a3d" strokeWidth={1.5} {...draw} />
        <motion.path d={path('field_night')} fill="none" stroke="#fff" strokeWidth={1.5} {...draw} />
        <text x={W + 8} y={y(mean) + 3} className="fill-ember font-mono text-[10px]">
          surface mean {mean.toFixed(0)}°
        </text>
        <text x={W + 8} y={y(4.5) + 3} className="fill-white font-mono text-[10px]">
          in the tube 4–5°
        </text>
      </svg>
      <p className="mt-3 font-mono text-[10px] text-zinc-600">
        Nov 2025 – Oct 2026 · day in orange, night in white
      </p>
    </div>
  )
}

function Shadow({ world }: { world: World }) {
  const { earth, twins } = world.analysis
  const x = (i: number) => (i / (SUN_ELEVATIONS.length - 1)) * W
  const y = (f: number) => H - f * H * 1.3
  const path = (curve: number[]) =>
    curve.map((f, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(f).toFixed(1)}`).join(' ')

  return (
    <div>
      <svg width={W} height={H} className="overflow-visible">
        <line x1={0} x2={W} y1={H} y2={H} stroke="#fff" strokeOpacity={0.15} />
        <motion.path d={path(twins.shackleton.shadow)} fill="none" stroke="#ff6a3d" strokeWidth={1.5} {...draw} />
        <motion.path d={path(earth.shadow)} fill="none" stroke="#fff" strokeWidth={1.5} {...draw} />
        {SUN_ELEVATIONS.map((e, i) => (
          <text key={e} x={x(i)} y={H + 14} textAnchor="middle" className="fill-zinc-600 font-mono text-[10px]">
            {e}°
          </text>
        ))}
      </svg>
      <p className="mt-6 font-mono text-[10px] text-zinc-600">
        ground in shadow by sun elevation · Shackleton in orange, Karacadağ in white
      </p>
    </div>
  )
}

/** The single small graphic a chapter may carry. */
export function StoryVisual({ kind, world }: { kind: Visual; world: World }) {
  if (kind === 'ranking') return <Ranking world={world} />
  if (kind === 'year') return <Year world={world} />
  return <Shadow world={world} />
}
