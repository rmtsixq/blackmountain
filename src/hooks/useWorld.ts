import { useCallback, useEffect, useState } from 'react'
import { TARGETS, type TargetId } from '../data/targets'
import { analyse } from '../lib/analysis'
import { loadData } from '../lib/data'
import { downsample, GRID, loadDem, makeDem, resample, type Dem } from '../lib/dem'
import { derive, percentileDomain, type Surface, type World } from '../lib/layers'
import { useStore } from '../store'

export interface WorldState {
  status: 'loading' | 'ready' | 'error'
  progress: number
  stage: string
  world: World | null
  error: string | null
  retry: () => void
}

// Yields so the progress text can paint. A background tab gets no animation
// frames, so a timeout keeps the load going there too.
const nextFrame = () =>
  new Promise<void>((resolve) => {
    requestAnimationFrame(() => setTimeout(resolve, 0))
    setTimeout(resolve, 60)
  })

/** Load every raster, then run the terrain comparison once. */
export function useWorld(): WorldState {
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState<Omit<WorldState, 'retry'>>({
    status: 'loading',
    progress: 0,
    stage: 'Fetching elevation, temperature and radar',
    world: null,
    error: null,
  })

  useEffect(() => {
    let alive = true
    const stage = async (progress: number, text: string) => {
      if (alive) setState((s) => ({ ...s, progress, stage: text }))
      await nextFrame()
    }
    const run = async () => {
      setState((s) => ({ ...s, status: 'loading', progress: 0, error: null }))
      try {
        let a = 0
        let b = 0
        const tick = () => alive && setState((s) => ({ ...s, progress: (a + b) * 0.25 }))
        const [dem, data] = await Promise.all([
          loadDem((p) => ((a = p), tick())),
          loadData((p) => ((b = p), tick())),
        ])
        if (!alive) return
        const size = data.manifest.size

        await stage(0.55, 'Deriving slope on three worlds')
        const up = (name: 'lst_day' | 'lst_swing' | 's1_vv') => resample(data.grids[name], size, GRID)
        const twinDems = {} as Record<TargetId, Dem>
        const twins = {} as Record<TargetId, Surface>
        for (const t of TARGETS) {
          twinDems[t.id] = makeDem(data.grids[t.id], size)
          twins[t.id] = derive(twinDems[t.id])
        }
        const thermal = up('lst_day')
        const swing = up('lst_swing')
        const radar = up('s1_vv')

        await stage(0.7, 'Scoring eight Earth sites against Mars and the Moon')
        const sites = (data.manifest.sites ?? []).map((s) => ({
          ...s,
          dem: makeDem(data.sites[s.id], size),
        }))
        const analysis = analyse(downsample(dem), twinDems, sites)
        const score = {} as Record<TargetId, Float32Array>
        for (const t of TARGETS) score[t.id] = resample(analysis.match[t.id], size, GRID)

        const world: World = {
          earth: { ...derive(dem), thermal, swing, radar, score },
          twins,
          analysis,
          manifest: data.manifest,
          domains: {
            thermal: percentileDomain(thermal),
            swing: percentileDomain(swing),
            radar: percentileDomain(radar),
          },
        }
        if (!alive) return
        useStore.getState().setWorld(world)
        setState({ status: 'ready', progress: 1, stage: 'Ready', world, error: null })
      } catch (err) {
        if (!alive) return
        setState((s) => ({
          ...s,
          status: 'error',
          error: err instanceof Error ? err.message : 'Unknown error',
        }))
      }
    }
    run()
    return () => {
      alive = false
    }
  }, [attempt])

  const retry = useCallback(() => setAttempt((n) => n + 1), [])
  return { ...state, retry }
}
