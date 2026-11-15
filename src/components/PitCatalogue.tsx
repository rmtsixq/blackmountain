import { CATALOG, OUR_PIT } from '../data/pit'
import { useT } from '../lib/i18n'

const W = 340
const H = 190
const X: [number, number] = [3, 600]
const Y: [number, number] = [1, 500]

const log = (v: number, [lo, hi]: [number, number]) => (Math.log(v) - Math.log(lo)) / (Math.log(hi) - Math.log(lo))
const x = (width: number) => log(width, X) * W
const y = (depth: number) => H - log(depth, Y) * H

const tick = 'fill-ink-4 text-[11px]'

/** Width against depth, log scales: our pit among the Moon's and Mars's. */
export function PitCatalogue() {
  const { t, num } = useT()
  return (
    <figure>
      <svg viewBox={`-30 -12 ${W + 46} ${H + 44}`} className="w-full max-w-[450px] overflow-visible">
        {[1, 10, 100].map((d) => (
          <g key={d}>
            <line x1={0} x2={W} y1={y(d)} y2={y(d)} stroke="var(--rule)" />
            <text x={-8} y={y(d) + 4} textAnchor="end" className={tick}>
              {d}
            </text>
          </g>
        ))}
        {[10, 100].map((w) => (
          <text key={w} x={x(w)} y={H + 16} textAnchor="middle" className={tick}>
            {w} m
          </text>
        ))}
        <text x={W} y={H + 30} textAnchor="end" className={tick}>
          {t.catWidth}
        </text>
        <text x={-24} y={-3} className={tick}>
          {t.catDepth}
        </text>

        {/* equal proportions: depth is half the width */}
        <line x1={x(3)} y1={y(1.5)} x2={x(600)} y2={y(300)} stroke="var(--ink-5)" strokeDasharray="2 4" />

        {/* illustrative points are hollow */}
        {CATALOG.map((p, i) => (
          <circle
            key={i}
            cx={x(p.width)}
            cy={y(p.depth)}
            r={p.name ? 3 : 2.3}
            fill="none"
            stroke={p.body === 'mars' ? 'var(--accent)' : 'var(--ink-4)'}
            strokeWidth={p.name ? 1.6 : 0.9}
          />
        ))}
        {CATALOG.filter((p) => p.name).map((p) => (
          <text
            key={p.name}
            x={x(p.width) - 8}
            y={y(p.depth) - 6}
            textAnchor="end"
            className={`text-[11px] ${p.body === 'mars' ? 'fill-accent' : 'fill-ink-3'}`}
          >
            {p.name} †
          </text>
        ))}

        <circle cx={x(OUR_PIT.width)} cy={y(OUR_PIT.depth)} r={5.5} fill="var(--field)" stroke="var(--ink)" strokeWidth={1.25} />
        <text x={x(OUR_PIT.width) + 12} y={y(OUR_PIT.depth) + 4} className="fill-ink text-[12px] font-semibold">
          {t.catOurs(num(OUR_PIT.width, 1), num(OUR_PIT.depth, 1))}
        </text>
      </svg>
      <figcaption className="mt-3 max-w-[60ch] text-[13px] leading-snug text-ink-4">{t.catCaption}</figcaption>
    </figure>
  )
}
