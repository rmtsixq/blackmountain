import { LOG, LUNAR_PIT, MEASURED, NIGHT_DROP, NIGHT_HOURS, PIT_MODEL, outsideAt, pitModel } from '../data/pit'
import { useT } from '../lib/i18n'

const W = 340
const H = 150
const LO = 4
const HI = 14
const [FROM, TO] = NIGHT_HOURS

const x = (hour: number) => ((hour - FROM) / (TO - FROM)) * W
const y = (t: number) => H - ((t - LO) / (HI - LO)) * H

const STEPS = Array.from({ length: (TO - FROM) * 2 + 1 }, (_, i) => FROM + i / 2)
const path = (f: (hour: number) => number) =>
  STEPS.map((h, i) => `${i ? 'L' : 'M'}${x(h).toFixed(1)},${y(f(h)).toFixed(1)}`).join(' ')

const tick = 'fill-ink-4 text-[11px]'
const clock = (hour: number) => String(hour % 24).padStart(2, '0')

/** The night at the pit: our readings, the air outside, and the pit model. */
export function NightCurve() {
  const { t, num, pct } = useT()
  const first = LOG[0]

  return (
    <figure>
      <svg viewBox={`-34 -8 ${W + 134} ${H + 48}`} className="w-full max-w-[480px] overflow-visible">
        {/* the hours the thermometers were in place */}
        <rect x={x(MEASURED.hour)} y={0} width={x(MEASURED.loggedUntil) - x(MEASURED.hour)} height={H} fill="color-mix(in srgb, var(--ink) 5%, transparent)" />
        <text x={x(MEASURED.hour) + 8} y={H - 8} className={tick}>
          {t.nightWindow}
        </text>

        {[5, 10].map((v) => (
          <g key={v}>
            <line x1={0} x2={W} y1={y(v)} y2={y(v)} stroke="var(--rule)" />
            <text x={-8} y={y(v) + 4} textAnchor="end" className={tick}>
              {v}°
            </text>
          </g>
        ))}
        <line x1={0} x2={W} y1={H} y2={H} stroke="var(--ink-5)" />
        {[12, 16, 20, 24, 28, 32].map((h) => (
          <text key={h} x={x(h)} y={H + 16} textAnchor="middle" className={tick}>
            {clock(h)}
          </text>
        ))}
        <line x1={x(24)} x2={x(24)} y1={H} y2={H + 34} stroke="var(--ink-5)" />
        <text x={0} y={H + 34} className={tick}>
          {t.nightDays[0]}
        </text>
        <text x={x(24) + 6} y={H + 34} className={tick}>
          {t.nightDays[1]}
        </text>

        <path d={path(outsideAt)} fill="none" stroke="var(--ink-4)" strokeWidth={1.75} strokeLinejoin="round" />
        <path d={path(pitModel)} fill="none" stroke="var(--ink)" strokeWidth={1.5} strokeDasharray="5 4" />
        <text x={W + 8} y={y(outsideAt(TO)) + 4} className={tick}>
          {t.nightOutside}
        </text>
        <text x={W + 8} y={y(pitModel(TO)) + 4} className="fill-ink text-[11px]">
          {t.nightPit}
        </text>

        {/* our readings */}
        {LOG.map((r) => (
          <g key={r.hour}>
            <circle cx={x(r.hour)} cy={y(r.inside)} r={5} fill="var(--field)" stroke="var(--ink)" strokeWidth={1.25} />
            <circle cx={x(r.hour)} cy={y(r.outside)} r={5} fill="var(--field)" stroke="var(--ink)" strokeWidth={1.25} />
          </g>
        ))}
        <text x={x(first.hour) + 10} y={y(first.inside) - 9} className="fill-ink text-[12px] font-semibold">
          {t.nightIn(num(first.inside, 1))}
        </text>
        <text x={x(first.hour) + 10} y={y(first.outside) - 9} className="fill-ink text-[12px] font-semibold">
          {t.nightOut(num(first.outside, 1))}
        </text>
      </svg>
      <figcaption className="mt-3 max-w-[60ch] text-[13px] leading-snug text-ink-4">
        {t.nightCaption(
          num(NIGHT_DROP, 1),
          pct(PIT_MODEL.damping * 100),
          PIT_MODEL.lagHours,
          LUNAR_PIT.surfaceSwingK,
          LUNAR_PIT.shadowedFloorC,
        )}
      </figcaption>
    </figure>
  )
}
