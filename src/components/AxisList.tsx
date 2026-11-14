import { AXES, targetById } from '../data/targets'
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
  const results = axisResults(target, world)

  return (
    <Panel
      title="Axis by axis"
      hint={`What we read on Earth, what is read on ${target.body === 'Mars' ? 'Mars' : 'the Moon'}, and where the comparison stops holding.`}
    >
      <ul className="space-y-7">
        {AXES.map((axis) => {
          const a = results[axis.id]
          const soft = a.status === 'placeholder'
          return (
            <li key={axis.id}>
              <div className="flex items-baseline gap-3">
                <span className="text-[14px] text-white">{axis.label}</span>
                <span className={`flex-1 font-mono text-[10px] ${soft ? 'text-zinc-600' : 'text-zinc-400'}`}>
                  {STATUS[a.status]}
                </span>
                <span className={`font-mono text-[13px] tabular-nums ${soft ? 'text-zinc-500' : 'text-white'}`}>
                  {a.score.toFixed(0)}
                </span>
              </div>
              <div className="mt-2 h-px bg-white/10">
                <div
                  className={`h-px transition-all duration-500 ${soft ? 'bg-zinc-500' : 'bg-ember'}`}
                  style={{ width: `${a.score}%` }}
                />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-5 font-mono text-[11px] leading-relaxed">
                <p className="text-zinc-300">
                  <span className="block text-zinc-600">{a.earthSensor}</span>
                  {a.earth}
                </p>
                <p className="text-zinc-300">
                  <span className="block text-zinc-600">{a.twinSensor}</span>
                  {a.twin}
                </p>
              </div>
              <p className="mt-3 border-l border-ember pl-3 text-[13px] leading-relaxed text-zinc-400">
                {a.note}
              </p>
            </li>
          )
        })}
      </ul>
    </Panel>
  )
}
