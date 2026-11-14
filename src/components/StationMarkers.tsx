import { useState } from 'react'
import { Html } from '@react-three/drei'
import { STATIONS, type Station } from '../data/field'
import { heightToY, lonLatToUV, sampleHeight, WORLD, type Dem } from '../lib/dem'
import { useStore } from '../store'

function Marker({ station, dem }: { station: Station; dem: Dem }) {
  const exag = useStore((s) => s.exag)
  const selected = useStore((s) => s.stationId === station.id)
  const select = useStore((s) => s.selectStation)
  const [hovered, setHovered] = useState(false)
  const tube = station.kind === 'tube'
  const { u, v } = lonLatToUV(station.lon, station.lat)
  const y = heightToY(sampleHeight(dem, u, v), dem) * exag
  const pole = selected ? 5.5 : tube ? 4 : 2.2
  const color = selected || tube ? '#ff6a3d' : '#ffffff'

  return (
    <group position={[(u - 0.5) * WORLD, y, (v - 0.5) * WORLD]}>
      <mesh position={[0, pole / 2, 0]}>
        <cylinderGeometry args={[0.03, 0.03, pole, 4]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      {/* generous invisible hit target */}
      <mesh
        position={[0, pole / 2, 0]}
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
        <cylinderGeometry args={[0.5, 0.5, pole + 0.6, 6]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      {(selected || hovered || tube) && (
        <Html
          position={[0, pole, 0]}
          zIndexRange={[20, 0]}
          style={{ pointerEvents: 'none', transform: 'translate(6px, -50%)' }}
        >
          <span
            className={`whitespace-nowrap font-mono text-[10px] ${
              selected || tube ? 'text-ember' : 'text-white'
            }`}
          >
            {station.code}
          </span>
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
