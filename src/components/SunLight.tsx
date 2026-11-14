import { useMemo } from 'react'
import * as THREE from 'three'
import { smoothstep } from '../lib/noise'
import { solarPosition } from '../lib/solar'
import { useStore } from '../store'

const LOW = new THREE.Color('#ff8a4d')
const HIGH = new THREE.Color('#fff3e2')

/** Directional light placed from real solar geometry for the chosen hour. */
export function SunLight() {
  const hour = useStore((s) => s.hour)
  const { position, color, intensity } = useMemo(() => {
    const sun = solarPosition(hour)
    const up = Math.max(sun.up, 0.01)
    return {
      position: [sun.e * 160, up * 160, -sun.n * 160] as [number, number, number],
      color: LOW.clone().lerp(HIGH, smoothstep(2, 22, sun.elevation)),
      intensity: 3.1 * smoothstep(-1.5, 9, sun.elevation),
    }
  }, [hour])

  return (
    <directionalLight
      position={position}
      color={color}
      intensity={intensity}
      castShadow
      shadow-mapSize={[2048, 2048]}
      shadow-bias={-0.0006}
      shadow-normalBias={0.35}
    >
      <orthographicCamera attach="shadow-camera" args={[-78, 78, 78, -78, 1, 420]} />
    </directionalLight>
  )
}
