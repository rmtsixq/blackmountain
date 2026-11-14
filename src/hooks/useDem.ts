import { useCallback, useEffect, useState } from 'react'
import { loadDem, proceduralDem, type Dem } from '../lib/dem'
import { computeFields, type Fields } from '../lib/layers'

export interface DemState {
  status: 'loading' | 'ready'
  progress: number
  stage: string
  dem: Dem | null
  fields: Fields | null
  /** set when the real tiles failed and the synthetic terrain is shown */
  error: string | null
  retry: () => void
}

const nextFrame = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)))

export function useDem(): DemState {
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState<Omit<DemState, 'retry'>>({
    status: 'loading',
    progress: 0,
    stage: 'Fetching elevation tiles',
    dem: null,
    fields: null,
    error: null,
  })

  useEffect(() => {
    let alive = true
    const run = async () => {
      setState((s) => ({ ...s, status: 'loading', progress: 0, stage: 'Fetching elevation tiles' }))
      let dem: Dem
      let error: string | null = null
      try {
        dem = await loadDem((p) => {
          if (alive) setState((s) => ({ ...s, progress: p * 0.7 }))
        })
      } catch (err) {
        error = err instanceof Error ? err.message : 'Unknown error'
        dem = proceduralDem()
      }
      if (!alive) return
      setState((s) => ({ ...s, progress: 0.75, stage: 'Deriving slope, thermal and radar layers' }))
      await nextFrame()
      const fields = computeFields(dem)
      if (!alive) return
      setState({ status: 'ready', progress: 1, stage: 'Ready', dem, fields, error })
    }
    run()
    return () => {
      alive = false
    }
  }, [attempt])

  const retry = useCallback(() => setAttempt((a) => a + 1), [])
  return { ...state, retry }
}
