import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { heightToY, uvToIndex, WORLD, type Dem } from '../lib/dem'
import { layerColor, layerDomain, layerField, type Fields } from '../lib/layers'
import { useStore } from '../store'

const ROWS = 150
const COLS = 420
const LIFT = 0.035

interface Props {
  dem: Dem
  fields: Fields
}

/**
 * The terrain drawn as stacked west–east elevation profiles. Each profile is
 * coloured by the active data layer, so the lines are the heat map.
 */
export function Ridgelines({ dem, fields }: Props) {
  const layer = useStore((s) => s.layer)
  const target = useStore((s) => s.target)
  const probeV = useStore((s) => s.probe?.v ?? null)

  const { positions, indices } = useMemo(() => {
    const positions = new Float32Array(ROWS * (COLS - 1) * 2 * 3)
    const indices = new Uint32Array(ROWS * (COLS - 1) * 2)
    let p = 0
    let k = 0
    for (let r = 0; r < ROWS; r++) {
      const v = r / (ROWS - 1)
      for (let c = 0; c < COLS - 1; c++) {
        for (let e = 0; e < 2; e++) {
          const u = (c + e) / (COLS - 1)
          const i = uvToIndex(u, v, dem.size)
          positions[p++] = (u - 0.5) * WORLD
          positions[p++] = heightToY(dem.heights[i], dem) + LIFT
          positions[p++] = (v - 0.5) * WORLD
          indices[k++] = i
        }
      }
    }
    return { positions, indices }
  }, [dem])

  const colors = useMemo(() => {
    const colors = new Float32Array(indices.length * 3)
    const src = layerField(layer, dem, fields, target)
    const domain = layerDomain(layer, dem)
    const rgb: [number, number, number] = [0, 0, 0]
    for (let k = 0; k < indices.length; k++) {
      const value = src[indices[k]]
      if (layer === 'terrain') {
        const t = (value - domain[0]) / (domain[1] - domain[0])
        rgb[0] = rgb[1] = rgb[2] = 0.2 + 0.8 * t
      } else {
        layerColor(layer, value, domain, rgb)
      }
      // keep the darkest end of each ramp faintly visible
      colors[k * 3] = 0.07 + 0.93 * rgb[0]
      colors[k * 3 + 1] = 0.07 + 0.93 * rgb[1]
      colors[k * 3 + 2] = 0.07 + 0.93 * rgb[2]
    }
    return colors
  }, [indices, dem, fields, layer, target])

  // The transect under the cursor, lifted out in white.
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
    return new THREE.Line(g, new THREE.LineBasicMaterial({ color: '#ffffff', toneMapped: false }))
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
      <lineSegments raycast={() => null}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <lineBasicMaterial vertexColors toneMapped={false} />
      </lineSegments>
      {transect && <primitive object={transect} raycast={() => null} />}
    </>
  )
}
