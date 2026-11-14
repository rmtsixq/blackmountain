import type { TargetId } from '../data/targets'
import type { LayerId } from './layers'
import type { Shot } from '../store'

export interface TourStep {
  /** seconds from the start */
  at: number
  caption?: string
  layer?: LayerId
  target?: TargetId
  twin?: boolean
  shot?: Shot
  /** move the sun to this hour over `sweep` seconds */
  hour?: number
  sweep?: number
}

const WIDE: Shot = { position: [-54, 58, 142], target: [0, -5, 8] }
const FLOWS: Shot = { position: [66, 26, 62], target: [10, 2, 2] }
const TWIN: Shot = { position: [-78, 44, 104], target: [0, 0, 4] }
const POLE: Shot = { position: [58, 46, 104], target: [8, 0, -4] }
const ABOVE: Shot = { position: [-6, 150, 74], target: [0, 0, 8] }

export const TOUR_LENGTH = 40

/** A 40-second walk through the argument, paced for a screen recording. */
export const TOUR: TourStep[] = [
  {
    at: 0,
    layer: 'terrain',
    twin: false,
    shot: WIDE,
    hour: 8,
    sweep: 0.1,
    caption: 'Karacadağ, southeast Türkiye. A basalt shield volcano, drawn from real elevation.',
  },
  { at: 1.5, hour: 16.6, sweep: 5 },
  {
    at: 6.5,
    caption: 'The real sun of 14 November, down to grazing light. At the lunar south pole there is no other kind.',
  },
  {
    at: 11.5,
    layer: 'thermal',
    hour: 13.5,
    sweep: 1.5,
    shot: FLOWS,
    caption: 'VIIRS at 13:30. The young Ovabağ lava flows are the hottest ground on the mountain.',
  },
  { at: 16.5, layer: 'radar', caption: 'Sentinel-1 radar, independently: the same flows are the roughest.' },
  {
    at: 21,
    layer: 'terrain',
    target: 'arsia',
    twin: true,
    shot: TWIN,
    caption: 'Same 62 km square, same vertical scale. This is Arsia Mons, on Mars.',
  },
  { at: 26, twin: false },
  {
    at: 27.2,
    target: 'shackleton',
    twin: true,
    shot: POLE,
    hour: 16.6,
    sweep: 2,
    caption: 'And the Shackleton ridge at the lunar south pole, where the Moon Base is planned.',
  },
  {
    at: 33,
    twin: false,
    target: 'arsia',
    layer: 'score',
    hour: 13.5,
    sweep: 1,
    shot: ABOVE,
    caption: 'Computed from both elevation models: where on Karacadağ the ground is closest to Mars.',
  },
]
