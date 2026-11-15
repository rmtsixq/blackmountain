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
import { useT } from '../lib/i18n'
import { rich } from '../lib/rich'
import { formatHour } from '../lib/solar'
import { useStore } from '../store'
import { Panel } from './Panel'

export function TubeProfileChart() {
  const hour = useStore((s) => s.hour)
  const { x, lang } = useT()

  return (
    <Panel
      title={x('Inside a lava tube')}
      hint={x('How a day of temperature fades with depth, from sunlit basalt to 25 m inside, calculated as a damped wave. The vertical line is the sun slider.')}
    >
      {(
        <>
          <p className="mb-5 text-[15px] leading-snug text-ink">
            {rich(x('Calculated: {a} of swing outside becomes {b} at 25 m.'), {
              a: <span className="font-display text-[40px] leading-none">{TUBE_STATS.surfaceSwing.toFixed(0)} K</span>,
              b: (
                <span className="font-display text-[40px] leading-none text-accent">
                  {TUBE_STATS.deepSwing.toFixed(1)} K
                </span>
              ),
            })}
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
                  labelFormatter={(h) => x('{h} solar time', { h: formatHour(Number(h)) })}
                  formatter={(v) => `${Number(v).toFixed(1)} °C`}
                />
                <ReferenceLine x={hour} stroke="var(--ink)" strokeOpacity={0.6} />
                {TUBE_SERIES.map((s) => (
                  <Line
                    key={s.key}
                    name={x(s.label)}
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
          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-label text-[11px] text-ink-3">
            {TUBE_SERIES.map((s) => (
              <span key={s.key} className="flex items-center gap-1.5">
                <span className="h-px w-3" style={{ background: s.color }} />
                {x(s.label).toLocaleLowerCase(lang)}
              </span>
            ))}
          </p>
          <p className="mt-4 border-l border-accent pl-3 text-[13px] leading-relaxed text-ink-2">
            {x(
              'Lunar pits hold about 17 °C in shade while the surface runs from +127 °C to −173 °C (LRO Diviner). The calculation shows the same damping at the scale of an Earth tube.',
            )}
          </p>
        </>
      )}
    </Panel>
  )
}
