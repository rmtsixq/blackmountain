import { useStore } from '../store'
import { TR } from './tr'

export type Lang = 'en' | 'tr'

/** Looks a string up by its English text and fills `{name}` slots. */
export type Translate = (text: string, vars?: Record<string, string | number>) => string

const fill = (text: string, vars?: Record<string, string | number>) =>
  vars ? text.replace(/\{(\w+)\}/g, (slot, key: string) => (key in vars ? String(vars[key]) : slot)) : text

/** English is the source; a missing Turkish entry falls back to it. */
export const translator =
  (lang: Lang): Translate =>
  (text, vars) =>
    fill(lang === 'tr' ? (TR[text] ?? text) : text, vars)

// Findings interface strings. The Data view goes through `x` and ./tr.ts.
const en = {
  findings: 'Findings',
  data: 'Data',
  tagline: 'Karacadağ as a Moon and Mars analog',
  view: 'View',
  evidence: {
    field: 'Measured on foot',
    orbit: 'Measured from orbit',
    lab: 'Published lab analyses',
    demo: 'Illustrative †',
  },
  play: 'Play',
  pause: 'Pause',
  previous: 'Previous',
  next: 'Next',
  openData: 'Open the Data',
  chapters: 'Chapters',
  page: (kicker: string, i: number, n: number) => `${kicker}, page ${i} of ${n}`,
  scanLoading: (n: string) => `Loading ${n} points`,
  scanFailed: 'The scan did not load.',
  retry: 'Try Again',
  dataFailed: 'The data did not load.',
  ranking: 'Terrain match with Arsia Mons, out of 100. Karacadağ in bold.',
  year: 'Surface temperature from orbit, Nov 2025 – Oct 2026. The yellow dot is our own reading in the pit.',
  yearDay: '13:30',
  yearNight: '01:30',
  yearPit: (t: string) => `our pit, ${t}°`,
  shadow: 'Share of ground in shadow, by sun elevation.',
  shackleton: 'Shackleton',
  karacadag: 'Karacadağ',
  dayRock: 'sunlit rock †',
  dayAir: 'air †',
  dayPit: 'pit floor †',
  dayIn: (t: string) => `${t}° in the pit`,
  dayOut: (t: string) => `${t}° outside`,
  dayLogged: 'thermometers left in place',
  dayCaption: (date: string, moonSwing: number, moonPit: number) =>
    `Yellow dots: our reading, ${date}, about 15:00. The thermometers then stayed overnight, inside and outside, until 06:00; that record is not entered yet. † Dashed curves are illustrative. On the Moon the surface swings about ${moonSwing} K while the modelled pit floor holds near ${moonPit} °C.`,
  catWidth: 'width',
  catDepth: 'depth, m',
  catOurs: (w: string, d: string) => `Karacadağ, ${w} × ${d} m`,
  catCaption:
    'Hollow grey: Moon. Hollow red: Mars. Dashed line: depth equal to half the width. † The Moon and Mars points are illustrative stand-ins for the published catalogues. Ours is measured from the scan.',
  rockRows: { arsia: 'Mars basalt (Spirit, Gusev)', tranq: 'Moon mare basalt (Apollo 11)', shackleton: 'Moon highland soil (Apollo 16)' },
  rockControl: (v: number) => `Mars basalt vs Moon basalt: ${v}`,
  rockCaption: 'Match of ten major oxides with Ovabağ lava, out of 100. The bracket is the range across four Karacadağ samples.',
}

const tr: typeof en = {
  findings: 'Bulgular',
  data: 'Veri',
  tagline: 'Karacadağ: Ay’ın ve Mars’ın Dünya’daki benzeri',
  view: 'Görünüm',
  evidence: {
    field: 'Kendi ölçümümüz',
    orbit: 'Uydu verisi',
    lab: 'Yayımlanmış analizler',
    demo: 'Temsili veri †',
  },
  play: 'Oynat',
  pause: 'Duraklat',
  previous: 'Önceki',
  next: 'Sonraki',
  openData: 'Veriyi Aç',
  chapters: 'Bölümler',
  page: (kicker, i, n) => `${kicker}, ${i}/${n}`,
  scanLoading: (n) => `${n} nokta yükleniyor`,
  scanFailed: 'Tarama yüklenemedi.',
  retry: 'Yeniden Dene',
  dataFailed: 'Veri yüklenemedi.',
  ranking: 'Arsia Mons’a arazi benzerliği, 100 üzerinden. Karacadağ koyu yazılı.',
  year: 'Uydudan ölçülen yüzey sıcaklığı, Kasım 2025 – Ekim 2026. Sarı nokta, çukurda bizim ölçtüğümüz değer.',
  yearDay: '13.30',
  yearNight: '01.30',
  yearPit: (t) => `bizim çukur, ${t}°`,
  shadow: 'Güneş alçaldıkça gölgede kalan zeminin oranı.',
  shackleton: 'Shackleton',
  karacadag: 'Karacadağ',
  dayRock: 'güneş gören kaya †',
  dayAir: 'hava †',
  dayPit: 'çukur tabanı †',
  dayIn: (t) => `çukurda ${t}°`,
  dayOut: (t) => `dışarıda ${t}°`,
  dayLogged: 'termometreler bu saatlerde yerindeydi',
  dayCaption: (date, moonSwing, moonPit) =>
    `Sarı noktalar bizim ölçümümüz: ${date}, saat 15.00 civarı. Termometreleri sonra içeride ve dışarıda bırakıp ertesi sabah 06.00’da aldık; o kaydı henüz buraya işlemedik. † Kesikli eğriler temsilidir, beklediğimiz biçimi gösterir. Karşılaştırma için: Ay’da yüzey sıcaklığı yaklaşık ${moonSwing} derece oynarken, modellere göre çukurun tabanı ${moonPit} °C civarında sabit kalıyor.`,
  catWidth: 'genişlik',
  catDepth: 'derinlik (m)',
  catOurs: (w, d) => `Karacadağ, ${w} × ${d} m`,
  catCaption:
    'İçi boş gri noktalar Ay, kırmızılar Mars. Kesikli çizgi, derinliğin genişliğin yarısı olduğu yerleri gösteriyor. † Ay ve Mars noktaları temsilidir; gerçek kataloglar eklenince yerlerini onlar alacak. Sarı nokta bizim çukur, taramadan ölçüldü.',
  rockRows: { arsia: 'Mars bazaltı (Spirit, Gusev)', tranq: 'Ay bazaltı (Apollo 11)', shackleton: 'Ay yayla toprağı (Apollo 16)' },
  rockControl: (v) => `Mars bazaltı ile Ay bazaltı arası: ${v}`,
  rockCaption:
    'Ovabağ lavına kimyasal benzerlik, 100 üzerinden. Çubukların üzerindeki aralık, dört ayrı Karacadağ örneğinin verdiği en düşük ve en yüksek değer.',
}

export const UI = { en, tr }

export const formatter =
  (lang: Lang) =>
  (value: number, digits = 0) =>
    value.toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US', {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    })

/** Strings, lookup and number formatting for the chosen language. */
export function useT() {
  const lang = useStore((s) => s.lang) ?? 'en'
  const num = formatter(lang)
  /** a share out of 100, written the way the language writes it */
  const pct = (value: number, digits = 0) => (lang === 'tr' ? `%${num(value, digits)}` : `${num(value, digits)}%`)
  return { lang, t: UI[lang], x: translator(lang), num, pct }
}
