import { motion } from 'framer-motion'
import { ROCK_CONTROL, ROCK_MATCH } from '../data/rock'
import type { TargetId } from '../data/targets'
import { useT } from '../lib/i18n'

const ORDER: TargetId[] = ['arsia', 'tranq', 'shackleton']

/** How close Ovabağ lava is to three published rocks, with the yardstick. */
export function RockMatch() {
  const { t } = useT()
  return (
    <figure className="max-w-[440px]">
      <ol className="relative space-y-3">
        {ORDER.map((id, i) => {
          const { score, low, high } = ROCK_MATCH[id]
          const first = i === 0
          return (
            <li key={id} className="grid grid-cols-[1fr_2rem] items-center gap-x-2">
              <span className={`truncate text-[15px] ${first ? 'font-semibold text-ink' : 'text-ink-2'}`}>
                {t.rockRows[id]}
              </span>
              <span className={`text-right text-[13px] tabular-nums ${first ? 'font-semibold text-ink' : 'text-ink-4'}`}>
                {score}
              </span>
              <span className="relative col-span-2 h-1 rounded-full bg-paper-2">
                <motion.span
                  className={`block h-1 rounded-full ${first ? 'bg-ink' : 'bg-ink-5'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 0.7, delay: 0.15 + i * 0.06, ease: 'easeOut' }}
                />
                {/* range across the four Karacadağ samples */}
                <span
                  className="absolute -top-1 h-3 border-x border-ink-4"
                  style={{ left: `${low}%`, width: `${high - low}%` }}
                />
              </span>
            </li>
          )
        })}
        {/* the yardstick: Mars basalt against lunar mare basalt */}
        <li aria-hidden className="pointer-events-none absolute inset-y-0 border-l border-dashed border-accent" style={{ left: `${ROCK_CONTROL}%` }} />
      </ol>
      <p className="mt-3 text-[12px] font-medium text-accent">┆ {t.rockControl(ROCK_CONTROL)}</p>
      <figcaption className="mt-2 max-w-[58ch] text-[13px] leading-snug text-ink-4">{t.rockCaption}</figcaption>
    </figure>
  )
}
