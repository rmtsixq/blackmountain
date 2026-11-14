import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { LIGHT_TEST } from '../data/field'
import { AXIS_TICK, GRID_STROKE, TOOLTIP_STYLE } from '../lib/chartTheme'
import { Panel } from './Panel'

export function LightTestChart() {
  return (
    <Panel
      title="Seeing rocks in polar light"
      hint="The same quadrats photographed as the sun drops. At the lunar south pole it never climbs above about 1.5°."
      demo
    >
      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={LIGHT_TEST} margin={{ top: 6, right: 4, bottom: 0, left: -20 }}>
            <CartesianGrid stroke={GRID_STROKE} vertical={false} />
            <XAxis
              dataKey="elevation"
              tickFormatter={(e: number) => `${e}°`}
              tick={AXIS_TICK}
              tickLine={false}
              stroke={GRID_STROKE}
            />
            <YAxis domain={[0, 100]} tick={AXIS_TICK} tickLine={false} axisLine={false} unit="%" />
            <Tooltip
              {...TOOLTIP_STYLE}
              cursor={{ fill: 'rgba(255,255,255,0.04)' }}
              labelFormatter={(e) => `Sun ${e}° above horizon`}
              formatter={(v) => `${v} %`}
            />
            <Bar name="Rocks detected" dataKey="recall" fill="#e4e4e7" barSize={3} />
            <Line
              name="Ground in shadow"
              dataKey="shadow"
              stroke="#ff6a3d"
              strokeWidth={1.5}
              dot={{ r: 2, fill: '#ff6a3d', strokeWidth: 0 }}
              type="monotone"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-zinc-500">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-px bg-white" /> rocks detected
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-px w-3 bg-ember" /> ground in shadow
        </span>
      </p>
    </Panel>
  )
}
