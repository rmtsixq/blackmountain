import { uvToIndex, uvToLonLat, type Dem } from '../lib/dem'
import type { Fields } from '../lib/layers'
import { useStore } from '../store'

interface Props {
  dem: Dem
  fields: Fields
}

const W = 220
const H = 40
const N = 110

/** Values under the cursor, plus the west–east elevation transect through it. */
export function ProbeReadout({ dem, fields }: Props) {
  const probe = useStore((s) => s.probe)
  const target = useStore((s) => s.target)

  if (!probe) {
    return (
      <p className="font-mono text-[11px] text-zinc-600">
        Move over the terrain to read it.
      </p>
    )
  }

  const i = uvToIndex(probe.u, probe.v, dem.size)
  const { lon, lat } = uvToLonLat(probe.u, probe.v)
  const range = dem.max - dem.min
  const path = Array.from({ length: N }, (_, k) => {
    const h = dem.heights[uvToIndex(k / (N - 1), probe.v, dem.size)]
    return `${((k / (N - 1)) * W).toFixed(1)},${(H - ((h - dem.min) / range) * H).toFixed(1)}`
  }).join(' ')
  const x = probe.u * W
  const y = H - ((dem.heights[i] - dem.min) / range) * H

  return (
    <div className="font-mono text-[11px] text-zinc-500">
      <svg width={W} height={H + 2} className="mb-2 block overflow-visible">
        <polyline points={path} fill="none" stroke="#fff" strokeWidth={1} />
        <line x1={x} x2={x} y1={0} y2={H} stroke="#ff6a3d" strokeWidth={1} />
        <circle cx={x} cy={y} r={2.5} fill="#ff6a3d" />
      </svg>
      <p className="tabular-nums text-white">
        {lat.toFixed(4)}°N {lon.toFixed(4)}°E
      </p>
      <p className="mt-1 tabular-nums leading-relaxed">
        <span className="text-white">{dem.heights[i].toFixed(0)}</span> m ·{' '}
        <span className="text-white">{fields.slope[i].toFixed(1)}</span>° slope
        <br />
        <span className="text-white">{fields.thermal[i].toFixed(1)}</span> °C ·{' '}
        <span className="text-white">{fields.roughness[i].toFixed(1)}</span> dB · score{' '}
        <span className="text-white">{fields.score[target][i].toFixed(0)}</span>
      </p>
    </div>
  )
}
