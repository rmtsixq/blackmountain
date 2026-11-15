import { create } from 'zustand'
import type { LayerId, Side, World } from './lib/layers'
import type { TargetId } from './data/targets'
import type { UV } from './lib/dem'
import type { Lang } from './lib/i18n'

export type SidebarTab = 'fingerprint' | 'field' | 'limits'
/** story: one finding at a time. explore: every instrument. */
export type Mode = 'story' | 'explore'

export interface Shot {
  position: [number, number, number]
  target: [number, number, number]
}

/** What the plate beside the text shows. */
export type Plate =
  | { kind: 'terrain' }
  | { kind: 'photo'; src: string; alt: string }
  /** the opening: a full-width banner the story lays out itself */
  | { kind: 'cover'; src: string; alt: string }
  | { kind: 'scan' }

interface State {
  world: World | null
  /** null until chosen on the first screen */
  lang: Lang | null
  setLang: (lang: Lang) => void
  mode: Mode
  chapter: number
  autoplay: boolean
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
  probe: UV | null
  autoRotate: boolean
  tab: SidebarTab
  resetNonce: number
  /** camera framing chosen by the story; null hands control to the user */
  shot: Shot | null
  plate: Plate
  setPlate: (plate: Plate) => void
  setWorld: (world: World) => void
  setMode: (mode: Mode) => void
  setChapter: (chapter: number) => void
  setAutoplay: (on: boolean) => void
  setLayer: (layer: LayerId) => void
  setTarget: (target: TargetId) => void
  setTwin: (twin: boolean) => void
  setSide: (side: Side) => void
  setHour: (hour: number) => void
  setExag: (exag: number) => void
  setProbe: (probe: UV | null) => void
  setAutoRotate: (on: boolean) => void
  setTab: (tab: SidebarTab) => void
  setShot: (shot: Shot | null) => void
  resetView: () => void
}

// Deep links: ?lang=tr&mode=explore&layer=score&target=tranq&hour=16.6&twin=1&chapter=3
const params = new URLSearchParams(window.location.search)
const LAYER_IDS: LayerId[] = ['terrain', 'thermal', 'swing', 'radar', 'slope', 'score']
const TARGET_IDS: TargetId[] = ['arsia', 'tranq', 'shackleton']
const pick = <T extends string>(key: string, allowed: T[], fallback: T) => {
  const value = params.get(key) as T | null
  return value && allowed.includes(value) ? value : fallback
}
const initialHour = Number(params.get('hour'))
const initialMode = pick<Mode>('mode', ['story', 'explore'], 'story')
const initialLang = params.get('lang')

export const useStore = create<State>((set) => ({
  world: null,
  lang: initialLang === 'tr' || initialLang === 'en' ? initialLang : null,
  setLang: (lang) => set({ lang }),
  mode: initialMode,
  chapter: Math.max(0, Number(params.get('chapter')) || 0),
  autoplay: false,
  layer: pick('layer', LAYER_IDS, 'thermal'),
  target: pick('target', TARGET_IDS, 'arsia'),
  twin: params.get('twin') === '1',
  side: 'earth',
  hour: initialHour >= 6.8 && initialHour <= 17.2 ? initialHour : 13.5,
  exag: 4,
  probe: null,
  autoRotate: initialMode === 'explore',
  tab: 'fingerprint',
  resetNonce: 0,
  shot: null,
  plate: { kind: 'terrain' },
  setPlate: (plate) => set({ plate }),
  setWorld: (world) => set({ world }),
  setMode: (mode) =>
    set((s) =>
      mode === 'explore'
        ? {
            mode,
            autoplay: false,
            shot: null,
            plate: { kind: 'terrain' },
            twin: false,
            autoRotate: true,
            resetNonce: s.resetNonce + 1,
          }
        : { mode, autoRotate: false },
    ),
  setChapter: (chapter) => set({ chapter }),
  setAutoplay: (autoplay) => set({ autoplay }),
  setLayer: (layer) => set({ layer }),
  setTarget: (target) => set({ target }),
  setTwin: (twin) => set({ twin }),
  setSide: (side) => set({ side, probe: null }),
  setHour: (hour) => set({ hour }),
  setExag: (exag) => set({ exag }),
  setProbe: (probe) => set({ probe }),
  setAutoRotate: (autoRotate) => set({ autoRotate }),
  setTab: (tab) => set({ tab }),
  setShot: (shot) => set({ shot }),
  resetView: () =>
    set((s) => ({ resetNonce: s.resetNonce + 1, autoRotate: true })),
}))
