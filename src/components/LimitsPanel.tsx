import { AXES, EARTH_LIMITS, TARGETS } from '../data/targets'
import { useT } from '../lib/i18n'
import type { World } from '../lib/layers'
import { axisResults } from '../lib/scores'
import { Panel } from './Panel'

export function LimitsPanel({ world }: { world: World }) {
  const { x, lang } = useT()
  return (
    <>
      <Panel
        title={x('What Earth cannot reproduce')}
        hint={x('Stating the limits is part of the result. None of these change with more data.')}
      >
        <ol className="space-y-5">
          {EARTH_LIMITS.map((l, i) => (
            <li key={l.title} className="flex gap-4">
              <span className="font-display text-[28px] leading-none text-ink-4">{i + 1}</span>
              <p className="text-[13px] leading-relaxed text-ink-2">
                <span className="text-ink">{x(l.title)}.</span> {x(l.text)}
              </p>
            </li>
          ))}
        </ol>
      </Panel>

      <Panel
        title={x('The weakest measured axis for each target')}
        hint={x('Where each comparison should not be trusted.')}
      >
        <ul className="space-y-5">
          {TARGETS.map((t) => {
            const results = axisResults(t, world, x)
            const worst = [...AXES].sort((a, b) => results[a.id].score - results[b.id].score)[0]
            const axis = results[worst.id]
            return (
              <li key={t.id}>
                <p className="flex items-baseline justify-between text-[14px] text-ink">
                  {x(t.name)}
                  <span className="font-label text-[11px] text-ink-3">
                    {x(worst.label).toLocaleLowerCase(lang)}{' '}
                    <span className="text-accent">{axis.score.toFixed(0)}</span>
                  </span>
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-2">{axis.note}</p>
              </li>
            )
          })}
        </ul>
      </Panel>
    </>
  )
}
