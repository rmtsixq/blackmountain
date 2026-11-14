import { Canvas } from '@react-three/fiber'
import type { Dem } from '../lib/dem'
import type { Fields } from '../lib/layers'
import { HOME_POSITION } from '../lib/camera'
import { CameraRig } from './CameraRig'
import { StationMarkers } from './StationMarkers'
import { SunLight } from './SunLight'
import { TerrainMesh } from './TerrainMesh'

interface Props {
  dem: Dem
  fields: Fields
}

export function Scene3D({ dem, fields }: Props) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: HOME_POSITION, fov: 30, near: 0.5, far: 900 }}
    >
      <color attach="background" args={['#050506']} />
      <hemisphereLight args={['#aab4c8', '#050506', 0.3]} />
      <SunLight />
      <TerrainMesh dem={dem} fields={fields} />
      <StationMarkers dem={dem} />
      <CameraRig dem={dem} />
    </Canvas>
  )
}
