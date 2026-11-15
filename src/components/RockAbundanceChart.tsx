import {
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ROCK_CURVE } from '../data/field'
import { AXIS_TICK, GRID_STROKE, TOOLTIP_STYLE } from '../lib/chartTheme'
import { useT } from '../lib/i18n'
import { Panel } from './Panel'

const MODELS = ['k5', 'k10', 'k20', 'k30']

export function RockAbundanceChart() {
  const { x } = useT()
  return (
    <Panel
      title={x('Rocks, against the Mars landing model')}
      hint={x(
        'Share of ground covered by rocks larger than D. Dashed curves are the Golombek–Rapp model at 5, 10, 20 and 30% total abundance.',
      )}
      demo
    >
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={ROCK_CURVE} margin={{ top: 6, right: 4, bottom: 0, left: -20 }}>
            <CartesianGrid stroke={GRID_STROKE} vertical={false} />
            <XAxis
              dataKey="d"
              type="number"
              scale="log"
              domain={[0.05, 1.4]}
              ticks={[0.05, 0.1, 0.2, 0.5, 1]}
              tickFormatter={(d: number) => `${d} m`}
              tick={AXIS_TICK}
              tickLine={false}
              stroke={GRID_STROKE}
            />
            <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} unit="%" />
            <Tooltip
              {...TOOLTIP_STYLE}
              labelFormatter={(d) => `D ≥ ${d} m`}
              formatter={(v) => `${Number(v).toFixed(1)} %`}
            />
            {MODELS.map((key) => (
              <Line
                key={key}
                name={x('model {p}%', { p: key.slice(1) })}
                dataKey={key}
                stroke="var(--ink-4)"
                strokeWidth={1}
                strokeDasharray="2 4"
                dot={false}
                type="monotone"
                isAnimationActive={false}
              />
            ))}
            <Scatter name={x('QD-01 fresh flow')} dataKey="fresh" fill="var(--accent)" />
            <Scatter name={x('QD-05 weathered flow')} dataKey="weathered" fill="var(--ink)" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-label text-[11px] text-ink-3">
        <span className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-accent" /> {x('fresh ʻaʻā, QD-01')}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-ink" /> {x('weathered flow, QD-05')}
        </span>
      </p>
    </Panel>
  )
}
