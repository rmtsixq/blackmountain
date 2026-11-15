import { Canvas } from '@react-three/fiber'
import { HOME_POSITION } from '../lib/camera'
import type { World } from '../lib/layers'
import { Animator } from './Animator'
import { CameraRig } from './CameraRig'
import { StationMarkers } from './StationMarkers'
import { SunLight } from './SunLight'
import { TerrainMesh } from './TerrainMesh'

export function Scene3D({ world }: { world: World }) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: HOME_POSITION, fov: 30, near: 0.5, far: 900 }}
    >
      <color attach="background" args={['#000000']} />
      <hemisphereLight args={['#aab4c8', '#000000', 0.3]} />
      <Animator />
      <SunLight />
      <TerrainMesh world={world} />
      <StationMarkers world={world} />
      <CameraRig dem={world.earth.dem} />
    </Canvas>
  )
}
