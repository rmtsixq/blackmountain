import { useFrame } from '@react-three/fiber'
import { anim } from '../lib/anim'
import { useStore } from '../store'

// ?still=1 skips the transitions, for screenshots and reduced motion.
const still =
  new URLSearchParams(window.location.search).has('still') ||
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Advances the shared animation values once per frame. */
export function Animator() {
  useFrame((_, dt) => {
    const { exag, twin, side, setSide } = useStore.getState()
    const step = still ? 10 : Math.min(dt, 0.05)
    anim.exag += (exag - anim.exag) * (1 - Math.exp(-step * 2.4))
    const goal = twin ? 1 : 0
    anim.morph += (goal - anim.morph) * (1 - Math.exp(-step * 3.2))
    if (Math.abs(goal - anim.morph) < 0.001) anim.morph = goal
    const shown = anim.morph > 0.5 ? 'twin' : 'earth'
    if (shown !== side) setSide(shown)
  })
  return null
}
