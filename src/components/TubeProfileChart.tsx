import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Thermometer } from 'lucide-react'
import { TUBE_PROFILE, TUBE_SERIES, TUBE_STATS } from '../data/field'
import { AXIS_TICK, GRID_STROKE, TOOLTIP_STYLE } from '../lib/chartTheme'
import { formatHour } from '../lib/solar'
import { useStore } from '../store'
import { EmptyState } from './EmptyState'
import { Panel } from './Panel'

export function TubeProfileChart() {
  const hour = useStore((s) => s.hour)

  return (
    <Panel
      title="Lava-tube thermal profile"
      hint="Temperature through the day from sunlit basalt to 25 m inside TUBE-A."
      demo
    >
      {TUBE_PROFILE.length === 0 ? (
        <EmptyState icon={Thermometer} title="No readings yet" text="Thermal profile appears once the field sheet is loaded." />
      ) : (
        <>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={TUBE_PROFILE} margin={{ top: 6, right: 8, bottom: 0, left: -22 }}>
                <CartesianGrid stroke={GRID_STROKE} vertical={false} />
                <XAxis
                  dataKey="hour"
                  type="number"
                  domain={[7, 18]}
                  ticks={[7, 9, 11, 13, 15, 17]}
                  tickFormatter={(h: number) => `${h}h`}
                  tick={AXIS_TICK}
                  stroke={GRID_STROKE}
                />
                <YAxis tick={AXIS_TICK} stroke={GRID_STROKE} unit="°" />
                <Tooltip
                  {...TOOLTIP_STYLE}
                  labelFormatter={(h) => `${formatHour(Number(h))} solar time`}
                  formatter={(v) => `${Number(v).toFixed(1)} °C`}
                />
                <ReferenceLine x={hour} stroke="#ffffff" strokeOpacity={0.5} strokeDasharray="2 3" />
                {TUBE_SERIES.map((s) => (
                  <Line
                    key={s.key}
                    name={s.label}
                    dataKey={s.key}
                    stroke={s.color}
                    strokeWidth={1.75}
                    dot={false}
                    type="monotone"
                    animationDuration={600}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
            {TUBE_SERIES.map((s) => (
              <span key={s.key} className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                <span className="h-0.5 w-3 rounded-full" style={{ background: s.color }} />
                {s.label}
              </span>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            {[
              ['Surface swing', `${TUBE_STATS.surfaceSwing.toFixed(1)} K`],
              ['Swing at 25 m', `${TUBE_STATS.deepSwing.toFixed(2)} K`],
              ['Deep mean', `${TUBE_STATS.deepMean.toFixed(1)} °C`],
            ].map(([k, v]) => (
              <div key={k} className="rounded-md bg-white/4 py-1.5">
                <p className="font-mono text-[9px] uppercase tracking-wider text-zinc-500">{k}</p>
                <p className="mt-0.5 text-[13px] font-semibold tabular-nums text-white">{v}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] leading-snug text-zinc-400">
            Lunar pits hold a steady ~17 °C in shade while the surface swings from +127 °C to
            −173 °C (LRO Diviner). The same damping, measured here, is the cold-trap test.
          </p>
        </>
      )}
    </Panel>
  )
}
