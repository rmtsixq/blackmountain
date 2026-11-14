import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { anim } from '../lib/anim'
import { heightToY, sampleHeight, WORLD, type Dem } from '../lib/dem'
import { bakeLayer, effectiveLayer, layerData, type World } from '../lib/layers'
import { useStore } from '../store'
import { Ridgelines } from './Ridgelines'

const SEG = 256
const BASE = 1.2

function surfaceHeights(dem: Dem) {
  const g = new THREE.PlaneGeometry(WORLD, WORLD, SEG, SEG)
  g.rotateX(-Math.PI / 2)
  const pos = g.attributes.position as THREE.BufferAttribute
  for (let iy = 0; iy <= SEG; iy++) {
    for (let ix = 0; ix <= SEG; ix++) {
      pos.setY(iy * (SEG + 1) + ix, heightToY(sampleHeight(dem, ix / SEG, iy / SEG), dem))
    }
  }
  g.computeVertexNormals()
  return g
}

/** Karacadağ as the base shape, the twin terrain as a morph target. */
function buildSurface(earth: Dem, twin: Dem) {
  const g = surfaceHeights(earth)
  const t = surfaceHeights(twin)
  g.morphAttributes.position = [t.attributes.position]
  g.morphAttributes.normal = [t.attributes.normal]
  return g
}

/** Vertical walls closing the four edges so the block reads as a solid cut. */
function skirtPositions(dem: Dem) {
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
  return new THREE.Float32BufferAttribute(verts, 3)
}

function buildSkirt(earth: Dem, twin: Dem) {
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', skirtPositions(earth))
  g.morphAttributes.position = [skirtPositions(twin)]
  return g
}

/**
 * A dark, sun-lit surface that carries the shadows and hides lines behind
 * ridges; the colour lives mostly in the ridgelines drawn on top of it.
 */
export function TerrainMesh({ world }: { world: World }) {
  const layer = useStore((s) => s.layer)
  const target = useStore((s) => s.target)
  const side = useStore((s) => s.side)
  const setProbe = useStore((s) => s.setProbe)

  const group = useRef<THREE.Group>(null)
  const mesh = useRef<THREE.Mesh>(null)
  const skirtMesh = useRef<THREE.Mesh>(null)

  const earthDem = world.earth.dem
  const twinDem = world.twins[target].dem
  const surface = useMemo(() => buildSurface(earthDem, twinDem), [earthDem, twinDem])
  const skirt = useMemo(() => buildSkirt(earthDem, twinDem), [earthDem, twinDem])
  useEffect(() => () => surface.dispose(), [surface])
  useEffect(() => () => skirt.dispose(), [skirt])

  useLayoutEffect(() => {
    mesh.current?.updateMorphTargets()
    skirtMesh.current?.updateMorphTargets()
  }, [surface, skirt])

  // Keep the twin's mean height where Karacadağ's was, so a 5 km deep polar
  // crater does not climb out of the frame. The vertical scale is untouched.
  const recentre = useMemo(() => {
    const mean = (d: Dem) => {
      let s = 0
      for (let i = 0; i < d.heights.length; i += 7) s += d.heights[i]
      return heightToY(s / Math.ceil(d.heights.length / 7), d)
    }
    return mean(twinDem) - mean(earthDem)
  }, [earthDem, twinDem])

  useFrame(() => {
    if (group.current) {
      group.current.scale.y = anim.exag
      group.current.position.y = -anim.morph * recentre * anim.exag
    }
    for (const m of [mesh.current, skirtMesh.current]) {
      if (m?.morphTargetInfluences) m.morphTargetInfluences[0] = anim.morph
    }
  })

  // Earth layers other than the match do not depend on the selected target.
  const shown = effectiveLayer(layer, side)
  const textureTarget = side === 'twin' || shown === 'score' ? target : 'arsia'
  const texture = useMemo(() => {
    const t = new THREE.CanvasTexture(bakeLayer(layerData(world, layer, textureTarget, side)))
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = 8
    return t
  }, [world, layer, textureTarget, side])
  useEffect(() => () => texture.dispose(), [texture])

  return (
    <group ref={group} scale={[1, 0.02, 1]}>
      <mesh
        ref={mesh}
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
          emissiveIntensity={shown === 'terrain' ? 0.03 : 0.16}
          roughness={1}
          metalness={0}
          polygonOffset
          polygonOffsetFactor={1}
          polygonOffsetUnits={1}
        />
      </mesh>
      <Ridgelines world={world} />
      <mesh ref={skirtMesh} geometry={skirt}>
        <meshBasicMaterial color="#050506" side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -BASE, 0]}>
        <planeGeometry args={[WORLD, WORLD]} />
        <meshBasicMaterial color="#050506" side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}
