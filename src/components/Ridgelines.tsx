import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { anim } from '../lib/anim'
import { heightToY, uvToIndex, WORLD, type Dem } from '../lib/dem'
import { layerColor, layerData, type World } from '../lib/layers'
import { useStore } from '../store'

const ROWS = 150
const COLS = 420
const LIFT = 0.035

/** Stacked west–east profiles as line-segment vertex positions. */
function profilePositions(dem: Dem) {
  const positions = new Float32Array(ROWS * (COLS - 1) * 2 * 3)
  let p = 0
  for (let r = 0; r < ROWS; r++) {
    const v = r / (ROWS - 1)
    for (let c = 0; c < COLS - 1; c++) {
      for (let e = 0; e < 2; e++) {
        const u = (c + e) / (COLS - 1)
        positions[p++] = (u - 0.5) * WORLD
        positions[p++] = heightToY(dem.heights[uvToIndex(u, v, dem.size)], dem) + LIFT
        positions[p++] = (v - 0.5) * WORLD
      }
    }
  }
  return positions
}

/**
 * The terrain drawn as stacked west–east elevation profiles. Each profile is
 * coloured by the active data layer, so the lines are the heat map. The twin
 * terrain is a morph target, so the profiles flow from one world to the other.
 */
export function Ridgelines({ world }: { world: World }) {
  const layer = useStore((s) => s.layer)
  const target = useStore((s) => s.target)
  const side = useStore((s) => s.side)
  const probeV = useStore((s) => s.probe?.v ?? null)
  const lines = useRef<THREE.LineSegments>(null)

  const earthDem = world.earth.dem
  const twinDem = world.twins[target].dem

  const geometry = useMemo(() => {
    const { values, domain, layer: shown, surface } = layerData(world, layer, target, side)
    const size = surface.dem.size
    const colors = new Float32Array(ROWS * (COLS - 1) * 2 * 3)
    const rgb: [number, number, number] = [0, 0, 0]
    let k = 0
    for (let r = 0; r < ROWS; r++) {
      const v = r / (ROWS - 1)
      for (let c = 0; c < COLS - 1; c++) {
        for (let e = 0; e < 2; e++) {
          const value = values[uvToIndex((c + e) / (COLS - 1), v, size)]
          if (shown === 'terrain') {
            rgb[0] = rgb[1] = rgb[2] = 0.2 + (0.8 * (value - domain[0])) / (domain[1] - domain[0])
          } else {
            layerColor(shown, value, domain, rgb)
          }
          // keep the darkest end of each ramp faintly visible
          colors[k++] = 0.07 + 0.93 * rgb[0]
          colors[k++] = 0.07 + 0.93 * rgb[1]
          colors[k++] = 0.07 + 0.93 * rgb[2]
        }
      }
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(profilePositions(earthDem), 3))
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    g.morphAttributes.position = [new THREE.BufferAttribute(profilePositions(twinDem), 3)]
    return g
  }, [world, earthDem, twinDem, layer, target, side])
  useEffect(() => () => geometry.dispose(), [geometry])

  useLayoutEffect(() => {
    lines.current?.updateMorphTargets()
  }, [geometry])

  useFrame(() => {
    const l = lines.current
    if (l?.morphTargetInfluences) l.morphTargetInfluences[0] = anim.morph
  })

  // The transect under the cursor, lifted out in white.
  const dem = side === 'twin' ? twinDem : earthDem
  const transect = useMemo(() => {
    if (probeV === null) return null
    const pts = new Float32Array(COLS * 3)
    for (let c = 0; c < COLS; c++) {
      const u = c / (COLS - 1)
      pts[c * 3] = (u - 0.5) * WORLD
      pts[c * 3 + 1] = heightToY(dem.heights[uvToIndex(u, probeV, dem.size)], dem) + LIFT * 2.5
      pts[c * 3 + 2] = (probeV - 0.5) * WORLD
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pts, 3))
    return new THREE.Line(g, new THREE.LineBasicMaterial({ color: '#f5f5f7', toneMapped: false }))
  }, [probeV, dem])
  useEffect(
    () => () => {
      transect?.geometry.dispose()
      ;(transect?.material as THREE.Material | undefined)?.dispose()
    },
    [transect],
  )

  return (
    <>
      <lineSegments ref={lines} geometry={geometry} raycast={() => null}>
        <lineBasicMaterial vertexColors toneMapped={false} />
      </lineSegments>
      {transect && <primitive object={transect} raycast={() => null} />}
    </>
  )
}
