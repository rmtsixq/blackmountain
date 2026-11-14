import { ArrowLeftRight, Gem, Mountain, Radar, Sun, Thermometer, Unlink, type LucideIcon } from 'lucide-react'
import { AXES, targetById, type AxisId } from '../data/targets'
import { useStore } from '../store'
import { Panel } from './Panel'

const ICONS: Record<AxisId, LucideIcon> = {
  thermal: Thermometer,
  radar: Radar,
  topo: Mountain,
  composition: Gem,
  illumination: Sun,
}

export function AxisList() {
  const target = targetById(useStore((s) => s.target))

  return (
    <Panel
      title="Twin-sensor axes"
      hint={`Earth instrument ⇄ ${target.body} instrument, and where the analogy breaks.`}
      demo
    >
      <ul className="space-y-4">
        {AXES.map((axis) => {
          const a = target.axes[axis.id]
          const Icon = ICONS[axis.id]
          return (
            <li key={axis.id}>
              <div className="flex items-center gap-2.5">
                <Icon className="size-4 shrink-0 text-zinc-500" strokeWidth={1.75} />
                <span className="flex-1 text-[13px] font-medium text-zinc-100">{axis.label}</span>
                <span className="font-mono text-[13px] tabular-nums text-white">{a.score}</span>
              </div>
              <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/8">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${a.score}%`, background: target.color }}
                />
              </div>
              <div className="mt-2 grid grid-cols-[1fr_auto_1fr] items-start gap-2 font-mono text-[10px] leading-snug">
                <div>
                  <p className="text-zinc-600">{axis.earthSensor}</p>
                  <p className="mt-0.5 text-zinc-300">{a.earth}</p>
                </div>
                <ArrowLeftRight className="mt-0.5 size-3 text-zinc-600" />
                <div className="text-right">
                  <p className="text-zinc-600">{a.twinSensor}</p>
                  <p className="mt-0.5 text-zinc-300">{a.twin}</p>
                </div>
              </div>
              <p className="mt-2 flex gap-1.5 rounded-lg bg-white/4 px-2.5 py-2 text-[11px] leading-snug text-zinc-400">
                <Unlink className="mt-0.5 size-3 shrink-0 text-ember" strokeWidth={2} />
                {a.note}
              </p>
            </li>
          )
        })}
      </ul>
    </Panel>
  )
}
