import { DAY_CURVE, LUNAR_PIT, MEASURED, type DayPoint } from '../data/pit'
import { useT } from '../lib/i18n'

const W = 340
const H = 150
const LO = 0
const HI = 22

const x = (hour: number) => (hour / 24) * W
const y = (t: number) => H - ((t - LO) / (HI - LO)) * H
const path = (key: keyof Omit<DayPoint, 'hour'>) =>
  DAY_CURVE.map((p, i) => `${i ? 'L' : 'M'}${x(p.hour).toFixed(1)},${y(p[key]).toFixed(1)}`).join(' ')

const tick = 'fill-ink-4 text-[11px]'
const last = DAY_CURVE[DAY_CURVE.length - 1]

/** A day at the pit: the real reading on top of the curve we expect. */
export function DayCurve() {
  const { t, num, lang } = useT()
  const date = lang === 'tr' ? '14 Kasım 2026' : MEASURED.date

  return (
    <figure>
      <svg viewBox={`-26 -8 ${W + 110} ${H + 54}`} className="w-full max-w-[470px] overflow-visible">
        {[0, 10, 20].map((v) => (
          <g key={v}>
            <line x1={0} x2={W} y1={y(v)} y2={y(v)} stroke="var(--rule)" />
            <text x={-8} y={y(v) + 4} textAnchor="end" className={tick}>
              {v}°
            </text>
          </g>
        ))}
        {[0, 6, 12, 18, 24].map((h) => (
          <text key={h} x={x(h)} y={H + 16} textAnchor={h === 0 ? 'start' : h === 24 ? 'end' : 'middle'} className={tick}>
            {String(h).padStart(2, '0')}
          </text>
        ))}

        {/* when the thermometers were in place: 15:00 to 06:00, across midnight */}
        {[
          [0, MEASURED.loggedUntil],
          [MEASURED.hour, 24],
        ].map(([from, to]) => (
          <line key={from} x1={x(from)} x2={x(to)} y1={H + 28} y2={H + 28} stroke="var(--ink)" strokeWidth={2} strokeLinecap="round" />
        ))}
        <text x={0} y={H + 44} className={tick}>
          {t.dayLogged}
        </text>

        {/* illustrative curves are dashed */}
        <path d={path('surface')} fill="none" stroke="var(--ink-4)" strokeWidth={1.25} strokeDasharray="1 4" strokeLinecap="round" />
        <path d={path('air')} fill="none" stroke="var(--ink-4)" strokeWidth={1.25} strokeDasharray="5 4" />
        <path d={path('pit')} fill="none" stroke="var(--ink)" strokeWidth={1.5} strokeDasharray="5 4" />
        <text x={W + 8} y={y(last.surface) + 14} className={tick}>
          {t.dayRock}
        </text>
        <text x={W + 8} y={y(last.air) + 2} className={tick}>
          {t.dayAir}
        </text>
        <text x={W + 8} y={y(last.pit) + 4} className="fill-ink text-[11px]">
          {t.dayPit}
        </text>

        {/* the real reading */}
        {[MEASURED.inside, MEASURED.outside].map((v) => (
          <circle key={v} cx={x(MEASURED.hour)} cy={y(v)} r={5} fill="var(--field)" stroke="var(--ink)" strokeWidth={1.25} />
        ))}
        <text x={x(MEASURED.hour) - 10} y={y(MEASURED.inside) - 9} textAnchor="end" className="fill-ink text-[12px] font-semibold">
          {t.dayIn(num(MEASURED.inside, 1))}
        </text>
        <text x={x(MEASURED.hour) - 10} y={y(MEASURED.outside) + 17} textAnchor="end" className="fill-ink text-[12px] font-semibold">
          {t.dayOut(num(MEASURED.outside, 1))}
        </text>
      </svg>
      <figcaption className="mt-3 max-w-[60ch] text-[13px] leading-snug text-ink-4">
        {t.dayCaption(date, LUNAR_PIT.surfaceSwingK, LUNAR_PIT.shadowedFloorC)}
      </figcaption>
    </figure>
  )
}
