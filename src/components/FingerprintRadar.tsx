import { useMemo } from 'react'
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
import type { World } from '../lib/layers'
import { axisResults } from '../lib/scores'
import { useStore } from '../store'
import { Panel } from './Panel'

export function FingerprintRadar({ world }: { world: World }) {
  const targetId = useStore((s) => s.target)
  const data = useMemo(() => {
    const results = TARGETS.map((t) => [t.id, axisResults(t, world)] as const)
    return AXES.map((a) => ({
      axis: a.short,
      ...Object.fromEntries(results.map(([id, r]) => [id, Math.round(r[a.id].score)])),
    }))
  }, [world])
  const ordered = [...TARGETS].sort((a, b) => Number(a.id === targetId) - Number(b.id === targetId))

  return (
    <Panel
      title="Fingerprint"
      hint="Five axes. Terrain and light are computed from elevation on both worlds; thermal compares VIIRS with published values. Radar and rock are placeholders†. The other two targets are dashed."
    >
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} outerRadius="76%">
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
                  stroke={on ? 'var(--accent)' : 'var(--ink-3)'}
                  strokeWidth={on ? 1.5 : 1}
                  strokeDasharray={on ? undefined : '2 4'}
                  fill="var(--accent)"
                  fillOpacity={on ? 0.14 : 0}
                  dot={on ? { r: 2, fill: 'var(--accent)', strokeWidth: 0 } : false}
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
