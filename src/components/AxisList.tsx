import { AXES, targetById } from '../data/targets'
import { useT } from '../lib/i18n'
import type { World } from '../lib/layers'
import { axisResults, type AxisStatus } from '../lib/scores'
import { useStore } from '../store'
import { Panel } from './Panel'

const STATUS: Record<AxisStatus, string> = {
  computed: 'computed from both',
  published: 'measured vs published',
  placeholder: 'placeholder †',
}

export function AxisList({ world }: { world: World }) {
  const target = targetById(useStore((s) => s.target))
  const { x } = useT()
  const results = axisResults(target, world, x)

  return (
    <Panel
      title={x('Axis by axis')}
      hint={x('What we read on Earth, what is read on {body}, and where the comparison stops holding.', {
        body: x(target.body === 'Mars' ? 'Mars' : 'the Moon'),
      })}
    >
      <ul className="space-y-7">
        {AXES.map((axis) => {
          const a = results[axis.id]
          const soft = a.status === 'placeholder'
          return (
            <li key={axis.id}>
              <div className="flex items-baseline gap-3">
                <span className="text-[14px] text-ink">{x(axis.label)}</span>
                <span className={`flex-1 font-label text-[10px] ${soft ? 'text-ink-4' : 'text-ink-2'}`}>
                  {x(STATUS[a.status])}
                </span>
                <span className={`font-label text-[13px] tabular-nums ${soft ? 'text-ink-3' : 'text-ink'}`}>
                  {a.score.toFixed(0)}
                </span>
              </div>
              <div className="mt-2 h-px bg-ink/10">
                <div
                  className={`h-px transition-all duration-500 ${soft ? 'bg-ink-3' : 'bg-accent'}`}
                  style={{ width: `${a.score}%` }}
                />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-5 font-label text-[11px] leading-relaxed">
                <p className="text-ink-2">
                  <span className="block text-ink-4">{a.earthSensor}</span>
                  {a.earth}
                </p>
                <p className="text-ink-2">
                  <span className="block text-ink-4">{a.twinSensor}</span>
                  {a.twin}
                </p>
              </div>
              <p className="mt-3 border-l border-accent pl-3 text-[13px] leading-relaxed text-ink-2">
                {a.note}
              </p>
            </li>
          )
        })}
      </ul>
    </Panel>
  )
}
