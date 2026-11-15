import { useEffect, useRef, type ComponentRef } from 'react'
import { OrbitControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { HOME_POSITION } from '../lib/camera'
import { useStore } from '../store'

const HOME_TARGET = new THREE.Vector3(0, -5, 8)
const scratch = new THREE.Vector3()

export function CameraRig() {
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null)
  const camera = useThree((s) => s.camera)
  const autoRotate = useStore((s) => s.autoRotate)
  const resetNonce = useStore((s) => s.resetNonce)
  const shot = useStore((s) => s.shot)
  const setAutoRotate = useStore((s) => s.setAutoRotate)
  const animating = useRef(false)

  useEffect(() => {
    if (resetNonce === 0) return
    camera.position.set(...HOME_POSITION)
    animating.current = true
  }, [resetNonce, camera])

  useFrame(({ clock }, dt) => {
    const c = controls.current
    if (!c) return
    if (shot) {
      // A story shot drives both the camera and its target, then keeps
      // drifting a few degrees around the target so the scene stays alive.
      const k = 1 - Math.exp(-Math.min(dt, 0.05) * 1.3)
      const sway = Math.sin(clock.elapsedTime * 0.13) * 0.1
      const [tx, ty, tz] = shot.target
      const dx = shot.position[0] - tx
      const dz = shot.position[2] - tz
      scratch.set(
        tx + dx * Math.cos(sway) - dz * Math.sin(sway),
        shot.position[1],
        tz + dx * Math.sin(sway) + dz * Math.cos(sway),
      )
      camera.position.lerp(scratch, k)
      c.target.lerp(scratch.set(tx, ty, tz), k)
      c.update()
      return
    }
    if (!animating.current) return
    c.target.lerp(HOME_TARGET, 1 - Math.exp(-dt * 4))
    if (c.target.distanceTo(HOME_TARGET) < 0.05) animating.current = false
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
      maxDistance={320}
      enabled={!shot}
      autoRotate={autoRotate && !shot}
      autoRotateSpeed={0.35}
      onStart={() => {
        animating.current = false
        if (useStore.getState().autoRotate) setAutoRotate(false)
      }}
    />
  )
}
