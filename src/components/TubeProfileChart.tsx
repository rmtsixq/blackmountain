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
      title="Inside the lava tube"
      hint="Temperature through the day, from sunlit basalt to 25 m inside. The vertical line is the sun slider."
      demo
    >
      {TUBE_PROFILE.length === 0 ? (
        <EmptyState title="No readings yet" text="The profile appears once the field sheet is loaded." />
      ) : (
        <>
          <p className="mb-5 text-[15px] leading-snug text-white">
            <span className="font-display text-[40px] leading-none">
              {TUBE_STATS.surfaceSwing.toFixed(0)} K
            </span>{' '}
            of swing outside becomes{' '}
            <span className="font-display text-[40px] leading-none text-ember">
              {TUBE_STATS.deepSwing.toFixed(1)} K
            </span>{' '}
            at 25 m.
          </p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={TUBE_PROFILE} margin={{ top: 6, right: 4, bottom: 0, left: -24 }}>
                <CartesianGrid stroke={GRID_STROKE} vertical={false} />
                <XAxis
                  dataKey="hour"
                  type="number"
                  domain={[7, 18]}
                  ticks={[7, 9, 11, 13, 15, 17]}
                  tickFormatter={(h: number) => String(h).padStart(2, '0')}
                  tick={AXIS_TICK}
                  tickLine={false}
                  stroke={GRID_STROKE}
                />
                <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} unit="°" />
                <Tooltip
                  {...TOOLTIP_STYLE}
                  labelFormatter={(h) => `${formatHour(Number(h))} solar time`}
                  formatter={(v) => `${Number(v).toFixed(1)} °C`}
                />
                <ReferenceLine x={hour} stroke="#ffffff" strokeOpacity={0.6} />
                {TUBE_SERIES.map((s) => (
                  <Line
                    key={s.key}
                    name={s.label}
                    dataKey={s.key}
                    stroke={s.color}
                    strokeWidth={s.key === 'm25' || s.key === 'sun' ? 1.75 : 1}
                    dot={false}
                    type="monotone"
                    animationDuration={600}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-zinc-500">
            {TUBE_SERIES.map((s) => (
              <span key={s.key} className="flex items-center gap-1.5">
                <span className="h-px w-3" style={{ background: s.color }} />
                {s.label.toLowerCase()}
              </span>
            ))}
          </p>
          <p className="mt-4 border-l border-ember pl-3 text-[13px] leading-relaxed text-zinc-400">
            Lunar pits hold about 17 °C in shade while the surface runs from +127 °C to −173 °C
            (LRO Diviner). Measuring the same damping here is the cold-trap test.
          </p>
        </>
      )}
    </Panel>
  )
}
