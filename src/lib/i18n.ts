import { useStore } from '../store'

export type Lang = 'en' | 'tr'

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
  tagline: 'Ay ve Mars analoğu olarak Karacadağ',
  view: 'Görünüm',
  evidence: {
    field: 'Sahada ölçüldü',
    orbit: 'Yörüngeden ölçüldü',
    lab: 'Yayımlanmış laboratuvar analizi',
    demo: 'Temsili †',
  },
  play: 'Oynat',
  pause: 'Duraklat',
  previous: 'Önceki',
  next: 'Sonraki',
  openData: 'Veriyi Aç',
  chapters: 'Bölümler',
  page: (kicker, i, n) => `${kicker}, sayfa ${i} / ${n}`,
  scanLoading: (n) => `${n} nokta yükleniyor`,
  scanFailed: 'Tarama yüklenemedi.',
  retry: 'Yeniden Dene',
  dataFailed: 'Veri yüklenemedi.',
  ranking: 'Arsia Mons ile arazi benzerliği, 100 üzerinden. Karacadağ kalın yazılı.',
  year: 'Yörüngeden yüzey sıcaklığı, Kasım 2025 – Ekim 2026. Sarı nokta, çukurda kendi ölçümümüz.',
  yearDay: '13.30',
  yearNight: '01.30',
  yearPit: (t) => `çukurumuz, ${t}°`,
  shadow: 'Güneş yüksekliğine göre gölgede kalan zemin oranı.',
  shackleton: 'Shackleton',
  karacadag: 'Karacadağ',
  dayRock: 'güneş alan kaya †',
  dayAir: 'hava †',
  dayPit: 'çukur tabanı †',
  dayIn: (t) => `çukurda ${t}°`,
  dayOut: (t) => `dışarıda ${t}°`,
  dayLogged: 'termometreler yerinde bırakıldı',
  dayCaption: (date, moonSwing, moonPit) =>
    `Sarı noktalar: kendi ölçümümüz, ${date}, saat 15.00 suları. Termometreler sonra gece boyunca, içeride ve dışarıda, 06.00'ya kadar yerinde kaldı; o kayıt henüz girilmedi. † Kesikli eğriler temsilidir. Ay'da yüzey yaklaşık ${moonSwing} K oynarken, modellenen çukur tabanı ${moonPit} °C civarında kalıyor.`,
  catWidth: 'genişlik',
  catDepth: 'derinlik, m',
  catOurs: (w, d) => `Karacadağ, ${w} × ${d} m`,
  catCaption:
    'İçi boş gri: Ay. İçi boş kırmızı: Mars. Kesikli çizgi: derinliğin genişliğin yarısına eşit olduğu yer. † Ay ve Mars noktaları, yayımlanmış katalogların yerini tutan temsili noktalardır. Bizimki taramadan ölçüldü.',
  rockRows: { arsia: 'Mars bazaltı (Spirit, Gusev)', tranq: 'Ay denizi bazaltı (Apollo 11)', shackleton: 'Ay yayla toprağı (Apollo 16)' },
  rockControl: (v) => `Mars bazaltı ile Ay bazaltı: ${v}`,
  rockCaption: 'On ana oksidin Ovabağ lavıyla benzerliği, 100 üzerinden. Köşeli aralık, dört Karacadağ örneğinin dağılımı.',
}

export const UI = { en, tr }

/** Strings and number formatting for the chosen language. */
export function useT() {
  const lang = useStore((s) => s.lang) ?? 'en'
  return { lang, t: UI[lang], num: formatter(lang) }
}

export const formatter =
  (lang: Lang) =>
  (value: number, digits = 0) =>
    value.toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US', {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    })
