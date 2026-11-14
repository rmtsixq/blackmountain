import { create } from 'zustand'
import type { LayerId } from './lib/layers'
import type { TargetId } from './data/targets'
import type { UV } from './lib/dem'

export type SidebarTab = 'fingerprint' | 'field' | 'limits'

interface State {
  layer: LayerId
  target: TargetId
  /** local solar time, hours */
  hour: number
  /** vertical exaggeration */
  exag: number
  stationId: string | null
  probe: UV | null
  autoRotate: boolean
  tab: SidebarTab
  resetNonce: number
  setLayer: (layer: LayerId) => void
  setTarget: (target: TargetId) => void
  setHour: (hour: number) => void
  setExag: (exag: number) => void
  selectStation: (id: string | null) => void
  setProbe: (probe: UV | null) => void
  setAutoRotate: (on: boolean) => void
  setTab: (tab: SidebarTab) => void
  resetView: () => void
}

// Deep links for the demo: ?layer=score&target=tranq&hour=16.6
const params = new URLSearchParams(window.location.search)
const LAYER_IDS: LayerId[] = ['terrain', 'thermal', 'roughness', 'slope', 'score']
const TARGET_IDS: TargetId[] = ['arsia', 'tranq', 'shackleton']
const pick = <T extends string>(key: string, allowed: T[], fallback: T) => {
  const value = params.get(key) as T | null
  return value && allowed.includes(value) ? value : fallback
}
const initialHour = Number(params.get('hour'))

export const useStore = create<State>((set) => ({
  layer: pick('layer', LAYER_IDS, 'thermal'),
  target: pick('target', TARGET_IDS, 'arsia'),
  hour: initialHour >= 6.8 && initialHour <= 17.2 ? initialHour : 13.5,
  exag: 4,
  stationId: null,
  probe: null,
  autoRotate: true,
  tab: 'fingerprint',
  resetNonce: 0,
  setLayer: (layer) => set({ layer }),
  setTarget: (target) => set({ target }),
  setHour: (hour) => set({ hour }),
  setExag: (exag) => set({ exag }),
  selectStation: (stationId) =>
    set(stationId ? { stationId, tab: 'field', autoRotate: false } : { stationId }),
  setProbe: (probe) => set({ probe }),
  setAutoRotate: (autoRotate) => set({ autoRotate }),
  setTab: (tab) => set({ tab }),
  resetView: () =>
    set((s) => ({ resetNonce: s.resetNonce + 1, stationId: null, autoRotate: true })),
}))
