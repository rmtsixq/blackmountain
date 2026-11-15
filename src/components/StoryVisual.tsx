import { motion } from 'framer-motion'
import { MEASURED } from '../data/pit'
import { rankSites, SUN_ELEVATIONS } from '../lib/analysis'
import { useT } from '../lib/i18n'
import type { World } from '../lib/layers'
import type { Visual } from '../lib/story'
import { NightCurve } from './NightCurve'
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
  const { t, num, lang } = useT()
  const rows = world.manifest.lst_series
  const W = 340
  const H = 150
  const lo = -10
  const hi = 60
  const x = (i: number) => (i / (rows.length - 1)) * W
  const y = (v: number) => H - ((v - lo) / (hi - lo)) * H
  const day = rows.map((r) => r.field_day ?? 0)
  const night = rows.map((r) => r.field_night ?? 0)
  const line = (values: number[]) => values.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')
  const band = `${line(day)} ${night.map((v, i) => `L${x(i).toFixed(1)},${y(v).toFixed(1)}`).reverse().join(' ')} Z`
  const hot = day.indexOf(Math.max(...day))
  const cold = night.indexOf(Math.min(...night))
  const last = rows.length - 1
  const month = (key: string) =>
    new Date(2000, Number(key.slice(5)) - 1, 1).toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US', { month: 'short' })

  return (
    <figure>
      <svg viewBox={`-34 -12 ${W + 122} ${H + 34}`} className="w-full max-w-[480px] overflow-visible">
        {[0, 20, 40, 60].map((v) => (
          <g key={v}>
            <line x1={0} x2={W} y1={y(v)} y2={y(v)} stroke="var(--rule)" />
            <text x={-8} y={y(v) + 4} textAnchor="end" className={tick}>
              {v}°
            </text>
          </g>
        ))}
        {rows.map((r, i) => (
          <text key={r.month} x={x(i)} y={H + 16} textAnchor="middle" className="fill-ink-4 text-[10px]">
            {month(r.month)}
          </text>
        ))}

        {/* the day–night difference, month by month */}
        <motion.path d={band} fill="color-mix(in srgb, var(--ink) 7%, transparent)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.9 }} />
        <motion.path d={line(day)} fill="none" stroke="var(--ink)" strokeWidth={1.75} {...draw} />
        <motion.path d={line(night)} fill="none" stroke="var(--ink-4)" strokeWidth={1.75} {...draw} />
        <text x={W + 8} y={y(day[last]) + 4} className="fill-ink text-[11px] font-medium">
          {t.yearDay}
        </text>
        <text x={W + 8} y={y(night[last]) + 4} className={tick}>
          {t.yearNight}
        </text>

        {/* the hottest month: the gap, bracketed and named */}
        <path
          d={`M${x(hot) - 4},${y(day[hot])} h8 m-4,0 V${y(night[hot])} m-4,0 h8`}
          fill="none"
          stroke="var(--ink-3)"
          strokeWidth={1}
        />
        <text x={x(hot) - 9} y={(y(day[hot]) + y(night[hot])) / 2 + 4} textAnchor="end" className="fill-ink-2 text-[11px] font-medium">
          {t.yearGap(num(day[hot] - night[hot]))}
        </text>
        <text x={x(hot)} y={y(day[hot]) - 8} textAnchor="middle" className="fill-ink text-[11px] font-semibold">
          {num(day[hot])} °C
        </text>
        <text x={x(cold)} y={y(night[cold]) - 7} textAnchor="middle" className={tick}>
          {num(night[cold])} °C
        </text>

        {/* our own reading, set in its month */}
        <circle cx={x(0)} cy={y(MEASURED.inside)} r={5} fill="var(--field)" stroke="var(--ink)" strokeWidth={1.25} />
      </svg>
      <p className="mt-3 flex items-center gap-2 text-[13px] font-medium text-ink">
        <span className="size-2.5 rounded-full border border-ink bg-field" />
        {t.yearPit(num(MEASURED.inside, 1))}
      </p>
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
  if (kind === 'night') return <NightCurve />
  if (kind === 'catalogue') return <PitCatalogue />
  if (kind === 'rock') return <RockMatch />
  return <Shadow world={world} />
}
