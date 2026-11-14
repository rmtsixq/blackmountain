import { useEffect, useMemo, useRef, type ComponentRef } from 'react'
import { OrbitControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { stationById } from '../data/field'
import { heightToY, lonLatToUV, sampleHeight, WORLD, type Dem } from '../lib/dem'
import { HOME_POSITION } from '../lib/camera'
import { useStore } from '../store'


const HOME_TARGET = new THREE.Vector3(0, -5, 8)

export function CameraRig({ dem }: { dem: Dem }) {
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null)
  const camera = useThree((s) => s.camera)
  const stationId = useStore((s) => s.stationId)
  const exag = useStore((s) => s.exag)
  const autoRotate = useStore((s) => s.autoRotate)
  const resetNonce = useStore((s) => s.resetNonce)
  const setAutoRotate = useStore((s) => s.setAutoRotate)
  const animating = useRef(false)

  const focus = useMemo(() => {
    const station = stationById(stationId)
    if (!station) return HOME_TARGET
    const { u, v } = lonLatToUV(station.lon, station.lat)
    return new THREE.Vector3(
      (u - 0.5) * WORLD,
      heightToY(sampleHeight(dem, u, v), dem) * exag,
      (v - 0.5) * WORLD,
    )
  }, [stationId, dem, exag])

  useEffect(() => {
    animating.current = true
  }, [focus])

  useEffect(() => {
    if (resetNonce === 0) return
    camera.position.set(...HOME_POSITION)
    animating.current = true
  }, [resetNonce, camera])

  useFrame((_, dt) => {
    const c = controls.current
    if (!c || !animating.current) return
    c.target.lerp(focus, 1 - Math.exp(-dt * 4))
    if (c.target.distanceTo(focus) < 0.05) animating.current = false
    c.update()
  })

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      target={[HOME_TARGET.x, HOME_TARGET.y, HOME_TARGET.z]}
      maxPolarAngle={Math.PI * 0.47}
      minDistance={10}
      maxDistance={230}
      autoRotate={autoRotate}
      autoRotateSpeed={0.35}
      onStart={() => {
        animating.current = false
        if (useStore.getState().autoRotate) setAutoRotate(false)
      }}
    />
  )
}
