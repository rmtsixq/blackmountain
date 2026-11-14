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
      title="Fingerprint"
      hint="Five axes, each scored from a pair of instruments that measure the same physics on both worlds. The other two targets are dashed."
      demo
    >
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={DATA} outerRadius="76%">
            <PolarGrid stroke={GRID_STROKE} />
            <PolarAngleAxis dataKey="axis" tick={{ fill: '#a1a1aa', fontSize: 12 }} />
            <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
            {ordered.map((t) => {
              const on = t.id === targetId
              return (
                <Radar
                  key={t.id}
                  name={t.name}
                  dataKey={t.id}
                  stroke={on ? '#ff6a3d' : '#6b6b6b'}
                  strokeWidth={on ? 1.5 : 1}
                  strokeDasharray={on ? undefined : '2 4'}
                  fill="#ff6a3d"
                  fillOpacity={on ? 0.14 : 0}
                  dot={on ? { r: 2, fill: '#ff6a3d', strokeWidth: 0 } : false}
                  animationDuration={500}
                />
              )
            })}
            <Tooltip {...TOOLTIP_STYLE} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  )
}
