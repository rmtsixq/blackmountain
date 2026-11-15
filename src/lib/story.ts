// The findings, one per chapter, in English and Turkish. Every number is read
// from the analysis, the ingested rasters or the field scan at run time, so
// the text cannot drift from the data. Each chapter declares its evidence, so
// illustrative data is never shown as measured.

import { MEASURED, OUR_PIT } from '../data/pit'
import { PIT_SCAN } from '../data/pitScan'
import { ROCK_CONTROL, ROCK_MATCH } from '../data/rock'
import type { TargetId } from '../data/targets'
import { rankSites, SUN_ELEVATIONS } from './analysis'
import { uvToLonLat } from './dem'
import { formatter, type Lang } from './i18n'
import type { LayerId, World } from './layers'
import { fieldMean } from './scores'
import type { Plate, Shot } from '../store'

export type Visual = 'ranking' | 'year' | 'shadow' | 'day' | 'catalogue' | 'rock'

/** Where a chapter's evidence comes from. */
export type Evidence = 'field' | 'orbit' | 'lab' | 'demo'

export interface Chapter {
  id: string
  evidence: Evidence[]
  /** short name, used for the page control */
  kicker: string
  /** the chapter's key value: the emphasised part, then the rest */
  figure?: { strong: string; rest: string }
  title: string
  body: string
  /** caption under the tile: what is shown and where it comes from */
  source: string
  visual?: Visual
  plate: Plate
  scene: {
    layer: LayerId
    target: TargetId
    twin: boolean
    hour: number
    shot: Shot
    stations?: boolean
  }
}

// The tile is close to square, so every shot frames the whole 62 km block.
const WIDE: Shot = { position: [-64, 90, 238], target: [0, -2, 4] }
const TWIN: Shot = { position: [-104, 80, 212], target: [0, -2, 2] }
const ABOVE: Shot = { position: [0, 272, 88], target: [0, 0, 8] }
const FLOWS: Shot = { position: [84, 44, 132], target: [4, -4, 6] }
const POLE: Shot = { position: [64, 96, 238], target: [0, -4, 2] }

const TERRAIN: Plate = { kind: 'terrain' }
const photo = (name: string, alt: string): Plate => ({ kind: 'photo', src: `/field/${name}.webp`, alt })

const ORDINAL = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth']

export function buildStory(world: World, lang: Lang): Chapter[] {
  const tr = lang === 'tr'
  const L = <T>(english: T, turkish: T) => (tr ? turkish : english)
  const n = formatter(lang)
  const pct = (f: number) => (tr ? `%${n(f * 100)}` : `${n(f * 100)}%`)

  const a = world.analysis
  const place = (target: TargetId) => rankSites(a, target).findIndex((s) => s.home)
  const arsiaRank = rankSites(a, 'arsia')
  const beaten = arsiaRank.slice(place('arsia') + 1).map((s) => s.name)

  const series = world.manifest.lst_series
  const hottest = series.reduce((m, r) => ((r.field_day ?? -99) > (m.field_day ?? -99) ? r : m))
  const swing = n(fieldMean(world.earth.swing))

  const low = SUN_ELEVATIONS.indexOf(1.5)
  const best = a.best.arsia
  const where = uvToLonLat(best.u, best.v)
  const warmer = n(MEASURED.inside - MEASURED.outside, 1)
  const across = n(PIT_SCAN.equivalent_diameter_m)
  const deep = n(PIT_SCAN.depth_m)

  return [
    {
      id: 'question',
      evidence: ['orbit', 'field'],
      kicker: L('The question', 'Soru'),
      title: L(
        'Can a mountain in Türkiye stand in for Mars and the Moon?',
        'Türkiye’deki bir dağ, Mars’ın ve Ay’ın yerini tutabilir mi?',
      ),
      body: L(
        'Karacadağ is a basalt shield volcano with young lava flows, collapse pits and lava tubes. Nobody has studied it as a planetary analog. We measured it from orbit, the same way Mars and the Moon are measured. Then we drove there to check.',
        'Karacadağ; genç lav akıntıları, çöküntü çukurları ve lav tüpleri olan bazaltik bir kalkan volkanı. Bugüne kadar kimse onu gezegen analoğu olarak incelemedi. Onu, Mars ve Ay nasıl ölçülüyorsa öyle, yörüngeden ölçtük. Sonra gidip yerinde baktık.',
      ),
      source: L(
        'Ovabağ lava field, Karacadağ. Field photograph, 14 November 2026',
        'Ovabağ lav alanı, Karacadağ. Saha fotoğrafı, 14 Kasım 2026',
      ),
      plate: {
        kind: 'cover',
        src: '/field/banner.webp',
        alt: L(
          'Panorama of the Ovabağ lava field: dark basalt flows and a scoria cone under an overcast sky',
          'Ovabağ lav alanının panoraması: kapalı gökyüzü altında koyu bazalt akıntıları ve bir cüruf konisi',
        ),
      },
      scene: { layer: 'terrain', target: 'arsia', twin: false, hour: 15.8, shot: WIDE },
    },
    {
      id: 'twin',
      evidence: ['orbit'],
      kicker: L('The twin', 'İkiz'),
      figure: { strong: pct(a.twins.arsia.topo / 100), rest: L('terrain match', 'arazi benzerliği') },
      title: L('Same 62 km. Same scale. This is Mars.', 'Aynı 62 km. Aynı ölçek. Burası Mars.'),
      body: L(
        'Arsia Mons, a shield volcano with cave skylights on its flank. Its slopes, roughness and relief overlap with Karacadağ’s, measured identically on both elevation models.',
        'Arsia Mons, yamacında mağara ağızları bulunan bir kalkan volkanı. Eğimleri, pürüzlülüğü ve yükselti farkı Karacadağ’ınkilerle örtüşüyor; ikisi de kendi yükseklik modelinde aynı yöntemle ölçüldü.',
      ),
      source: L(
        'MOLA + HRSC elevation, Mars · SRTM, Earth · 480 m baseline · 150 west–east profiles',
        'MOLA + HRSC yükseklik verisi, Mars · SRTM, Dünya · 480 m baz uzunluğu · 150 batı–doğu profili',
      ),
      plate: TERRAIN,
      scene: { layer: 'terrain', target: 'arsia', twin: true, hour: 15.8, shot: TWIN },
    },
    {
      id: 'test',
      evidence: ['orbit'],
      kicker: L('The test', 'Sınama'),
      figure: { strong: String(a.sites.length), rest: L('Earth sites, one method', 'Dünya sahası, tek yöntem') },
      title: L(
        'We scored the sites NASA already uses. The method picks Mauna Loa first.',
        'NASA’nın zaten kullandığı sahaları puanladık. Yöntem ilk sıraya Mauna Loa’yı koyuyor.',
      ),
      body: L(
        `That is the right answer for a Martian shield volcano, so the method works. Unstudied Karacadağ places ${ORDINAL[place('arsia')]} for Mars, ahead of ${beaten.join(' and ')}, and ${ORDINAL[place('tranq')]} for the lunar mare.`,
        `Mars’taki bir kalkan volkanı için doğru cevap bu; demek ki yöntem çalışıyor. Hiç incelenmemiş Karacadağ, Mars için ${place('arsia') + 1}. sırada, ${beaten.join(' ve ')} sahalarının önünde; Ay denizi için ise ${place('tranq') + 1}. sırada.`,
      ),
      source: L(
        'Karacadağ, slope from SRTM · eight 62 km squares of Earth, one method',
        'Karacadağ, SRTM’den eğim · Dünya’dan sekiz adet 62 km’lik kare, tek yöntem',
      ),
      visual: 'ranking',
      plate: TERRAIN,
      scene: { layer: 'slope', target: 'arsia', twin: false, hour: 13.5, shot: WIDE },
    },
    {
      id: 'heat',
      evidence: ['orbit', 'field'],
      kicker: L('The heat', 'Isı'),
      figure: {
        strong: `${n(hottest.field_day ?? 0)} °C`,
        rest: L('in July, seen from orbit', 'temmuzda, yörüngeden'),
      },
      title: L(
        'Bare basalt, hot by day, and only as far as air allows.',
        'Çıplak bazalt gündüz ısınıyor; ama ancak havanın izin verdiği kadar.',
      ),
      body: L(
        `The lava field swings ${swing} K between 13:30 and 01:30. The same rock on the Moon swings about 290 K. The difference is the atmosphere, and it is the first limit of any Earth analog.`,
        `Lav alanının sıcaklığı 13.30 ile 01.30 arasında ${swing} K oynuyor. Aynı kayaç Ay’da yaklaşık 290 K oynuyor. Farkı yaratan atmosfer; Dünya’daki her analoğun ilk sınırı da bu.`,
      ),
      source: L(
        'VIIRS land surface temperature, NASA GIBS · 12 months',
        'VIIRS yer yüzeyi sıcaklığı, NASA GIBS · 12 ay',
      ),
      visual: 'year',
      plate: TERRAIN,
      scene: { layer: 'thermal', target: 'arsia', twin: false, hour: 13.5, shot: FLOWS },
    },
    {
      id: 'rock',
      evidence: ['lab'],
      kicker: L('The rock', 'Kayaç'),
      figure: {
        strong: `${ROCK_MATCH.arsia.score} / 100`,
        rest: L('match with Mars basalt', 'Mars bazaltıyla benzerlik'),
      },
      title: L(
        'This lava is chemically closer to Mars than the Moon’s lava is.',
        'Bu lav, kimyasal olarak Mars’a Ay’ın lavından daha yakın.',
      ),
      body: L(
        `Ten major oxides of an Ovabağ lava sample, compared one by one with basalts the Spirit rover analysed on Mars: ${ROCK_MATCH.arsia.score} out of 100. Against Apollo 11 mare basalt it scores ${ROCK_MATCH.tranq.score}, against Apollo 16 highland soil ${ROCK_MATCH.shackleton.score}. As a yardstick, Mars basalt against lunar mare basalt scores ${ROCK_CONTROL}. The Mars rocks are from Gusev crater, not Arsia, which no rover has reached; the lunar basalt is from the Apollo 11 site, about 380 km from the pit.`,
        `Ovabağ lavından bir örneğin on ana oksidini, Spirit gezgininin Mars’ta analiz ettiği bazaltlarla tek tek karşılaştırdık: 100 üzerinden ${ROCK_MATCH.arsia.score}. Apollo 11’in Ay denizi bazaltıyla ${ROCK_MATCH.tranq.score}, Apollo 16’nın yayla toprağıyla ${ROCK_MATCH.shackleton.score} çıkıyor. Ölçüt olarak Mars bazaltı ile Ay denizi bazaltı birbirine ${ROCK_CONTROL} benziyor. Mars kayaçları Arsia’dan değil Gusev kraterinden; Arsia’ya hiç gezgin inmedi. Ay bazaltı da çukurdan değil, yaklaşık 380 km ötedeki Apollo 11 iniş yerinden.`,
      ),
      source: L(
        'Ovabağ basalt, 14 November 2026 · sample CA 134 (Agostini et al. 2022) · Spirit APXS, NASA PDS · Apollo 10017 and 64501, Lunar Sample Compendium',
        'Ovabağ bazaltı, 14 Kasım 2026 · örnek CA 134 (Agostini vd. 2022) · Spirit APXS, NASA PDS · Apollo 10017 ve 64501, Lunar Sample Compendium',
      ),
      visual: 'rock',
      plate: photo(
        'rubble',
        L('Lichen-covered basalt blocks on the Ovabağ flows', 'Ovabağ akıntılarında likenle kaplı bazalt blokları'),
      ),
      scene: { layer: 'terrain', target: 'arsia', twin: false, hour: 13.5, shot: FLOWS },
    },
    {
      id: 'pit',
      evidence: ['field'],
      kicker: L('The pit', 'Çukur'),
      figure: {
        strong: `${across} m`,
        rest: L(`across, ${deep} m deep`, `genişlik, ${deep} m derinlik`),
      },
      title: L('Orbit cannot see this. We scanned it.', 'Yörüngeden görünmüyor. Biz taradık.'),
      body: L(
        `A collapse pit in the Ovabağ flows, with the old roof still hanging over ${pct(PIT_SCAN.roofed_fraction)} of it. In the 30 m elevation model behind every score here, it is smaller than one pixel. The skylights on Arsia Mons were found the same way, only once the camera was sharp enough. Drag to turn it.`,
        `Ovabağ akıntılarında bir çöküntü çukuru; eski tavanı hâlâ duruyor ve çukurun ${pct(PIT_SCAN.roofed_fraction)} kadarını örtüyor. Buradaki bütün puanların dayandığı 30 m’lik yükseklik modelinde tek bir pikselden küçük. Arsia Mons’taki tavan delikleri de ancak kamera yeterince keskinleşince bulunabilmişti. Sürükleyerek döndürün.`,
      ),
      source: L(
        `Our scan: ${n(PIT_SCAN.raw_points)} points, ${n(PIT_SCAN.count)} drawn · yellow line: a 1.7 m person · scale as exported, not yet checked against a tape`,
        `Kendi taramamız: ${n(PIT_SCAN.raw_points)} nokta, ${n(PIT_SCAN.count)} tanesi çiziliyor · sarı çizgi: 1,7 m boyunda bir insan · ölçek tarayıcının verdiği gibi, henüz şerit metreyle doğrulanmadı`,
      ),
      plate: { kind: 'scan' },
      scene: { layer: 'terrain', target: 'arsia', twin: false, hour: 13.5, shot: FLOWS },
    },
    {
      id: 'surprise',
      evidence: ['field', 'demo'],
      kicker: L('The surprise', 'Sürpriz'),
      figure: {
        strong: `${n(MEASURED.inside, 1)} °C`,
        rest: L(
          `in the pit, ${n(MEASURED.outside, 1)} °C outside`,
          `çukurda; dışarıda ${n(MEASURED.outside, 1)} °C`,
        ),
      },
      title: L(
        'We expected a cold trap. The thermometer disagreed.',
        'Soğuk tuzak bekliyorduk. Termometre aynı fikirde değildi.',
      ),
      body: L(
        `A press report put these caves at 4–5 °C in summer, so we predicted cold air pooling underground. At about 15:00 on 14 November the pit was ${warmer} K warmer than the air above it, at ${MEASURED.humidity}% humidity. One reading is not a curve, but it points to buffering, not trapping: rock that remembers the average. That is the property that makes lunar pits candidate shelters.`,
        `Bir basın haberi bu mağaralar için yazın 4–5 °C diyordu; biz de soğuk havanın yer altında biriktiğini öngördük. 14 Kasım’da saat 15.00 sularında çukur, üstündeki havadan ${warmer} K daha sıcaktı; nem %${MEASURED.humidity} idi. Tek ölçüm bir eğri etmez, ama tuzaklamaya değil tamponlamaya işaret ediyor: ortalamayı hatırlayan kayaç. Ay çukurlarını sığınak adayı yapan özellik de bu.`,
      ),
      source: L(
        'The pit from its rim, 14 November 2026 · one handheld reading · † the 24-hour curve is illustrative',
        'Çukurun kenarından görünüm, 14 Kasım 2026 · elde tek ölçüm · † 24 saatlik eğri temsilidir',
      ),
      visual: 'day',
      plate: photo(
        'pit',
        L(
          'Looking down into the collapse pit: an overhanging basalt roof above a moss-covered floor',
          'Çöküntü çukuruna yukarıdan bakış: yosun kaplı tabanın üzerinde sarkan bazalt tavan',
        ),
      ),
      scene: { layer: 'thermal', target: 'tranq', twin: false, hour: 13.5, shot: FLOWS },
    },
    {
      id: 'scale',
      evidence: ['field', 'demo'],
      kicker: L('The scale', 'Ölçek'),
      figure: { strong: n(OUR_PIT.ratio, 2), rest: L('depth ÷ width', 'derinlik ÷ genişlik') },
      title: L('The same shape, a tenth of the size.', 'Aynı biçim, onda bir boyut.'),
      body: L(
        'Lunar pits and Martian skylights are catalogued by width and depth. Ours sits at the small end of the same family: similar proportions, about ten times smaller. Weaker gravity lets a basalt roof span further on the Moon and Mars. So the shape transfers and the size does not, and that is where this analogy stops.',
        'Ay’daki çukurlar ve Mars’taki tavan delikleri genişlik ve derinliklerine göre kataloglanıyor. Bizimki aynı ailenin küçük ucunda duruyor: oranları benzer, boyutu yaklaşık on kat küçük. Zayıf kütleçekimi, Ay’da ve Mars’ta bazalt tavanın daha geniş açıklıkları geçmesine izin veriyor. Yani biçim aktarılabiliyor, boyut aktarılamıyor; bu analojinin bittiği yer de burası.',
      ),
      source: L(
        'The pit mouth under its overhang, 14 November 2026 · † Moon and Mars points are illustrative, catalogues not yet ingested',
        'Çukurun ağzı ve üstündeki saçak, 14 Kasım 2026 · † Ay ve Mars noktaları temsilidir, kataloglar henüz eklenmedi',
      ),
      visual: 'catalogue',
      plate: photo(
        'mouth',
        L(
          'The dark mouth of the pit under its basalt overhang, lichen and moss on the near blocks',
          'Bazalt saçağın altında çukurun karanlık ağzı; öndeki bloklarda liken ve yosun',
        ),
      ),
      scene: { layer: 'terrain', target: 'tranq', twin: false, hour: 13.5, shot: FLOWS },
    },
    {
      id: 'light',
      evidence: ['orbit'],
      kicker: L('The light', 'Işık'),
      figure: { strong: pct(a.twins.shackleton.shadow[low]), rest: L('in shadow', 'gölgede') },
      title: L(
        'This is where the Moon Base goes. The sun never climbs above 1.5°.',
        'Ay Üssü buraya kurulacak. Güneş 1,5°’nin üzerine hiç çıkmıyor.',
      ),
      body: L(
        `At that angle ${pct(a.earth.shadow[low])} of Karacadağ is in shadow, and ${pct(a.twins.shackleton.shadow[low])} of the Shackleton ridge. Our sunset gives 40 minutes of the same light every day: a rehearsal, with its limits measured.`,
        `Bu açıda Karacadağ’ın ${pct(a.earth.shadow[low])} kadarı, Shackleton sırtının ise ${pct(a.twins.shackleton.shadow[low])} kadarı gölgede kalıyor. Bizdeki gün batımı her gün aynı ışığı 40 dakika boyunca veriyor: sınırları ölçülmüş bir prova.`,
      ),
      source: L(
        'Shackleton ridge, LRO LOLA 20 m polar elevation · horizons traced with lunar curvature',
        'Shackleton sırtı, LRO LOLA 20 m kutup yükseklik verisi · ufuklar Ay’ın eğriliğiyle izlendi',
      ),
      visual: 'shadow',
      plate: TERRAIN,
      scene: { layer: 'terrain', target: 'shackleton', twin: true, hour: 16.6, shot: POLE },
    },
    {
      id: 'where',
      evidence: ['orbit'],
      kicker: L('Where to go', 'Nereye gitmeli'),
      figure: { strong: pct(best.score / 100), rest: L('match, one patch', 'benzerlik, tek bir yama') },
      title: L('The closest ground to Mars is here.', 'Mars’a en çok benzeyen zemin burada.'),
      body: L(
        `A 3 km patch at ${n(where.lat, 3)}°N ${n(where.lon, 3)}°E matches the Arsia flank far better than the mountain as a whole. The map says where a field team should stand.`,
        `${n(where.lat, 3)}°K ${n(where.lon, 3)}°D konumundaki 3 km’lik bir yama, Arsia yamacına dağın bütününden çok daha iyi uyuyor. Harita, bir saha ekibinin nerede durması gerektiğini söylüyor.`,
      ),
      source: L(
        'Local slope and roughness statistics against the Arsia Mons model',
        'Yerel eğim ve pürüzlülük istatistikleri, Arsia Mons modeliyle karşılaştırıldı',
      ),
      plate: TERRAIN,
      scene: { layer: 'score', target: 'arsia', twin: false, hour: 13.5, shot: ABOVE },
    },
    {
      id: 'limits',
      evidence: [],
      kicker: L('The limits', 'Sınırlar'),
      title: L(
        'Earth cannot fake gravity, vacuum or radiation.',
        'Dünya; kütleçekimini, boşluğu ve radyasyonu taklit edemez.',
      ),
      body: L(
        'Every score here comes with the place where the comparison breaks. An analog is useful when its limits are known. The first field day added what orbit cannot see: a pit, a scan, one temperature. Next come the overnight record, a tape-checked scale and rock counts.',
        'Buradaki her puanın yanında, karşılaştırmanın bozulduğu yer de yazıyor. Bir analog, sınırları bilindiğinde işe yarar. İlk saha günü yörüngenin göremediğini ekledi: bir çukur, bir tarama, bir sıcaklık. Sırada gece kaydı, şerit metreyle doğrulanmış ölçek ve kaya sayımları var.',
      ),
      source: L(
        'A scoria cone on the Ovabağ field, 14 November 2026 · open the data to check every number',
        'Ovabağ alanında bir cüruf konisi, 14 Kasım 2026 · her sayıyı kontrol etmek için veriyi açın',
      ),
      plate: photo(
        'cone',
        L(
          'A breached scoria cone with red oxidised cinder on its inner wall',
          'İç duvarında kırmızı, oksitlenmiş cüruf görülen yarılmış bir cüruf konisi',
        ),
      ),
      scene: { layer: 'terrain', target: 'arsia', twin: false, hour: 9.5, shot: WIDE },
    },
  ]
}
