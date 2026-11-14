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
import { Panel } from './Panel'

const MODELS = [
  { key: 'k5', label: '5%' },
  { key: 'k10', label: '10%' },
  { key: 'k20', label: '20%' },
  { key: 'k30', label: '30%' },
]

export function RockAbundanceChart() {
  return (
    <Panel
      title="Rock abundance vs. landing-site model"
      hint="Cumulative area covered by rocks larger than D, against Golombek–Rapp curves used for Mars landing-site certification."
      demo
    >
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={ROCK_CURVE} margin={{ top: 6, right: 8, bottom: 0, left: -18 }}>
            <CartesianGrid stroke={GRID_STROKE} vertical={false} />
            <XAxis
              dataKey="d"
              type="number"
              scale="log"
              domain={[0.05, 1.4]}
              ticks={[0.05, 0.1, 0.2, 0.5, 1]}
              tickFormatter={(d: number) => `${d} m`}
              tick={AXIS_TICK}
              stroke={GRID_STROKE}
            />
            <YAxis tick={AXIS_TICK} stroke={GRID_STROKE} unit="%" />
            <Tooltip
              {...TOOLTIP_STYLE}
              labelFormatter={(d) => `D ≥ ${d} m`}
              formatter={(v) => `${Number(v).toFixed(1)} %`}
            />
            {MODELS.map((m) => (
              <Line
                key={m.key}
                name={`Model k=${m.label}`}
                dataKey={m.key}
                stroke="#52525b"
                strokeWidth={1}
                strokeDasharray="4 3"
                dot={false}
                type="monotone"
                isAnimationActive={false}
              />
            ))}
            <Scatter name="QD-01 fresh flow" dataKey="fresh" fill="#ff6a3d" />
            <Scatter name="QD-05 weathered flow" dataKey="weathered" fill="#7dd3fc" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-zinc-400">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-ember" /> Fresh ʻaʻā (QD-01)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-sky-300" /> Weathered flow (QD-05)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 border-t border-dashed border-zinc-500" /> Model, k = 5–30%
        </span>
      </div>
    </Panel>
  )
}
