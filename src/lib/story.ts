// The findings, one per chapter, in English and Turkish. Every number is read
// from the analysis, the ingested rasters or the field scan at run time, so
// the text cannot drift from the data. Each chapter declares its evidence:
// measured on foot, measured from orbit, or published.
//
// The Turkish is written, not translated: it says the same thing the way a
// Turkish speaker would, so sentence breaks and emphasis may differ.

import { MEASURED, NIGHT_DROP, OUR_PIT, PIT_COUNTS, PIT_RANGE } from '../data/pit'
import { PIT_SCAN } from '../data/pitScan'
import { ROCK_CONTROL, ROCK_MATCH } from '../data/rock'
import type { TargetId } from '../data/targets'
import { rankSites, SUN_ELEVATIONS } from './analysis'
import { heightToY, sampleHeight, uvToLonLat, WORLD } from './dem'
import { formatter, type Lang } from './i18n'
import type { LayerId, World } from './layers'
import { fieldMean } from './scores'
import type { Plate, Shot } from '../store'

export type Visual = 'ranking' | 'year' | 'shadow' | 'night' | 'catalogue' | 'rock'

/** Where a chapter's evidence comes from. */
export type Evidence = 'field' | 'orbit' | 'lab'

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
  }
}

// The tile is close to square, so every shot frames the whole 62 km block.
const WIDE: Shot = { position: [-64, 90, 238], target: [0, -2, 4] }
// Arsia's flank climbs to the south, so the twin is seen from the low northern
// side, looking up the slope.
const TWIN: Shot = { position: [-122, 62, -172], target: [0, 8, 6] }
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
  const hotMonth = new Date(2000, Number(hottest.month.slice(5)) - 1, 1).toLocaleString(tr ? 'tr-TR' : 'en-US', {
    month: 'long',
  })
  const swing = n(fieldMean(world.earth.swing))

  const low = SUN_ELEVATIONS.indexOf(1.5)
  const best = a.best.arsia
  const where = uvToLonLat(best.u, best.v)
  // moves in on the best patch from the south, so the ring fills the tile
  const patch: [number, number, number] = [
    (best.u - 0.5) * WORLD,
    heightToY(sampleHeight(world.earth.dem, best.u, best.v), world.earth.dem) * 4,
    (best.v - 0.5) * WORLD,
  ]
  const PATCH: Shot = { position: [patch[0] - 10, patch[1] + 84, patch[2] + 100], target: patch }

  const warmer = n(MEASURED.inside - MEASURED.outside, 1)
  const drop = n(NIGHT_DROP, 1)
  const across = n(PIT_SCAN.equivalent_diameter_m, 1)
  const deep = n(PIT_SCAN.depth_m, 1)
  const ratio = n(OUR_PIT.ratio, 2)
  const whole = pct(a.twins.arsia.topo / 100)
  const here = pct(best.score / 100)

  return [
    {
      id: 'question',
      evidence: ['orbit', 'field'],
      kicker: L('The question', 'Soru'),
      title: L(
        'Can a volcano in Türkiye stand in for Mars and the Moon?',
        'Türkiye’deki bir volkan, Mars ve Ay için benzer saha olabilir mi?',
      ),
      body: L(
        'Karacadağ is a basalt shield volcano in south-east Türkiye, with young lava flows, collapse pits and lava tubes. It has not been studied as a planetary analog. We first measured it with the kind of orbital data used for Mars and the Moon, then went there on 14–15 November 2026 and measured it on foot.',
        'Karacadağ, Güneydoğu Anadolu’da bazalttan oluşan bir kalkan volkandır. Genç lav akıntıları, çöküntü çukurları ve lav tüpleri barındırır. Bugüne kadar gezegen benzeri saha olarak incelenmedi. Önce Mars ve Ay için kullanılan türden uydu verileriyle ölçtük; ardından 14–15 Kasım 2026’da sahaya giderek yerinde ölçüm yaptık.',
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
          'Ovabağ lav alanının panoraması: kapalı gökyüzünün altında koyu bazalt akıntıları ve bir cüruf konisi',
        ),
      },
      scene: { layer: 'terrain', target: 'arsia', twin: false, hour: 15.8, shot: WIDE },
    },
    {
      id: 'twin',
      evidence: ['orbit'],
      kicker: L('The twin', 'İkiz'),
      figure: { strong: whole, rest: L('terrain match', 'arazi benzerliği') },
      title: L('Same 62 km. Same scale. This is Mars.', 'Aynı 62 km, aynı ölçek. Burası Mars.'),
      body: L(
        `This is the north flank of Arsia Mons, a shield volcano with candidate cave skylights, seen from its foot. We measured slope, roughness and relief the same way on both elevation models; they overlap with Karacadağ’s by ${whole}.`,
        `Görüntüdeki arazi, yamacında mağara girişi olabilecek açıklıklar bulunan kalkan volkan Arsia Mons’un kuzey yamacıdır; eteğinden yukarı doğru bakılıyor. Eğimi, yüzey pürüzlülüğünü ve yükselti farkını iki yükseklik modelinde de aynı yöntemle ölçtük. Değerler Karacadağ ile ${whole} oranında örtüşüyor.`,
      ),
      source: L(
        'MOLA + HRSC elevation, Mars · SRTM, Earth · 480 m baseline · 150 west–east profiles',
        'Mars: MOLA + HRSC yükseklik verisi · Dünya: SRTM · 480 m ölçüm aralığı · 150 batı–doğu kesiti',
      ),
      plate: TERRAIN,
      scene: { layer: 'terrain', target: 'arsia', twin: true, hour: 15.8, shot: TWIN },
    },
    {
      id: 'test',
      evidence: ['orbit'],
      kicker: L('The test', 'Sınama'),
      figure: { strong: String(a.sites.length), rest: L('Earth sites, one method', 'saha, tek yöntem') },
      title: L(
        'We scored the sites NASA already uses. The method picks Mauna Loa first.',
        'Yöntemi önce NASA’nın kullandığı sahalarda sınadık. İlk sırada Mauna Loa çıktı.',
      ),
      body: L(
        `That is the right answer for a Martian shield volcano, so the method works. Karacadağ places ${ORDINAL[place('arsia')]} for Mars, ahead of ${beaten.join(' and ')}, and ${ORDINAL[place('tranq')]} for the lunar mare.`,
        `Mauna Loa, Mars’taki kalkan volkanlar için hâlihazırda kullanılan sahadır; yöntemin onu ilk sıraya koyması doğru çalıştığını gösteriyor. Karacadağ, Mars benzerliğinde ${place('arsia') + 1}. sırada ve ${beaten.join(' ile ')} sahalarının önünde yer alıyor. Ay’ın lav düzlükleriyle karşılaştırmada ise ${place('tranq') + 1}. sırada.`,
      ),
      source: L(
        'Karacadağ, slope from SRTM · eight 62 km squares of Earth, one method',
        'Karacadağ eğim haritası (SRTM) · Dünya’dan sekiz saha, her biri 62 km’lik kare, tek yöntem',
      ),
      visual: 'ranking',
      plate: TERRAIN,
      scene: { layer: 'slope', target: 'arsia', twin: false, hour: 13.5, shot: WIDE },
    },
    {
      id: 'heat',
      evidence: ['orbit', 'field'],
      kicker: L('The heat', 'Sıcaklık'),
      figure: {
        strong: `${n(hottest.field_day ?? 0)} °C`,
        rest: L(`in ${hotMonth}, from orbit`, `${hotMonth.toLocaleLowerCase('tr-TR')} ayında, uydu ölçümü`),
      },
      title: L(
        'Bare basalt heats strongly by day. The atmosphere limits how far.',
        'Çıplak bazalt gündüz çok ısınıyor; atmosfer bu ısınmayı sınırlıyor.',
      ),
      body: L(
        `The surface of the lava field swings ${swing} K between 13:30 and 01:30. The same rock on the Moon swings about 290 K. The difference is the atmosphere, and it is the first limit of any Earth analog.`,
        `Lav alanının yüzey sıcaklığı 13.30 ile 01.30 arasında ortalama ${swing} K değişiyor. Aynı kayaç Ay yüzeyinde yaklaşık 290 K’lik bir farkla karşılaşır. Aradaki farkın nedeni atmosferdir; bu, Dünya’daki bütün benzer sahalar için geçerli olan ilk sınırdır.`,
      ),
      source: L(
        'VIIRS land surface temperature, NASA GIBS · 12 months',
        'VIIRS yer yüzeyi sıcaklığı (NASA GIBS) · 12 ay',
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
        rest: L('match with Mars basalt', 'Mars bazaltı ile benzerlik'),
      },
      title: L(
        'Ovabağ lava is chemically closer to Mars basalt than to Moon basalt.',
        'Ovabağ lavı, kimyasal olarak Ay bazaltından çok Mars bazaltına yakın.',
      ),
      body: L(
        `We compared ten major oxides of an Ovabağ lava sample with the basalts the Spirit rover analysed on Mars: ${ROCK_MATCH.arsia.score} out of 100. The same calculation gives ${ROCK_MATCH.tranq.score} against Apollo 11 mare basalt and ${ROCK_MATCH.shackleton.score} against Apollo 16 highland soil. As a yardstick, Mars basalt against lunar mare basalt scores ${ROCK_CONTROL}. The Mars rocks are from Gusev crater, not Arsia, which no rover has reached; the lunar basalt is from the Apollo 11 site, about 380 km from the pit.`,
        `Ovabağ’dan alınmış bir lav örneğinin on ana oksidini, Spirit aracının Mars’ta analiz ettiği bazaltlarla karşılaştırdık; benzerlik 100 üzerinden ${ROCK_MATCH.arsia.score} çıktı. Aynı hesap Apollo 11 bazaltı için ${ROCK_MATCH.tranq.score}, Apollo 16 yayla toprağı için ${ROCK_MATCH.shackleton.score} veriyor. Ölçüt olarak, Mars bazaltı ile Ay bazaltının birbirine benzerliği ${ROCK_CONTROL}. Mars örnekleri Arsia’dan değil Gusev kraterindendir, çünkü Arsia’ya henüz hiçbir araç inmedi. Ay bazaltı ise çukurdan yaklaşık 380 km uzaktaki Apollo 11 iniş bölgesinden alınmıştır.`,
      ),
      source: L(
        'Ovabağ basalt, 14 November 2026 · sample CA 134 (Agostini et al. 2022) · Spirit APXS, NASA PDS · Apollo 10017 and 64501, Lunar Sample Compendium',
        'Ovabağ bazaltı, 14 Kasım 2026 · örnek CA 134 (Agostini vd. 2022) · Spirit APXS ölçümleri (NASA PDS) · Apollo 10017 ve 64501 (Lunar Sample Compendium)',
      ),
      visual: 'rock',
      plate: photo(
        'rubble',
        L('Lichen-covered basalt blocks on the Ovabağ flows', 'Ovabağ lavlarında likenle kaplı bazalt blokları'),
      ),
      scene: { layer: 'terrain', target: 'arsia', twin: false, hour: 13.5, shot: FLOWS },
    },
    {
      id: 'pit',
      evidence: ['field', 'lab'],
      kicker: L('The pit', 'Çukur'),
      figure: {
        strong: `${across} m`,
        rest: L(`across, ${deep} m deep`, `genişlik, ${deep} m derinlik`),
      },
      title: L(
        'A collapse pit: the landform sought on the Moon and Mars.',
        'Bir çöküntü çukuru: Ay’da ve Mars’ta aranan yapının benzeri.',
      ),
      body: L(
        `This pit formed when the roof of a cavity in the Ovabağ flows collapsed. Part of the roof still stands and covers ${pct(PIT_SCAN.roofed_fraction)} of the opening. More than ${n(PIT_COUNTS.moon)} such pits are catalogued on the Moon and more than ${n(PIT_COUNTS.mars)} candidate cave entrances on Mars. The pits in the lunar maria and the skylights on Arsia Mons are explained the same way, by the roof of a void giving way, and they are where future crews could shelter from radiation and temperature extremes. In the 30 m elevation data this pit is smaller than one pixel, so we scanned it on site in three dimensions. Drag to turn it.`,
        `Bu çukur, Ovabağ lavlarının içindeki bir boşluğun tavanı çökünce oluştu. Tavanın bir bölümü hâlâ yerinde ve açıklığın ${pct(PIT_SCAN.roofed_fraction)} kadarını örtüyor. Ay’da ${n(PIT_COUNTS.moon)}’den, Mars’ta ${n(PIT_COUNTS.mars)}’den fazla benzer yapı kataloglandı. Ay’ın lav düzlüklerindeki çukurlar ve Arsia Mons’un yamacındaki tavan açıklıkları da aynı süreçle, bir boşluğun tavanının çökmesiyle açıklanıyor. Bu yapılar, gelecekteki ekiplerin radyasyondan ve aşırı sıcaklıktan korunabileceği yerler olarak değerlendiriliyor. Çukur, 30 metrelik yükseklik verisinde bir pikselden küçük kaldığı için uydudan seçilemiyor; bu nedenle yerinde üç boyutlu olarak taradık. Tarama sürüklenerek döndürülebilir.`,
      ),
      source: L(
        `Our scan: ${n(PIT_SCAN.raw_points)} points, ${n(PIT_SCAN.count)} drawn · the yellow line is a 1.7 m person`,
        `Kendi taramamız: ${n(PIT_SCAN.raw_points)} nokta (ekranda ${n(PIT_SCAN.count)}) · sarı çizgi 1,7 m boyunda bir insanı gösterir`,
      ),
      plate: { kind: 'scan' },
      scene: { layer: 'terrain', target: 'arsia', twin: false, hour: 13.5, shot: FLOWS },
    },
    {
      id: 'surprise',
      evidence: ['field', 'lab'],
      kicker: L('The night', 'Gece'),
      figure: {
        strong: `${n(MEASURED.inside, 1)} °C`,
        rest: L(
          `in the pit, ${n(MEASURED.outside, 1)} °C outside`,
          `çukurda; dışarıda ${n(MEASURED.outside, 1)} °C`,
        ),
      },
      title: L(
        'We expected a cold trap. The readings say otherwise.',
        'Soğuk bir çukur bekliyorduk. Ölçüm tersini gösterdi.',
      ),
      body: L(
        `A press report put these caves at 4–5 °C in summer, so we expected cold air to pool in the pit. At 16:00 on 14 November the pit was ${warmer} °C warmer than the air above it, at ${MEASURED.humidity}% humidity. The thermometers stayed in place, inside and outside, until 06:00 the next morning. Over those hours the air around the site cooled by ${drop} °C. Rock damps such changes, so the pit should feel only part of that cooling. This buffering is the property that makes lunar pits candidate shelters.`,
        `Basında bu mağaraların yazın 4–5 °C olduğu bildirilmişti; bu nedenle soğuk havanın çukurda biriktiğini düşünüyorduk. 14 Kasım saat 16.00’da çukurun içi dışarıdan ${warmer} °C daha sıcaktı, nem ise %${MEASURED.humidity} idi. Termometreler ertesi sabah 06.00’ya kadar çukurun içinde ve dışında kaldı. Bu sürede bölgede hava ${drop} °C soğudu. Kayaç sıcaklık değişimini sönümlediği için çukurun bu soğumanın yalnızca bir bölümünü hissetmesi beklenir. Ay’daki çukurları sığınak adayı yapan özellik de bu dengelemedir.`,
      ),
      source: L(
        'The pit from its rim, 14 November 2026 · thermometers in place 16:00 to 06:00 · hourly air temperature: Open-Meteo',
        'Çukurun kenarından görünüm, 14 Kasım 2026 · termometre kaydı 16.00–06.00 · saatlik hava sıcaklığı: Open-Meteo',
      ),
      visual: 'night',
      plate: photo(
        'pit',
        L(
          'Looking down into the collapse pit: an overhanging basalt roof above a moss-covered floor',
          'Çukura yukarıdan bakış: yosun tutmuş tabanın üzerine uzanan bazalt tavan',
        ),
      ),
      scene: { layer: 'thermal', target: 'tranq', twin: false, hour: 13.5, shot: FLOWS },
    },
    {
      id: 'scale',
      evidence: ['field', 'lab'],
      kicker: L('The scale', 'Ölçek'),
      figure: { strong: ratio, rest: L('depth ÷ width', 'derinlik / genişlik') },
      title: L(
        'The proportions of pits on the Moon and Mars, at a smaller size.',
        'Oranları Ay ve Mars’taki çukurlarla aynı aralıkta, boyutu daha küçük.',
      ),
      body: L(
        `Lunar pits and Martian skylights are catalogued by width and depth. Our pit’s depth-to-width ratio is ${ratio}; in the published examples it runs from ${n(PIT_RANGE.ratio[0], 2)} to ${n(PIT_RANGE.ratio[1], 2)}. In size it is ${n(PIT_RANGE.timesSmaller[0])} to ${n(PIT_RANGE.timesSmaller[1])} times smaller. Weaker gravity lets a basalt roof span a wider void on the Moon and Mars. What carries over from Karacadağ is therefore the shape of the pit and the way it formed, not its size.`,
        `Ay’daki çukurlar ve Mars’taki tavan açıklıkları genişlik ve derinlikleriyle kataloglanıyor. Bizim çukurun derinlik/genişlik oranı ${ratio}; yayımlanmış örneklerde bu oran ${n(PIT_RANGE.ratio[0], 2)} ile ${n(PIT_RANGE.ratio[1], 2)} arasında değişiyor. Boyut olarak ise onlardan ${n(PIT_RANGE.timesSmaller[0])}–${n(PIT_RANGE.timesSmaller[1])} kat küçük. Ay’da ve Mars’ta yerçekimi zayıf olduğundan bazalt bir tavan daha geniş bir boşluğu taşıyabiliyor. Bu nedenle Karacadağ’dan oraya aktarılabilecek olan, çukurun biçimi ve oluşum şeklidir; boyutu değil.`,
      ),
      source: L(
        'The pit mouth under its overhang, 14 November 2026 · Moon: LROC · Mars: Cushing et al. 2007',
        'Çukurun ağzı ve üzerindeki kaya saçağı, 14 Kasım 2026 · Ay: LROC · Mars: Cushing vd. 2007',
      ),
      visual: 'catalogue',
      plate: photo(
        'mouth',
        L(
          'The dark mouth of the pit under its basalt overhang, lichen and moss on the near blocks',
          'Bazalt saçağın altında çukurun karanlık ağzı; öndeki kayalarda liken ve yosun',
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
        'Ay üssü için seçilen bölge burası. Güneş ufuktan en fazla 1,5° yükseliyor.',
      ),
      body: L(
        `At that angle ${pct(a.twins.shackleton.shadow[low])} of the Shackleton ridge is in shadow, and ${pct(a.earth.shadow[low])} of Karacadağ. Our sunset gives about 40 minutes of the same light every day, enough to rehearse work under a low sun, with the difference measured.`,
        `Güneş bu yükseklikteyken Shackleton sırtının ${pct(a.twins.shackleton.shadow[low])} kadarı, Karacadağ’ın ise ${pct(a.earth.shadow[low])} kadarı gölgede kalıyor. Karacadağ’da benzer bir ışık her gün, gün batımından önce yaklaşık 40 dakika boyunca oluşuyor. Bu süre, alçak güneş altında yapılacak denemeler için yeterli; iki saha arasındaki fark da ölçülmüş durumda.`,
      ),
      source: L(
        'Shackleton ridge, LRO LOLA 20 m polar elevation · horizons traced with lunar curvature',
        'Shackleton sırtı, LRO LOLA 20 m kutup yükseklik verisi · gölgeler Ay’ın eğriliği hesaba katılarak çıkarıldı',
      ),
      visual: 'shadow',
      plate: TERRAIN,
      scene: { layer: 'terrain', target: 'shackleton', twin: true, hour: 16.6, shot: POLE },
    },
    {
      id: 'where',
      evidence: ['orbit'],
      kicker: L('Where to go', 'Konum'),
      figure: { strong: here, rest: L('match inside the ring', 'benzerlik, halkanın içinde') },
      title: L(
        'The ground closest to Mars is ringed on the map.',
        'Mars’a en çok benzeyen bölge haritada halkayla işaretli.',
      ),
      body: L(
        `The ringed patch, about 3 km across at ${n(where.lat, 3)}°N ${n(where.lon, 3)}°E, matches the Arsia flank far better than the mountain as a whole: ${whole} for the full square, ${here} here. Brighter colours mean a closer match. This is where we recommend field work.`,
        `Halkayla işaretlenen yaklaşık 3 km’lik bölge (${n(where.lat, 3)}°K ${n(where.lon, 3)}°D), Arsia yamacına dağın genelinden belirgin biçimde daha çok benziyor: benzerlik karenin tamamında ${whole}, bu bölgede ${here}. Haritada açık renkler yüksek benzerliği gösteriyor. Saha çalışmaları için önerdiğimiz konum burasıdır.`,
      ),
      source: L(
        'Local slope and roughness statistics against the Arsia Mons model',
        'Her noktanın eğim ve pürüzlülük istatistikleri Arsia Mons modeliyle karşılaştırıldı',
      ),
      plate: TERRAIN,
      scene: { layer: 'score', target: 'arsia', twin: false, hour: 13.5, shot: PATCH },
    },
    {
      id: 'result',
      evidence: ['orbit', 'lab', 'field'],
      kicker: L('The result', 'Sonuç'),
      title: L(
        'Karacadağ is a measured analog site for Mars and Moon studies.',
        'Karacadağ, Mars ve Ay çalışmaları için ölçülerek tanımlanmış bir benzer sahadır.',
      ),
      body: L(
        `For terrain it ranks ${ORDINAL[place('arsia')]} of ${a.sites.length} Earth sites against Mars. Its lava matches Mars basalt ${ROCK_MATCH.arsia.score} out of 100. A collapse pit ${across} m across and ${deep} m deep was scanned in three dimensions, and its proportions fall within those of pits on the Moon and Mars. The pit read ${warmer} °C warmer than the air outside. Gravity, atmosphere and radiation cannot be reproduced on Earth; the Data view states where each comparison stops holding.`,
        `Arazi benzerliğinde ${a.sites.length} saha arasında Mars için ${place('arsia') + 1}. sırada yer alıyor. Lavının kimyası Mars bazaltı ile 100 üzerinden ${ROCK_MATCH.arsia.score} oranında örtüşüyor. ${across} m genişliğinde ve ${deep} m derinliğinde bir çöküntü çukuru üç boyutlu olarak tarandı; oranları Ay ve Mars’taki çukurlarla aynı aralıkta. Çukurun içi dış havadan ${warmer} °C daha sıcak ölçüldü. Yerçekimi, atmosfer ve radyasyon Dünya’da yeniden üretilemez; her karşılaştırmanın geçerlilik sınırı Veri bölümünde belirtilmiştir.`,
      ),
      source: L(
        'A scoria cone on the Ovabağ field, 14 November 2026 · every value can be checked in the Data view',
        'Ovabağ’da bir cüruf konisi, 14 Kasım 2026 · bütün değerler Veri bölümünde incelenebilir',
      ),
      plate: photo(
        'cone',
        L(
          'A breached scoria cone with red oxidised cinder on its inner wall',
          'Bir yanı açılmış cüruf konisi; iç duvarında kırmızıya dönmüş cüruf',
        ),
      ),
      scene: { layer: 'terrain', target: 'arsia', twin: false, hour: 9.5, shot: WIDE },
    },
  ]
}
