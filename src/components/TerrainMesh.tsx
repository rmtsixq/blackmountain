import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { heightToY, sampleHeight, WORLD, type Dem } from '../lib/dem'
import { bakeLayer, type Fields } from '../lib/layers'
import { useStore } from '../store'
import { Ridgelines } from './Ridgelines'

const SEG = 256
const BASE = 1.2

function buildSurface(dem: Dem) {
  const g = new THREE.PlaneGeometry(WORLD, WORLD, SEG, SEG)
  g.rotateX(-Math.PI / 2)
  const pos = g.attributes.position as THREE.BufferAttribute
  for (let iy = 0; iy <= SEG; iy++) {
    for (let ix = 0; ix <= SEG; ix++) {
      const h = sampleHeight(dem, ix / SEG, iy / SEG)
      pos.setY(iy * (SEG + 1) + ix, heightToY(h, dem))
    }
  }
  g.computeVertexNormals()
  return g
}

/** Vertical walls closing the four edges so the block reads as a solid cut. */
function buildSkirt(dem: Dem) {
  const verts: number[] = []
  const edge = (uv: (t: number) => [number, number]) => {
    for (let i = 0; i < SEG; i++) {
      const [u0, v0] = uv(i / SEG)
      const [u1, v1] = uv((i + 1) / SEG)
      const x0 = (u0 - 0.5) * WORLD
      const z0 = (v0 - 0.5) * WORLD
      const x1 = (u1 - 0.5) * WORLD
      const z1 = (v1 - 0.5) * WORLD
      const y0 = heightToY(sampleHeight(dem, u0, v0), dem)
      const y1 = heightToY(sampleHeight(dem, u1, v1), dem)
      verts.push(x0, y0, z0, x1, y1, z1, x1, -BASE, z1)
      verts.push(x0, y0, z0, x1, -BASE, z1, x0, -BASE, z0)
    }
  }
  edge((t) => [t, 0])
  edge((t) => [t, 1])
  edge((t) => [0, t])
  edge((t) => [1, t])
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
  return g
}

interface Props {
  dem: Dem
  fields: Fields
}

/**
 * A dark, sun-lit surface that carries the shadows and hides lines behind
 * ridges; the colour lives mostly in the ridgelines drawn on top of it.
 */
export function TerrainMesh({ dem, fields }: Props) {
  const layer = useStore((s) => s.layer)
  const target = useStore((s) => s.target)
  const exag = useStore((s) => s.exag)
  const setProbe = useStore((s) => s.setProbe)

  const surface = useMemo(() => buildSurface(dem), [dem])
  const skirt = useMemo(() => buildSkirt(dem), [dem])
  useEffect(() => () => surface.dispose(), [surface])
  useEffect(() => () => skirt.dispose(), [skirt])

  // The score layer is the only one that depends on the selected target.
  const textureTarget = layer === 'score' ? target : 'arsia'
  const texture = useMemo(() => {
    const t = new THREE.CanvasTexture(bakeLayer(dem, fields, layer, textureTarget))
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = 8
    return t
  }, [dem, fields, layer, textureTarget])
  useEffect(() => () => texture.dispose(), [texture])

  return (
    <group scale={[1, exag, 1]}>
      <mesh
        geometry={surface}
        castShadow
        receiveShadow
        onPointerMove={(e) => {
          if (e.uv) setProbe({ u: e.uv.x, v: 1 - e.uv.y })
        }}
        onPointerOut={() => setProbe(null)}
      >
        <meshStandardMaterial
          map={texture}
          color="#8a8a8a"
          emissiveMap={texture}
          emissive="#ffffff"
          emissiveIntensity={layer === 'terrain' ? 0.03 : 0.16}
          roughness={1}
          metalness={0}
          polygonOffset
          polygonOffsetFactor={1}
          polygonOffsetUnits={1}
        />
      </mesh>
      <Ridgelines dem={dem} fields={fields} />
      <mesh geometry={skirt}>
        <meshBasicMaterial color="#050506" side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -BASE, 0]}>
        <planeGeometry args={[WORLD, WORLD]} />
        <meshBasicMaterial color="#050506" side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}
