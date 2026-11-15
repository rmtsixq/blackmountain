import { CATALOG, OUR_PIT } from '../data/pit'
import { useT } from '../lib/i18n'

const W = 340
const H = 190
const X: [number, number] = [5, 400]
const Y: [number, number] = [2, 200]

const log = (v: number, [lo, hi]: [number, number]) => (Math.log(v) - Math.log(lo)) / (Math.log(hi) - Math.log(lo))
const x = (width: number) => log(width, X) * W
const y = (depth: number) => H - log(depth, Y) * H

const tick = 'fill-ink-4 text-[11px]'

// which side of its point each name sits on, so the cluster stays legible
const LABEL: Record<string, { dx: number; dy: number; end?: boolean }> = {
  'Mare Tranquillitatis': { dx: -8, dy: -5, end: true },
  'Mare Ingenii': { dx: -8, dy: 13, end: true },
  'Marius Hills': { dx: -8, dy: 4, end: true },
  Annie: { dx: 9, dy: -3 },
  Dena: { dx: 9, dy: 10 },
}

/** Width against depth, log scales: our pit among the Moon's and Mars's. */
export function PitCatalogue() {
  const { t, num } = useT()
  // the dashed line where depth is half the width, and the angle it runs at
  const angle = (Math.atan2(y(100) - y(10), x(200) - x(20)) * 180) / Math.PI

  return (
    <figure>
      <svg viewBox={`-30 -14 ${W + 62} ${H + 46}`} className="w-full max-w-[460px] overflow-visible">
        {[10, 100].map((d) => (
          <g key={d}>
            <line x1={0} x2={W} y1={y(d)} y2={y(d)} stroke="var(--rule)" />
            <text x={-8} y={y(d) + 4} textAnchor="end" className={tick}>
              {d}
            </text>
          </g>
        ))}
        <line x1={0} x2={W} y1={H} y2={H} stroke="var(--ink-5)" />
        {[10, 100].map((w) => (
          <g key={w}>
            <line x1={x(w)} x2={x(w)} y1={0} y2={H} stroke="var(--rule)" />
            <text x={x(w)} y={H + 16} textAnchor="middle" className={tick}>
              {w}
            </text>
          </g>
        ))}
        <text x={W} y={H + 30} textAnchor="end" className={tick}>
          {t.catWidth}
        </text>
        <text x={-24} y={-4} className={tick}>
          {t.catDepth}
        </text>

        <line x1={x(X[0])} y1={y(X[0] / 2)} x2={x(X[1])} y2={y(X[1] / 2)} stroke="var(--ink-5)" strokeDasharray="2 4" />
        <text transform={`translate(${x(24)},${y(12) + 15}) rotate(${angle.toFixed(1)})`} className={tick}>
          {t.catRatio}
        </text>

        {CATALOG.map((p) => {
          const colour = p.body === 'mars' ? 'var(--accent)' : 'var(--ink-3)'
          const label = LABEL[p.name] ?? { dx: 9, dy: 4 }
          const cx = x(p.width)
          const cy = y(p.depth)
          return (
            <g key={p.name}>
              {p.atLeast && (
                <path d={`M${cx},${cy - 5} V${cy - 19} m-3.5,5 l3.5,-5 l3.5,5`} fill="none" stroke={colour} strokeWidth={1.25} />
              )}
              <circle cx={cx} cy={cy} r={4} fill={colour} />
              <text
                x={cx + label.dx}
                y={cy + label.dy}
                textAnchor={label.end ? 'end' : 'start'}
                className={`text-[11px] ${p.body === 'mars' ? 'fill-accent' : 'fill-ink-3'}`}
              >
                {p.name}
              </text>
            </g>
          )
        })}

        <circle cx={x(OUR_PIT.width)} cy={y(OUR_PIT.depth)} r={5.5} fill="var(--field)" stroke="var(--ink)" strokeWidth={1.25} />
        <text x={x(OUR_PIT.width) + 12} y={y(OUR_PIT.depth) + 4} className="fill-ink text-[12px] font-semibold">
          {t.catOurs(num(OUR_PIT.width, 1), num(OUR_PIT.depth, 1))}
        </text>
      </svg>
      <figcaption className="mt-3 max-w-[60ch] text-[13px] leading-snug text-ink-4">{t.catCaption}</figcaption>
    </figure>
  )
}
