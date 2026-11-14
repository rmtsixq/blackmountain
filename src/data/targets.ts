// The three places Karacadağ is compared with.
//
// Topography and illumination are computed from real elevation (see
// src/lib/analysis.ts) and are not stored here. This file holds what cannot be
// computed from the rasters we have:
//   - published surface-temperature swings (for the thermal axis)
//   - PLACEHOLDER scores for radar and composition, marked † in the UI,
//     until co-registered Moon / Mars products are added
//   - where each analogy breaks, written from published facts

export type TargetId = 'arsia' | 'tranq' | 'shackleton'
export type AxisId = 'topo' | 'illumination' | 'thermal' | 'radar' | 'composition'

export interface AxisMeta {
  id: AxisId
  label: string
  short: string
  earthSensor: string
}

export const AXES: AxisMeta[] = [
  { id: 'topo', label: 'Topography', short: 'Terrain', earthSensor: 'SRTM elevation' },
  { id: 'illumination', label: 'Illumination', short: 'Light', earthSensor: 'Sun on the DEM' },
  { id: 'thermal', label: 'Thermal swing', short: 'Thermal', earthSensor: 'VIIRS day and night' },
  { id: 'radar', label: 'Radar roughness', short: 'Radar', earthSensor: 'Sentinel-1 C-band' },
  { id: 'composition', label: 'Composition', short: 'Rock', earthSensor: 'Published petrology' },
]

interface Placeholder {
  score: number
  twinSensor: string
  twin: string
}

export interface SceneLabel {
  u: number
  v: number
  text: string
}

export interface Target {
  id: TargetId
  body: 'Mars' | 'Moon'
  name: string
  /** what the 62 km square shows */
  place: string
  coords: string
  summary: string
  /** real elevation product behind the twin terrain */
  demSource: string
  labels: SceneLabel[]
  /** published day–night surface temperature swing, K */
  swingK: number
  swingText: string
  swingSource: string
  radar: Placeholder
  composition: Placeholder & { earth: string }
  notes: Record<AxisId, string>
}

export const TARGETS: Target[] = [
  {
    id: 'arsia',
    body: 'Mars',
    name: 'Arsia Mons',
    place: 'north flank, Tharsis',
    coords: '6.3°S 240.0°E',
    summary:
      'A basaltic shield flank in the area where candidate cave skylights were reported from orbit (Cushing et al. 2007). Same rock family and flow morphology as Karacadağ, at ten times the size.',
    demSource: 'MOLA + HRSC blend, 200 m',
    labels: [{ u: 0.5, v: 0.5, text: 'Arsia Mons, north flank' }],
    swingK: 100,
    swingText: 'about 100 K per sol',
    swingSource: 'Mars orbital thermal IR (TES / THEMIS)',
    radar: { score: 70, twinSensor: 'SHARAD · HiRISE rock counts', twin: 'Rock abundance 10–20%' },
    composition: {
      score: 63,
      earth: 'Alkali basalt, olivine-bearing',
      twinSensor: 'CRISM · TES',
      twin: 'Tholeiitic basalt under dust',
    },
    notes: {
      topo: 'Arsia is about 435 km wide and Karacadağ a tenth of that: the match holds for a 62 km window of flank, not for the whole edifice.',
      illumination: 'Earth’s sky scatters light into shadows. Martian shadows are harder and skylight interiors darker.',
      thermal: 'A thin CO₂ atmosphere lets the Martian surface swing about five times further than Karacadağ does under one bar of air.',
      radar: 'Tharsis flows carry a dust mantle metres thick in places; Ovabağ flows are bare or soil-covered.',
      composition: 'Karacadağ lavas are alkaline, and liquid water and vegetation weather them in ways Mars does not.',
    },
  },
  {
    id: 'tranq',
    body: 'Moon',
    name: 'Mare Tranquillitatis Pit',
    place: 'lunar mare, near side',
    coords: '8.34°N 33.22°E',
    summary:
      'A collapse pit about 100 m across in mare basalt, a candidate entrance to a lava tube. LRO Diviner shows its shaded floor holding near 17 °C. The pit itself is smaller than one cell of this grid; the terrain shown is the mare around it.',
    demSource: 'LRO LOLA, 118 m',
    labels: [{ u: 0.5, v: 0.5, text: 'Tranquillitatis pit' }],
    swingK: 290,
    swingText: 'about 290 K (≈ 390 K noon, ≈ 95 K before dawn)',
    swingSource: 'LRO Diviner, equatorial surface (Williams et al. 2017)',
    radar: { score: 55, twinSensor: 'LRO Mini-RF', twin: 'Elevated CPR at the pit rim' },
    composition: {
      score: 71,
      earth: 'Alkali basalt',
      twinSensor: 'Chandrayaan-1 M³',
      twin: 'High-titanium mare basalt',
    },
    notes: {
      topo: 'A mare plain is far flatter than any volcano flank. In one-sixth gravity, lunar tubes can also be far wider than any on Earth.',
      illumination: 'No sky glow on the Moon: shadow edges are absolute, and a 14-day night follows each day.',
      thermal: 'The lunar surface swings about 290 K in vacuum; Karacadağ, under air and moisture, moves a small fraction of that.',
      radar: 'Lunar regolith is impact-gardened powder. There is no terrestrial equivalent of metres of fine regolith on a lava flow.',
      composition: 'Both are basalt, but mare lavas are dry and titanium-rich: no hydrated minerals, no organics.',
    },
  },
  {
    id: 'shackleton',
    body: 'Moon',
    name: 'Shackleton Connecting Ridge',
    place: 'lunar south pole',
    coords: '89.45°S 222.69°E',
    summary:
      'The ridge between Shackleton and de Gerlache craters, the region targeted for the first Moon Base missions. The south pole and Shackleton crater are inside this square.',
    demSource: 'LRO LOLA polar model, 20 m',
    labels: [
      { u: 0.5, v: 0.5, text: 'Connecting ridge' },
      { u: 0.806, v: 0.405, text: 'Shackleton' },
      { u: 0.682, v: 0.302, text: 'South pole' },
    ],
    swingK: 150,
    swingText: 'well over 100 K between sunlit ridge and neighbouring cold traps',
    swingSource: 'LRO Diviner polar maps',
    radar: { score: 40, twinSensor: 'LRO Mini-RF', twin: 'Mature highland regolith' },
    composition: {
      score: 18,
      earth: 'Alkali basalt',
      twinSensor: 'M³ · LEND',
      twin: 'Anorthositic highlands',
    },
    notes: {
      topo: 'A ridge between impact craters, not a volcanic flank. Crater walls here are steeper than almost anything on a basalt shield.',
      illumination: 'Karacadağ gets about 40 minutes of grazing light a day. At the pole the sun circles the horizon for months and never climbs above about 1.5°.',
      thermal: 'Nothing on Earth approaches cryogenic cold-trap temperatures. Only the trapping mechanism compares, not the numbers.',
      radar: 'Boulder fields exist on the ridge, but the matrix is fine anorthositic regolith, not lava.',
      composition: 'Wrong rock entirely: bright feldspar-rich crust against dark iron-rich basalt.',
    },
  },
]

export const targetById = (id: TargetId) => TARGETS.find((t) => t.id === id)!

export const EARTH_LIMITS = [
  {
    title: 'Gravity',
    text: 'Earth cannot reproduce 0.17 g (Moon) or 0.38 g (Mars). Tube widths, dust behaviour and mobility do not transfer directly.',
  },
  {
    title: 'Atmosphere',
    text: 'One bar of air scatters light into shadows, damps temperature extremes and carries moisture. The Moon has vacuum; Mars has under 1% of our pressure.',
  },
  {
    title: 'Radiation',
    text: 'Our magnetosphere and atmosphere block the radiation that makes tubes attractive as shelters in the first place.',
  },
  {
    title: 'Water and life',
    text: 'Ovabağ tubes are humid and inhabited. Rain, soil and vegetation alter the basalt at rates unknown on either target.',
  },
  {
    title: 'Sensors',
    text: 'The four elevation models differ in native resolution (Earth 30 m, Moon 118 m and 20 m, Mars 200 m). All statistics are taken at a 480 m baseline so none is flattered by detail.',
  },
]
