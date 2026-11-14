import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { AXES, TARGETS } from '../data/targets'
import { GRID_STROKE, TOOLTIP_STYLE } from '../lib/chartTheme'
import { useStore } from '../store'
import { Panel } from './Panel'

const DATA = AXES.map((a) => ({
  axis: a.short,
  ...Object.fromEntries(TARGETS.map((t) => [t.id, t.axes[a.id].score])),
}))

export function FingerprintRadar() {
  const targetId = useStore((s) => s.target)
  const ordered = [...TARGETS].sort((a, b) => Number(a.id === targetId) - Number(b.id === targetId))

  return (
    <Panel
      title="Analog fingerprint"
      hint="Similarity per axis, each from a sensor pair measuring the same physics on both worlds."
      demo
    >
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={DATA} outerRadius="74%">
            <PolarGrid stroke={GRID_STROKE} />
            <PolarAngleAxis dataKey="axis" tick={{ fill: '#a1a1aa', fontSize: 11 }} />
            <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
            {ordered.map((t) => {
              const on = t.id === targetId
              return (
                <Radar
                  key={t.id}
                  name={t.name}
                  dataKey={t.id}
                  stroke={t.color}
                  strokeWidth={on ? 2 : 1}
                  strokeOpacity={on ? 1 : 0.4}
                  strokeDasharray={on ? undefined : '3 3'}
                  fill={t.color}
                  fillOpacity={on ? 0.22 : 0}
                  dot={on ? { r: 2.5, fill: t.color, strokeWidth: 0 } : false}
                  animationDuration={500}
                />
              )
            })}
            <Tooltip {...TOOLTIP_STYLE} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
        {TARGETS.map((t) => (
          <span key={t.id} className="flex items-center gap-1.5 text-[11px] text-zinc-400">
            <span className="size-2 rounded-full" style={{ background: t.color }} />
            {t.name}
          </span>
        ))}
      </div>
    </Panel>
  )
}
