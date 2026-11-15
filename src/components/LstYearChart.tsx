import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { AXIS_TICK, GRID_STROKE, TOOLTIP_STYLE } from '../lib/chartTheme'
import type { World } from '../lib/layers'
import { EmptyState } from './EmptyState'
import { Panel } from './Panel'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** A year of satellite surface temperature over the lava field: the benchmark
 *  any in-tube reading is compared against. */
export function LstYearChart({ world }: { world: World }) {
  const { lst_series: series, lst_annual: annual } = world.manifest
  const mean =
    annual.field_day != null && annual.field_night != null
      ? (annual.field_day + annual.field_night) / 2
      : null
  const data = series.map((r) => ({ ...r, label: MONTHS[Number(r.month.slice(5)) - 1] }))

  return (
    <Panel
      title="A year on the lava field, from orbit"
      hint="VIIRS monthly surface temperature over the young Ovabağ flows at 13:30 and 01:30, Nov 2025 to Oct 2026."
    >
      {series.length === 0 || mean == null ? (
        <EmptyState title="No temperature series" text="Run scripts/ingest.py to fetch it." />
      ) : (
        <>
          <p className="mb-5 text-[15px] leading-snug text-ink">
            The surface averages{' '}
            <span className="font-display text-[40px] leading-none text-accent">
              {mean.toFixed(0)} °C
            </span>{' '}
            over the year.
          </p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 6, right: 4, bottom: 0, left: -24 }}>
                <CartesianGrid stroke={GRID_STROKE} vertical={false} />
                <XAxis dataKey="label" tick={AXIS_TICK} tickLine={false} stroke={GRID_STROKE} interval={1} />
                <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} unit="°" />
                <Tooltip {...TOOLTIP_STYLE} formatter={(v) => `${Number(v).toFixed(1)} °C`} />
                <ReferenceLine y={mean} stroke="var(--accent)" strokeDasharray="2 4" />
                <ReferenceLine y={4.5} stroke="var(--ink)" strokeOpacity={0.5} strokeDasharray="2 4" />
                <Line name="Summit, day" dataKey="summit_day" stroke="var(--ink-4)" strokeWidth={1} dot={false} type="monotone" connectNulls />
                <Line name="Summit, night" dataKey="summit_night" stroke="var(--ink-4)" strokeWidth={1} dot={false} type="monotone" connectNulls />
                <Line name="Lava field, 13:30" dataKey="field_day" stroke="var(--accent)" strokeWidth={1.75} dot={false} type="monotone" connectNulls />
                <Line name="Lava field, 01:30" dataKey="field_night" stroke="var(--ink)" strokeWidth={1.75} dot={false} type="monotone" connectNulls />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-label text-[11px] text-ink-3">
            <span className="flex items-center gap-1.5">
              <span className="h-px w-3 bg-accent" /> field, day
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-px w-3 bg-ink" /> field, night
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-px w-3 bg-ink-4" /> summit
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 border-t border-dashed border-ink/60" /> reported in-tube
            </span>
          </p>
          <p className="mt-4 border-l border-accent pl-3 text-[13px] leading-relaxed text-ink-2">
            Local cavers report 4–5 °C inside an Ovabağ tube in summer (press report, not yet
            verified by us). Rock deep in a closed cave settles near the annual mean of the
            surface above it. A tube sitting some {(mean - 4.5).toFixed(0)} K below that mean
            would be storing winter air: a cold trap, the same mechanism that keeps ice in
            Martian tubes and volatiles at the lunar poles. That gap is what the field
            thermometers are there to confirm.
          </p>
        </>
      )}
    </Panel>
  )
}
