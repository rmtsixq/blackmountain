import { useRef } from 'react'
import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { targetById } from '../data/targets'
import { anim } from '../lib/anim'
import { heightToY, sampleHeight, WORLD, type Dem } from '../lib/dem'
import type { World } from '../lib/layers'
import { useStore } from '../store'
import { useT } from '../lib/i18n'

const pill = 'whitespace-nowrap text-[12px] font-medium leading-none text-white [text-shadow:0_0_3px_#000,0_0_8px_#000]'

/** A thin pole with a name on top; follows the animated relief. */
function Pole({ dem, u, v, label, lower = 0 }: { dem: Dem; u: number; v: number; label: string; lower?: number }) {
  const group = useRef<THREE.Group>(null)
  const base = heightToY(sampleHeight(dem, u, v), dem) - lower
  useFrame(() => {
    if (group.current) group.current.position.y = base * anim.exag
  })
  return (
    <group ref={group} position={[(u - 0.5) * WORLD, 0, (v - 0.5) * WORLD]}>
      <mesh position={[0, 3, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 6, 4]} />
        <meshBasicMaterial color="#f5f5f7" toneMapped={false} />
      </mesh>
      <Html position={[0, 6, 0]} zIndexRange={[20, 0]} style={{ pointerEvents: 'none', transform: 'translate(-50%, -100%)' }}>
        <span className={pill}>{label}</span>
      </Html>
    </group>
  )
}

// The patch is 3 km across on a 62 km square; the ring is drawn wider so it
// sits on the darker ground around the patch and reads from any distance.
const RING = 4.4
const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** The patch that matches the target best: a ring on the ground, and its score. */
function Patch({ dem, u, v, label }: { dem: Dem; u: number; v: number; label: string }) {
  const group = useRef<THREE.Group>(null)
  const pulse = useRef<THREE.Mesh>(null)
  const base = heightToY(sampleHeight(dem, u, v), dem)
  useFrame(({ clock }) => {
    if (group.current) group.current.position.y = base * anim.exag + 0.8
    if (pulse.current && !still) {
      const k = (clock.elapsedTime % 2.6) / 2.6
      pulse.current.scale.setScalar(1 + k * 1.2)
      ;(pulse.current.material as THREE.MeshBasicMaterial).opacity = 0.6 * (1 - k)
    }
  })
  const flat = { depthTest: false, transparent: true, toneMapped: false, side: THREE.DoubleSide }
  return (
    <group ref={group} position={[(u - 0.5) * WORLD, 0, (v - 0.5) * WORLD]}>
      <mesh rotation-x={-Math.PI / 2} renderOrder={10}>
        <ringGeometry args={[RING - 0.95, RING + 0.3, 96]} />
        <meshBasicMaterial color="#000000" opacity={0.55} {...flat} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} renderOrder={11}>
        <ringGeometry args={[RING - 0.65, RING, 96]} />
        <meshBasicMaterial color="#ffffff" {...flat} />
      </mesh>
      <mesh ref={pulse} rotation-x={-Math.PI / 2} renderOrder={11}>
        <ringGeometry args={[RING - 0.22, RING, 96]} />
        <meshBasicMaterial color="#ffffff" opacity={0} {...flat} />
      </mesh>
      <mesh position={[0, 4.5, 0]} renderOrder={11}>
        <cylinderGeometry args={[0.05, 0.05, 9, 4]} />
        <meshBasicMaterial color="#ffffff" {...flat} />
      </mesh>
      <Html position={[0, 9, 0]} zIndexRange={[20, 0]} style={{ pointerEvents: 'none', transform: 'translate(-50%, -100%)' }}>
        <span className={pill}>{label}</span>
      </Html>
    </group>
  )
}

function meanY(dem: Dem) {
  let s = 0
  for (let i = 0; i < dem.heights.length; i += 7) s += dem.heights[i]
  return heightToY(s / Math.ceil(dem.heights.length / 7), dem)
}

/** Place names on the twins; on Karacadağ, the patch that matches the target best. */
export function SceneMarkers({ world }: { world: World }) {
  const side = useStore((s) => s.side)
  const twin = useStore((s) => s.twin)
  const layer = useStore((s) => s.layer)
  const target = targetById(useStore((s) => s.target))
  const { x, num } = useT()
  const settled = (side === 'twin') === twin
  if (!settled) return null

  if (side === 'twin') {
    const dem = world.twins[target.id].dem
    const lower = meanY(dem) - meanY(world.earth.dem)
    return (
      <group>
        {target.labels.map((l) => (
          <Pole key={l.text} dem={dem} u={l.u} v={l.v} label={x(l.text)} lower={lower} />
        ))}
      </group>
    )
  }

  if (layer !== 'score') return null
  const best = world.analysis.best[target.id]
  return (
    <Patch
      dem={world.earth.dem}
      u={best.u}
      v={best.v}
      label={x('closest terrain to {name} · {score}%', { name: x(target.short), score: num(best.score) })}
    />
  )
}
