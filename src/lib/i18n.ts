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
    lab: 'Published data',
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
  yearDay: 'Day, 13:30',
  yearNight: 'Night, 01:30',
  yearGap: (k: string) => `${k} °C between day and night`,
  yearPit: (t: string) => `in the pit, 14 Nov: ${t} °C`,
  year: 'Surface temperature of the lava field from orbit: VIIRS monthly means, November 2025 to October 2026. The upper line is the 13:30 overpass, the lower one 01:30; the grey band between them is the day–night difference. The yellow dot is what we read in the pit.',
  shadow: 'Share of ground in shadow, by sun elevation.',
  shackleton: 'Shackleton',
  karacadag: 'Karacadağ',
  nightOutside: 'air outside',
  nightPit: 'pit floor, calculated',
  nightWindow: 'thermometers in place, 16:00 to 06:00',
  nightDays: ['14 Nov', '15 Nov'] as [string, string],
  nightIn: (t: string) => `${t} °C in the pit`,
  nightOut: (t: string) => `${t} °C outside`,
  nightCaption: (drop: string, share: string, lag: number, moonSwing: number, moonPit: number) =>
    `Yellow dots: our own readings. Grey line: hourly air temperature for the site (Open-Meteo weather data), shifted to pass through our outside reading; it fell ${drop} °C by 06:00. Dashed line: the pit floor, calculated from that air temperature, following the outside air at ${share} of its amplitude, ${lag} hours late. On the Moon the surface swings about ${moonSwing} K while pit floors hold near ${moonPit} °C (Horvath et al. 2022).`,
  catWidth: 'width, m',
  catDepth: 'depth, m',
  catOurs: (w: string, d: string) => `Karacadağ, ${w} × ${d} m`,
  catRatio: 'depth = half the width',
  catCaption:
    'Grey: pits on the Moon (LROC). Red: skylights on the flank of Arsia Mons (Cushing et al. 2007); the arrows mark minimum depths, because the floors lie in shadow. Yellow: our pit, measured from the scan. Both axes are logarithmic.',
  rockRows: { arsia: 'Mars basalt (Spirit, Gusev)', tranq: 'Moon mare basalt (Apollo 11)', shackleton: 'Moon highland soil (Apollo 16)' },
  rockControl: (v: number) => `Mars basalt vs Moon basalt: ${v}`,
  rockCaption: 'Match of ten major oxides with Ovabağ lava, out of 100. The bracket is the range across four Karacadağ samples.',
}

const tr: typeof en = {
  findings: 'Bulgular',
  data: 'Veri',
  tagline: 'Karacadağ: Ay ve Mars için Dünya’daki benzer saha',
  view: 'Görünüm',
  evidence: {
    field: 'Saha ölçümümüz',
    orbit: 'Uydu verisi',
    lab: 'Yayımlanmış veri',
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
  ranking: 'Arsia Mons ile arazi benzerliği, 100 üzerinden. Karacadağ koyu yazılmıştır.',
  yearDay: 'Gündüz, 13.30',
  yearNight: 'Gece, 01.30',
  yearGap: (k) => `gündüz–gece farkı ${k} °C`,
  yearPit: (t) => `çukurda, 14 Kasım: ${t} °C`,
  year: 'Lav alanının uydudan ölçülen yüzey sıcaklığı: VIIRS aylık ortalamaları, Kasım 2025 – Ekim 2026. Üstteki çizgi 13.30, alttaki 01.30 geçişine aittir; aradaki gri alan gündüz–gece farkıdır. Sarı nokta, çukurda ölçtüğümüz değerdir.',
  shadow: 'Güneş yüksekliğine göre gölgede kalan zemin oranı.',
  shackleton: 'Shackleton',
  karacadag: 'Karacadağ',
  nightOutside: 'dış hava',
  nightPit: 'çukur tabanı, hesaplanan',
  nightWindow: 'termometrelerin kayıt aralığı, 16.00–06.00',
  nightDays: ['14 Kasım', '15 Kasım'],
  nightIn: (t) => `çukurda ${t} °C`,
  nightOut: (t) => `dışarıda ${t} °C`,
  nightCaption: (drop, share, lag, moonSwing, moonPit) =>
    `Sarı noktalar kendi ölçümlerimizdir. Gri çizgi, bölgenin saatlik hava sıcaklığını gösterir (Open-Meteo hava verisi); dışarıda ölçtüğümüz değere göre kaydırılmıştır ve sabah 06.00’ya kadar ${drop} °C düşmüştür. Kesikli çizgi, bu hava sıcaklığından hesaplanan çukur tabanıdır: dış havadaki değişimin ${share} kadarını ${lag} saat gecikmeyle izler. Ay’da yüzey sıcaklığı yaklaşık ${moonSwing} K değişirken çukur tabanları ${moonPit} °C dolayında kalır (Horvath vd. 2022).`,
  catWidth: 'genişlik, m',
  catDepth: 'derinlik, m',
  catOurs: (w, d) => `Karacadağ, ${w} × ${d} m`,
  catRatio: 'derinlik = genişliğin yarısı',
  catCaption:
    'Gri noktalar Ay’daki çukurlardır (LROC). Kırmızılar, Arsia Mons’un yamacındaki tavan açıklıklarıdır (Cushing vd. 2007); tabanları gölgede kaldığından oklar en az derinliği gösterir. Sarı nokta, taramadan ölçtüğümüz çukurdur. İki eksen de logaritmiktir.',
  rockRows: { arsia: 'Mars bazaltı (Spirit, Gusev)', tranq: 'Ay bazaltı (Apollo 11)', shackleton: 'Ay yayla toprağı (Apollo 16)' },
  rockControl: (v) => `Mars bazaltı ile Ay bazaltı arasındaki benzerlik: ${v}`,
  rockCaption:
    'Ovabağ lavı ile kimyasal benzerlik, 100 üzerinden. Çubukların üzerindeki aralık, dört ayrı Karacadağ örneğinden elde edilen en düşük ve en yüksek değeri gösterir.',
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
