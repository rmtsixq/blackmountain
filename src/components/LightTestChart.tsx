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
      title="Polar-light test"
      hint="Rock-detection recall on the same quadrats as the sun drops. The lunar south pole never sees the sun above ~1.5°."
      demo
    >
      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={LIGHT_TEST} margin={{ top: 6, right: 8, bottom: 0, left: -18 }}>
            <CartesianGrid stroke={GRID_STROKE} vertical={false} />
            <XAxis
              dataKey="elevation"
              tickFormatter={(e: number) => `${e}°`}
              tick={AXIS_TICK}
              stroke={GRID_STROKE}
            />
            <YAxis domain={[0, 100]} tick={AXIS_TICK} stroke={GRID_STROKE} unit="%" />
            <Tooltip
              {...TOOLTIP_STYLE}
              cursor={{ fill: 'rgba(255,255,255,0.04)' }}
              labelFormatter={(e) => `Sun elevation ${e}°`}
              formatter={(v) => `${v} %`}
            />
            <Bar name="Detection recall" dataKey="recall" fill="#a78bfa" radius={[4, 4, 0, 0]} barSize={26} />
            <Line
              name="Area in shadow"
              dataKey="shadow"
              stroke="#ff6a3d"
              strokeWidth={1.75}
              dot={{ r: 2.5, fill: '#ff6a3d', strokeWidth: 0 }}
              type="monotone"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-zinc-400">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-sm bg-violet-400" /> Detection recall
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-3 rounded-full bg-ember" /> Area in shadow
        </span>
      </div>
    </Panel>
  )
}
