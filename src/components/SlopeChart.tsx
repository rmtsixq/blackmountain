import { useMemo } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { targetById } from '../data/targets'
import { BASELINE_M } from '../lib/analysis'
import { AXIS_TICK, GRID_STROKE, TOOLTIP_STYLE } from '../lib/chartTheme'
import type { World } from '../lib/layers'
import { useStore } from '../store'
import { Panel } from './Panel'

/** The evidence behind the terrain score: both slope distributions. */
export function SlopeChart({ world }: { world: World }) {
  const target = targetById(useStore((s) => s.target))
  const { earth, twins } = world.analysis
  const twin = twins[target.id]
  const data = useMemo(
    () =>
      earth.slopeHist.slice(0, 26).map((e, i) => ({
        slope: i + 0.5,
        earth: +(e * 100).toFixed(2),
        twin: +(twin.slopeHist[i] * 100).toFixed(2),
      })),
    [earth, twin],
  )

  return (
    <Panel
      title="How steep the ground is"
      hint={`Share of each 62 km square at every slope, measured the same way (${BASELINE_M} m baseline) on Karacadağ and on ${target.name}.`}
    >
      <p className="mb-5 text-[15px] leading-snug text-ink">
        <span className="font-display text-[40px] leading-none text-accent">
          {(twin.slopeSim * 100).toFixed(0)}%
        </span>{' '}
        overlap in slope,{' '}
        <span className="font-display text-[40px] leading-none">
          {(twin.roughSim * 100).toFixed(0)}%
        </span>{' '}
        in roughness,{' '}
        <span className="font-display text-[40px] leading-none">
          {(twin.reliefSim * 100).toFixed(0)}%
        </span>{' '}
        in relief.
      </p>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 6, right: 4, bottom: 0, left: -20 }}>
            <CartesianGrid stroke={GRID_STROKE} vertical={false} />
            <XAxis
              dataKey="slope"
              type="number"
              domain={[0, 26]}
              ticks={[0, 5, 10, 15, 20, 25]}
              tickFormatter={(s: number) => `${s}°`}
              tick={AXIS_TICK}
              tickLine={false}
              stroke={GRID_STROKE}
            />
            <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} unit="%" />
            <Tooltip
              {...TOOLTIP_STYLE}
              labelFormatter={(s) => `${Math.floor(Number(s))}–${Math.floor(Number(s)) + 1}° slope`}
              formatter={(v) => `${Number(v).toFixed(1)} % of ground`}
            />
            <Area
              name={target.name}
              dataKey="twin"
              type="monotone"
              stroke="var(--accent)"
              strokeWidth={1.5}
              fill="var(--accent)"
              fillOpacity={0.14}
              animationDuration={500}
            />
            <Area
              name="Karacadağ"
              dataKey="earth"
              type="monotone"
              stroke="var(--ink)"
              strokeWidth={1.5}
              fill="var(--ink)"
              fillOpacity={0.05}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-label text-[11px] text-ink-3">
        <span className="flex items-center gap-1.5">
          <span className="h-px w-3 bg-ink" /> Karacadağ, median {earth.medianSlope.toFixed(1)}°
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-px w-3 bg-accent" /> {target.name}, median {twin.medianSlope.toFixed(1)}°
        </span>
      </p>
    </Panel>
  )
}
