import { create } from 'zustand'
import type { LayerId, Side, World } from './lib/layers'
import type { TargetId } from './data/targets'
import type { UV } from './lib/dem'

export type SidebarTab = 'fingerprint' | 'field' | 'limits'

export interface Shot {
  position: [number, number, number]
  target: [number, number, number]
}

interface State {
  world: World | null
  layer: LayerId
  target: TargetId
  /** which terrain the user asked for */
  twin: boolean
  /** which terrain is currently drawn (flips halfway through the morph) */
  side: Side
  /** local solar time, hours */
  hour: number
  /** vertical exaggeration */
  exag: number
  stationId: string | null
  probe: UV | null
  autoRotate: boolean
  tab: SidebarTab
  resetNonce: number
  /** guided tour */
  touring: boolean
  caption: string | null
  shot: Shot | null
  setWorld: (world: World) => void
  setLayer: (layer: LayerId) => void
  setTarget: (target: TargetId) => void
  setTwin: (twin: boolean) => void
  setSide: (side: Side) => void
  setHour: (hour: number) => void
  setExag: (exag: number) => void
  selectStation: (id: string | null) => void
  setProbe: (probe: UV | null) => void
  setAutoRotate: (on: boolean) => void
  setTab: (tab: SidebarTab) => void
  resetView: () => void
  setTour: (tour: Partial<Pick<State, 'touring' | 'caption' | 'shot'>>) => void
}

// Deep links for the demo: ?layer=score&target=tranq&hour=16.6&twin=1
const params = new URLSearchParams(window.location.search)
const LAYER_IDS: LayerId[] = ['terrain', 'thermal', 'swing', 'radar', 'slope', 'score']
const TARGET_IDS: TargetId[] = ['arsia', 'tranq', 'shackleton']
const pick = <T extends string>(key: string, allowed: T[], fallback: T) => {
  const value = params.get(key) as T | null
  return value && allowed.includes(value) ? value : fallback
}
const initialHour = Number(params.get('hour'))
const initialTwin = params.get('twin') === '1'

export const useStore = create<State>((set) => ({
  world: null,
  layer: pick('layer', LAYER_IDS, 'thermal'),
  target: pick('target', TARGET_IDS, 'arsia'),
  twin: initialTwin,
  side: 'earth',
  hour: initialHour >= 6.8 && initialHour <= 17.2 ? initialHour : 13.5,
  exag: 4,
  stationId: null,
  probe: null,
  autoRotate: true,
  tab: 'fingerprint',
  resetNonce: 0,
  touring: false,
  caption: null,
  shot: null,
  setWorld: (world) => set({ world }),
  setLayer: (layer) => set({ layer }),
  setTarget: (target) => set({ target }),
  setTwin: (twin) => set(twin ? { twin, stationId: null } : { twin }),
  setSide: (side) => set({ side, probe: null }),
  setHour: (hour) => set({ hour }),
  setExag: (exag) => set({ exag }),
  selectStation: (stationId) =>
    set(stationId ? { stationId, tab: 'field', autoRotate: false, twin: false } : { stationId }),
  setProbe: (probe) => set({ probe }),
  setAutoRotate: (autoRotate) => set({ autoRotate }),
  setTab: (tab) => set({ tab }),
  resetView: () =>
    set((s) => ({ resetNonce: s.resetNonce + 1, stationId: null, autoRotate: true })),
  setTour: (tour) => set(tour),
}))
