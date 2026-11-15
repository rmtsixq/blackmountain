import { MEASURED } from '../data/pit'
import { PIT_SCAN } from '../data/pitScan'
import { useT } from '../lib/i18n'
import { NightCurve } from './NightCurve'
import { Panel } from './Panel'

const PHOTOS = [
  { name: 'field', alt: 'The Ovabağ lava field' },
  { name: 'pit', alt: 'Looking down into the collapse pit' },
  { name: 'mouth', alt: 'The pit mouth under its overhang' },
  { name: 'crack', alt: 'A crack in the lava' },
  { name: 'cone', alt: 'A scoria cone on the field' },
  { name: 'rubble', alt: 'Basalt blocks on the flows' },
]

/** What the team measured on foot: the scanned pit, the thermometers, the photographs. */
export function FieldPanel() {
  const { x, num, pct } = useT()
  const tiles = [
    { label: x('opening'), value: `${num(PIT_SCAN.opening_long_m, 1)} × ${num(PIT_SCAN.opening_short_m, 1)} m` },
    { label: x('depth'), value: `${num(PIT_SCAN.depth_m, 1)} m` },
    { label: x('still under the roof'), value: pct(PIT_SCAN.roofed_fraction * 100) },
    { label: x('points in the scan'), value: num(PIT_SCAN.raw_points) },
    { label: x('in the pit, 16:00'), value: `${num(MEASURED.inside, 1)} °C` },
    { label: x('outside, 16:00'), value: `${num(MEASURED.outside, 1)} °C` },
  ]

  return (
    <>
      <Panel
        title={x('What we measured on foot')}
        hint={x(
          'Ovabağ lava field, 14–15 November 2026: a collapse pit scanned in three dimensions, with thermometers inside and outside it.',
        )}
      >
        <dl className="grid grid-cols-2 gap-2">
          {tiles.map((tile) => (
            <div key={tile.label} className="rounded-2xl bg-paper-2 px-3.5 py-3">
              <dt className="text-[12px] text-ink-3">{tile.label}</dt>
              <dd className="mt-1 flex items-center gap-2 text-[19px] font-semibold tracking-[-0.015em] text-ink">
                <span className="size-2 shrink-0 rounded-full border border-ink bg-field" />
                {tile.value}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-[13px] leading-relaxed text-ink-3">
          {x('Humidity in the pit was {h}. Dimensions are read from the scan, at the scale the scanning app exported.', {
            h: pct(MEASURED.humidity),
          })}
        </p>
        <ul className="mt-5 grid grid-cols-3 gap-2">
          {PHOTOS.map((p) => (
            <li key={p.name}>
              <img
                src={`/field/${p.name}.webp`}
                alt={x(p.alt)}
                loading="lazy"
                className="aspect-square w-full rounded-xl bg-paper-2 object-cover"
              />
            </li>
          ))}
        </ul>
      </Panel>

      <Panel
        title={x('The night at the pit')}
        hint={x('The thermometers stayed in place from 16:00 on 14 November until 06:00 the next morning.')}
      >
        <NightCurve />
      </Panel>
    </>
  )
}
