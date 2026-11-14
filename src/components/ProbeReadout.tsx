import { targetById } from '../data/targets'
import { EXTENT_KM, uvToIndex, uvToLonLat } from '../lib/dem'
import type { World } from '../lib/layers'
import { useStore } from '../store'

const W = 220
const H = 40
const N = 110

/** Values under the cursor, plus the west–east elevation transect through it. */
export function ProbeReadout({ world }: { world: World }) {
  const probe = useStore((s) => s.probe)
  const targetId = useStore((s) => s.target)
  const side = useStore((s) => s.side)

  if (!probe) {
    return (
      <p className="font-mono text-[11px] text-zinc-600">Move over the terrain to read it.</p>
    )
  }

  const twin = side === 'twin'
  const surface = twin ? world.twins[targetId] : world.earth
  const { dem } = surface
  const i = uvToIndex(probe.u, probe.v, dem.size)
  const range = dem.max - dem.min
  const path = Array.from({ length: N }, (_, k) => {
    const h = dem.heights[uvToIndex(k / (N - 1), probe.v, dem.size)]
    return `${((k / (N - 1)) * W).toFixed(1)},${(H - ((h - dem.min) / range) * H).toFixed(1)}`
  }).join(' ')
  const x = probe.u * W
  const y = H - ((dem.heights[i] - dem.min) / range) * H
  const { lon, lat } = uvToLonLat(probe.u, probe.v)
  const e = uvToIndex(probe.u, probe.v, world.earth.dem.size)
  const num = (v: number, d = 0) => <span className="text-white">{v.toFixed(d)}</span>

  return (
    <div className="font-mono text-[11px] text-zinc-500">
      <svg width={W} height={H + 2} className="mb-2 block overflow-visible">
        <polyline points={path} fill="none" stroke="#fff" strokeWidth={1} />
        <line x1={x} x2={x} y1={0} y2={H} stroke="#ff6a3d" strokeWidth={1} />
        <circle cx={x} cy={y} r={2.5} fill="#ff6a3d" />
      </svg>
      <p className="tabular-nums text-white">
        {twin
          ? `${targetById(targetId).name}, ${(probe.u * EXTENT_KM).toFixed(1)} km E ${(probe.v * EXTENT_KM).toFixed(1)} km S`
          : `${lat.toFixed(4)}°N ${lon.toFixed(4)}°E`}
      </p>
      <p className="mt-1 tabular-nums leading-relaxed">
        {num(dem.heights[i])} m · {num(surface.slope[i], 1)}° slope
        {!twin && (
          <>
            <br />
            {num(world.earth.thermal[e], 1)} °C · {num(world.earth.swing[e], 1)} K swing ·{' '}
            {num(world.earth.radar[e], 1)} dB
            <br />
            terrain match {num(world.earth.score[targetId][e])}%
          </>
        )}
      </p>
    </div>
  )
}
