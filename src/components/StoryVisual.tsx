import { motion } from 'framer-motion'
import { MEASURED } from '../data/pit'
import { rankSites, SUN_ELEVATIONS } from '../lib/analysis'
import { useT } from '../lib/i18n'
import type { World } from '../lib/layers'
import type { Visual } from '../lib/story'
import { DayCurve } from './DayCurve'
import { PitCatalogue } from './PitCatalogue'
import { RockMatch } from './RockMatch'

const W = 300
const H = 120
const caption = 'mt-3 max-w-[58ch] text-[13px] leading-snug text-ink-4'
const tick = 'fill-ink-4 text-[11px]'

function Ranking({ world }: { world: World }) {
  const { t, num } = useT()
  const ranked = rankSites(world.analysis, 'arsia')
  return (
    <figure className="max-w-[440px]">
      <ol className="space-y-2">
        {ranked.map((s, i) => (
          <li key={s.id} className="grid grid-cols-[1.25rem_1fr_2rem] items-center gap-x-2">
            <span className="text-[13px] tabular-nums text-ink-4">{i + 1}</span>
            <span className={`truncate text-[15px] ${s.home ? 'font-semibold text-ink' : 'text-ink-2'}`}>{s.name}</span>
            <span className={`text-right text-[13px] tabular-nums ${s.home ? 'font-semibold text-ink' : 'text-ink-4'}`}>
              {num(s.topo.arsia)}
            </span>
            <span className="col-start-2 col-end-4 h-1 overflow-hidden rounded-full bg-paper-2">
              <motion.span
                className={`block h-1 rounded-full ${s.home ? 'bg-ink' : 'bg-ink-5'}`}
                initial={{ width: 0 }}
                animate={{ width: `${s.topo.arsia}%` }}
                transition={{ duration: 0.7, delay: 0.15 + i * 0.05, ease: 'easeOut' }}
              />
            </span>
          </li>
        ))}
      </ol>
      <figcaption className={caption}>{t.ranking}</figcaption>
    </figure>
  )
}

const draw = {
  initial: { pathLength: 0 },
  animate: { pathLength: 1 },
  transition: { duration: 1.2, ease: 'easeInOut' as const, delay: 0.2 },
}

function Year({ world }: { world: World }) {
  const { t, num } = useT()
  const rows = world.manifest.lst_series
  const lo = -10
  const hi = 58
  const x = (i: number) => (i / (rows.length - 1)) * W
  const y = (v: number) => H - ((v - lo) / (hi - lo)) * H
  const path = (key: 'field_day' | 'field_night') =>
    rows.map((r, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(r[key] ?? 0).toFixed(1)}`).join(' ')
  const end = rows[rows.length - 1]

  return (
    <figure>
      <svg viewBox={`-30 -10 ${W + 80} ${H + 22}`} className="w-full max-w-[440px] overflow-visible">
        {[0, 25, 50].map((v) => (
          <g key={v}>
            <line x1={0} x2={W} y1={y(v)} y2={y(v)} stroke="var(--rule)" />
            <text x={-8} y={y(v) + 4} textAnchor="end" className={tick}>
              {v}°
            </text>
          </g>
        ))}
        <motion.path d={path('field_day')} fill="none" stroke="var(--ink)" strokeWidth={1.75} {...draw} />
        <motion.path d={path('field_night')} fill="none" stroke="var(--ink-4)" strokeWidth={1.75} {...draw} />
        <text x={W + 8} y={y(end.field_day ?? 0) + 4} className="fill-ink text-[11px]">
          {t.yearDay}
        </text>
        <text x={W + 8} y={y(end.field_night ?? 0) + 4} className={tick}>
          {t.yearNight}
        </text>
        {/* our own reading, in the first month of the series */}
        <circle cx={x(0)} cy={y(MEASURED.inside)} r={5} fill="var(--field)" stroke="var(--ink)" strokeWidth={1.25} />
        <text x={x(0) + 10} y={y(MEASURED.inside) - 9} className="fill-ink text-[11px] font-medium">
          {t.yearPit(num(MEASURED.inside, 1))}
        </text>
      </svg>
      <figcaption className={caption}>{t.year}</figcaption>
    </figure>
  )
}

function Shadow({ world }: { world: World }) {
  const { t } = useT()
  const { earth, twins } = world.analysis
  const x = (i: number) => (i / (SUN_ELEVATIONS.length - 1)) * W
  const y = (f: number) => H - f * H * 1.3
  const path = (curve: number[]) =>
    curve.map((f, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(f).toFixed(1)}`).join(' ')
  const lastIndex = SUN_ELEVATIONS.length - 1

  return (
    <figure>
      <svg viewBox={`-6 -10 ${W + 90} ${H + 30}`} className="w-full max-w-[440px] overflow-visible">
        <line x1={0} x2={W} y1={H} y2={H} stroke="var(--rule)" />
        <motion.path d={path(twins.shackleton.shadow)} fill="none" stroke="var(--accent)" strokeWidth={1.75} {...draw} />
        <motion.path d={path(earth.shadow)} fill="none" stroke="var(--ink)" strokeWidth={1.75} {...draw} />
        <text x={8} y={y(twins.shackleton.shadow[0]) - 8} className="fill-accent text-[11px] font-medium">
          {t.shackleton}
        </text>
        <text x={8} y={y(earth.shadow[0]) + 16} className="fill-ink text-[11px] font-medium">
          {t.karacadag}
        </text>
        {SUN_ELEVATIONS.map((e, i) => (
          <text key={e} x={x(i)} y={H + 16} textAnchor={i === lastIndex ? 'end' : i ? 'middle' : 'start'} className={tick}>
            {e}°
          </text>
        ))}
      </svg>
      <figcaption className={caption}>{t.shadow}</figcaption>
    </figure>
  )
}

/** The single small graphic a chapter may carry. */
export function StoryVisual({ kind, world }: { kind: Visual; world: World }) {
  if (kind === 'ranking') return <Ranking world={world} />
  if (kind === 'year') return <Year world={world} />
  if (kind === 'day') return <DayCurve />
  if (kind === 'catalogue') return <PitCatalogue />
  if (kind === 'rock') return <RockMatch />
  return <Shadow world={world} />
}
