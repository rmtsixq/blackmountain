import { useRef, useState } from 'react'
import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import type * as THREE from 'three'
import { STATIONS, type Station } from '../data/field'
import { targetById } from '../data/targets'
import { anim } from '../lib/anim'
import { heightToY, lonLatToUV, sampleHeight, WORLD, type Dem } from '../lib/dem'
import type { World } from '../lib/layers'
import { useStore } from '../store'

/** A thin pole standing on the terrain; follows the animated relief. */
function Pole({
  dem,
  u,
  v,
  height,
  color,
  label,
  showLabel,
  onSelect,
  lower = 0,
}: {
  dem: Dem
  u: number
  v: number
  height: number
  color: string
  label: string
  showLabel: boolean
  onSelect?: () => void
  /** scene units the whole terrain has been lowered by (twin recentring) */
  lower?: number
}) {
  const group = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const base = heightToY(sampleHeight(dem, u, v), dem) - lower
  useFrame(() => {
    if (group.current) group.current.position.y = base * anim.exag
  })

  return (
    <group ref={group} position={[(u - 0.5) * WORLD, 0, (v - 0.5) * WORLD]}>
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[0.03, 0.03, height, 4]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      {onSelect && (
        <mesh
          position={[0, height / 2, 0]}
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
          onPointerOver={(e) => {
            e.stopPropagation()
            setHovered(true)
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            setHovered(false)
            document.body.style.cursor = ''
          }}
        >
          <cylinderGeometry args={[0.5, 0.5, height + 0.6, 6]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      )}
      {(showLabel || hovered) && (
        <Html
          position={[0, height, 0]}
          zIndexRange={[20, 0]}
          style={{ pointerEvents: 'none', transform: 'translate(6px, -50%)' }}
        >
          <span className="whitespace-nowrap font-mono text-[10px]" style={{ color }}>
            {label}
          </span>
        </Html>
      )}
    </group>
  )
}

function StationPole({ station, dem }: { station: Station; dem: Dem }) {
  const selected = useStore((s) => s.stationId === station.id)
  const select = useStore((s) => s.selectStation)
  const tube = station.kind === 'tube'
  const { u, v } = lonLatToUV(station.lon, station.lat)
  return (
    <Pole
      dem={dem}
      u={u}
      v={v}
      height={selected ? 5.5 : tube ? 4 : 2.2}
      color={selected || tube ? '#ff6a3d' : '#ffffff'}
      label={station.code}
      showLabel={selected || tube}
      onSelect={() => select(selected ? null : station.id)}
    />
  )
}

function meanY(dem: Dem) {
  let s = 0
  for (let i = 0; i < dem.heights.length; i += 7) s += dem.heights[i]
  return heightToY(s / Math.ceil(dem.heights.length / 7), dem)
}

/** Field stations on Karacadağ; place names and the best match on the twins. */
export function StationMarkers({ world }: { world: World }) {
  const side = useStore((s) => s.side)
  const twin = useStore((s) => s.twin)
  const layer = useStore((s) => s.layer)
  const stations = useStore((s) => s.stations)
  const target = targetById(useStore((s) => s.target))
  const settled = (side === 'twin') === twin
  if (!settled) return null

  if (side === 'twin') {
    const lower = meanY(world.twins[target.id].dem) - meanY(world.earth.dem)
    return (
      <group>
        {target.labels.map((l) => (
          <Pole
            key={l.text}
            dem={world.twins[target.id].dem}
            u={l.u}
            v={l.v}
            height={5}
            color="#ffffff"
            label={l.text}
            showLabel
            lower={lower}
          />
        ))}
      </group>
    )
  }

  const best = world.analysis.best[target.id]
  return (
    <group>
      {stations && STATIONS.map((s) => <StationPole key={s.id} station={s} dem={world.earth.dem} />)}
      {layer === 'score' && (
        <Pole
          dem={world.earth.dem}
          u={best.u}
          v={best.v}
          height={7}
          color="#ffffff"
          label={`closest terrain to ${target.name} · ${best.score.toFixed(0)}%`}
          showLabel
        />
      )}
    </group>
  )
}
