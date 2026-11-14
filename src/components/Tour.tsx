import { useEffect } from 'react'
import { TOUR, TOUR_LENGTH } from '../lib/tour'
import { useStore } from '../store'

/** Start / stop control for the guided tour, and the loop that plays it. */
export function Tour() {
  const touring = useStore((s) => s.touring)
  const setTour = useStore((s) => s.setTour)

  useEffect(() => {
    if (!touring) return
    const s = useStore.getState()
    s.setAutoRotate(false)
    s.selectStation(null)
    const start = performance.now()
    let next = 0
    let sweep: { from: number; to: number; t0: number; dur: number } | null = null
    let raf = 0

    const frame = () => {
      const t = (performance.now() - start) / 1000
      const store = useStore.getState()
      while (next < TOUR.length && TOUR[next].at <= t) {
        const step = TOUR[next++]
        if (step.layer) store.setLayer(step.layer)
        if (step.target) store.setTarget(step.target)
        if (step.twin !== undefined) store.setTwin(step.twin)
        if (step.caption || step.shot) {
          store.setTour({
            ...(step.caption ? { caption: step.caption } : {}),
            ...(step.shot ? { shot: step.shot } : {}),
          })
        }
        if (step.hour !== undefined) {
          sweep = { from: store.hour, to: step.hour, t0: t, dur: step.sweep ?? 1 }
        }
      }
      if (sweep) {
        const k = Math.min(1, (t - sweep.t0) / sweep.dur)
        const eased = k * k * (3 - 2 * k)
        store.setHour(sweep.from + (sweep.to - sweep.from) * eased)
        if (k >= 1) sweep = null
      }
      if (t >= TOUR_LENGTH) {
        store.setTour({ touring: false })
        return
      }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      const end = useStore.getState()
      end.setTour({ caption: null, shot: null })
      end.setTwin(false)
      end.resetView()
    }
  }, [touring])

  return (
    <button
      type="button"
      onClick={() => setTour({ touring: !touring })}
      className={`pointer-events-auto font-mono text-[11px] underline-offset-4 transition-colors ${
        touring ? 'text-ember underline' : 'text-white hover:text-ember'
      }`}
    >
      {touring ? 'stop tour' : '▸ play the 40 s tour'}
    </button>
  )
}
