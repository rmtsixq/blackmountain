import { Canvas } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
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
      camera={{ position: HOME_POSITION, fov: 34, near: 0.5, far: 900 }}
    >
      <color attach="background" args={['#050506']} />
      <fog attach="fog" args={['#050506', 190, 460]} />
      <hemisphereLight args={['#93a4c4', '#0a0a0c', 0.4]} />
      <SunLight />
      <Stars radius={320} depth={60} count={2200} factor={4} fade speed={0.3} />
      <TerrainMesh dem={dem} fields={fields} />
      <StationMarkers dem={dem} />
      <gridHelper args={[440, 88, '#1d2027', '#101216']} position={[0, -8, 0]} />
      <CameraRig dem={dem} />
    </Canvas>
  )
}
