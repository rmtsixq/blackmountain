import { useMemo } from 'react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { TARGETS, targetById } from '../data/targets'
import { SUN_ELEVATIONS } from '../lib/analysis'
import { AXIS_TICK, GRID_STROKE, TOOLTIP_STYLE } from '../lib/chartTheme'
import { useT } from '../lib/i18n'
import { rich } from '../lib/rich'
import type { World } from '../lib/layers'
import { useStore } from '../store'
import { Panel } from './Panel'

/** Shadowed ground against sun elevation, ray-traced on each elevation model. */
export function ShadowChart({ world }: { world: World }) {
  const targetId = useStore((s) => s.target)
  const target = targetById(targetId)
  const { x, pct } = useT()
  const { earth, twins } = world.analysis
  const data = useMemo(
    () =>
      SUN_ELEVATIONS.map((elevation, i) => ({
        elevation,
        earth: +(earth.shadow[i] * 100).toFixed(1),
        ...Object.fromEntries(TARGETS.map((t) => [t.id, +(twins[t.id].shadow[i] * 100).toFixed(1)])),
      })),
    [earth, twins],
  )
  const ordered = [...TARGETS].sort((a, b) => Number(a.id === targetId) - Number(b.id === targetId))
  const low = SUN_ELEVATIONS.indexOf(1.5)

  return (
    <Panel
      title={x('Ground in shadow as the sun drops')}
      hint={x(
        'Horizon angles traced on each elevation model, curvature of the planet included. The lunar south pole never sees the sun above about 1.5°.',
      )}
    >
      <p className="mb-5 text-[15px] leading-snug text-ink">
        {rich(x('At 1.5° of sun, {a} of Karacadağ is in shadow; {b} of {name}.', { name: x(target.name) }), {
          a: <span className="font-display text-[40px] leading-none">{pct(earth.shadow[low] * 100)}</span>,
          b: (
            <span className="font-display text-[40px] leading-none text-accent">
              {pct(twins[targetId].shadow[low] * 100)}
            </span>
          ),
        })}
      </p>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 6, right: 4, bottom: 0, left: -20 }}>
            <CartesianGrid stroke={GRID_STROKE} vertical={false} />
            <XAxis
              dataKey="elevation"
              type="number"
              scale="log"
              domain={[1.5, 30]}
              ticks={SUN_ELEVATIONS}
              tickFormatter={(e: number) => `${e}°`}
              tick={AXIS_TICK}
              tickLine={false}
              stroke={GRID_STROKE}
            />
            <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} unit="%" />
            <Tooltip
              {...TOOLTIP_STYLE}
              labelFormatter={(e) => x('Sun {e}° above the horizon', { e: String(e) })}
              formatter={(v) => x('{v} % in shadow', { v: String(v) })}
            />
            {ordered.map((t) => {
              const on = t.id === targetId
              return (
                <Line
                  key={t.id}
                  name={x(t.name)}
                  dataKey={t.id}
                  type="monotone"
                  stroke={on ? 'var(--accent)' : 'var(--ink-4)'}
                  strokeWidth={on ? 1.75 : 1}
                  strokeDasharray={on ? undefined : '2 4'}
                  dot={on ? { r: 2, fill: 'var(--accent)', strokeWidth: 0 } : false}
                  animationDuration={500}
                />
              )
            })}
            <Line
              name="Karacadağ"
              dataKey="earth"
              type="monotone"
              stroke="var(--ink)"
              strokeWidth={1.75}
              dot={{ r: 2, fill: 'var(--ink)', strokeWidth: 0 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-label text-[11px] text-ink-3">
        <span className="flex items-center gap-1.5">
          <span className="h-px w-3 bg-ink" /> Karacadağ
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-px w-3 bg-accent" /> {x(target.name)}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 border-t border-dashed border-ink-3" /> {x('other targets')}
        </span>
      </p>
    </Panel>
  )
}
