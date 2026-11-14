import { useRef, useState } from 'react'
import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { KIND_META, STATIONS, type Station } from '../data/field'
import { heightToY, lonLatToUV, sampleHeight, WORLD, type Dem } from '../lib/dem'
import { useStore } from '../store'

const POLE = 3

function Pulse({ color }: { color: string }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    const mesh = ref.current
    if (!mesh) return
    const t = (clock.elapsedTime * 0.7) % 1
    mesh.scale.setScalar(0.6 + t * 2.6)
    ;(mesh.material as THREE.MeshBasicMaterial).opacity = 0.75 * (1 - t)
  })
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.12, 0]}>
      <ringGeometry args={[0.8, 1, 48]} />
      <meshBasicMaterial color={color} transparent depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  )
}

function Marker({ station, dem }: { station: Station; dem: Dem }) {
  const exag = useStore((s) => s.exag)
  const selected = useStore((s) => s.stationId === station.id)
  const select = useStore((s) => s.selectStation)
  const [hovered, setHovered] = useState(false)
  const { color } = KIND_META[station.kind]
  const { u, v } = lonLatToUV(station.lon, station.lat)
  const y = heightToY(sampleHeight(dem, u, v), dem) * exag
  const showLabel = selected || hovered || station.kind === 'tube'

  return (
    <group position={[(u - 0.5) * WORLD, y, (v - 0.5) * WORLD]}>
      <mesh position={[0, POLE / 2, 0]}>
        <cylinderGeometry args={[0.035, 0.035, POLE, 6]} />
        <meshBasicMaterial color={color} transparent opacity={0.75} />
      </mesh>
      <mesh
        position={[0, POLE, 0]}
        onClick={(e) => {
          e.stopPropagation()
          select(selected ? null : station.id)
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
        <sphereGeometry args={[selected ? 0.6 : hovered ? 0.5 : 0.4, 20, 20]} />
        <meshBasicMaterial color={selected ? '#ffffff' : color} />
      </mesh>
      {selected && <Pulse color={color} />}
      {showLabel && (
        <Html position={[0, POLE + 1.1, 0]} center zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
          <div
            className={`whitespace-nowrap rounded-md border px-1.5 py-0.5 font-mono text-[10px] tracking-wider backdrop-blur ${
              selected
                ? 'border-white/40 bg-white text-black'
                : 'border-white/15 bg-black/70 text-zinc-200'
            }`}
          >
            {station.code}
          </div>
        </Html>
      )}
    </group>
  )
}

export function StationMarkers({ dem }: { dem: Dem }) {
  return (
    <group>
      {STATIONS.map((s) => (
        <Marker key={s.id} station={s} dem={dem} />
      ))}
    </group>
  )
}
