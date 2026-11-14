import { AXES, targetById } from '../data/targets'
import { useStore } from '../store'
import { Panel } from './Panel'

export function AxisList() {
  const target = targetById(useStore((s) => s.target))

  return (
    <Panel
      title="Axis by axis"
      hint={`What we read on Earth, what the ${target.body} instrument reads, and where the comparison stops holding.`}
      demo
    >
      <ul className="space-y-7">
        {AXES.map((axis) => {
          const a = target.axes[axis.id]
          return (
            <li key={axis.id}>
              <div className="flex items-baseline justify-between">
                <span className="text-[14px] text-white">{axis.label}</span>
                <span className="font-mono text-[13px] tabular-nums text-white">{a.score}</span>
              </div>
              <div className="mt-2 h-px bg-white/10">
                <div
                  className="h-px bg-ember transition-all duration-500"
                  style={{ width: `${a.score}%` }}
                />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-5 font-mono text-[11px] leading-relaxed">
                <p className="text-zinc-300">
                  <span className="block text-zinc-600">{axis.earthSensor}</span>
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
