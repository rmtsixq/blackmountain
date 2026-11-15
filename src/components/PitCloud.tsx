import { useEffect, useMemo, useState } from 'react'
import { Line, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { PIT_SCAN } from '../data/pitScan'
import { useT } from '../lib/i18n'

const { count, min, max, floor_centre: floor, rim_y: rim } = PIT_SCAN
const CENTRE: [number, number, number] = [floor[0], (rim + floor[1]) / 2, floor[2]]
const PERSON = 1.7

// sRGB bytes to the linear values three.js expects in a colour attribute
const LINEAR = Float32Array.from({ length: 256 }, (_, i) => {
  const c = i / 255
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
})

function decode(buffer: ArrayBuffer) {
  if (buffer.byteLength !== count * 9) throw new Error('Unexpected scan size')
  const q = new Uint16Array(buffer, 0, count * 3)
  const rgb = new Uint8Array(buffer, count * 6, count * 3)
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  for (let i = 0; i < count * 3; i++) {
    const axis = i % 3
    positions[i] = min[axis] + (q[i] / 65535) * (max[axis] - min[axis])
    colors[i] = LINEAR[rgb[i]]
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  return geometry
}

/** The field scan of the collapse pit, drawn as the points it is made of. */
export function PitCloud() {
  const { t, num } = useT()
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null)
  const [failed, setFailed] = useState(false)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let alive = true
    fetch('/data/pit.bin')
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.arrayBuffer()
      })
      .then((buffer) => alive && setGeometry(decode(buffer)))
      .catch(() => alive && setFailed(true))
    return () => {
      alive = false
    }
  }, [attempt])
  useEffect(() => () => geometry?.dispose(), [geometry])

  const person = useMemo(
    () =>
      [
        [floor[0], floor[1], floor[2]],
        [floor[0], floor[1] + PERSON, floor[2]],
      ] as [number, number, number][],
    [],
  )

  if (failed) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <p className="text-[19px] font-semibold text-ink">{t.scanFailed}</p>
        <button
          type="button"
          onClick={() => {
            setFailed(false)
            setAttempt((a) => a + 1)
          }}
          className="mt-3 h-9 rounded-full bg-ink px-4 text-[14px] font-medium text-paper"
        >
          {t.retry}
        </button>
      </div>
    )
  }

  return (
    <div className="absolute inset-0">
      {!geometry && (
        <p className="absolute inset-0 flex items-center justify-center text-[13px] text-ink-3">
          {t.scanLoading(num(count))}
        </p>
      )}
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [CENTRE[0] - 17, CENTRE[1] + 24, CENTRE[2] + 19], fov: 34, near: 0.2, far: 200 }}
      >
        <color attach="background" args={['#000000']} />
        {geometry && (
          <>
            <points geometry={geometry}>
              <pointsMaterial size={0.09} sizeAttenuation vertexColors toneMapped={false} />
            </points>
            {/* a standing person, for scale */}
            <Line points={person} color="#ffd60a" lineWidth={3} depthTest={false} />
          </>
        )}
        <OrbitControls
          target={CENTRE}
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          autoRotate
          autoRotateSpeed={0.5}
          minDistance={4}
          maxDistance={48}
          maxPolarAngle={Math.PI * 0.62}
        />
      </Canvas>
    </div>
  )
}
