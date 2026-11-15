// The findings, one per chapter, in English and Turkish. Every number is read
// from the analysis, the ingested rasters or the field scan at run time, so
// the text cannot drift from the data. Each chapter declares its evidence, so
// illustrative data is never shown as measured.
//
// The Turkish is written, not translated: it says the same thing the way a
// Turkish speaker would, so sentence breaks and emphasis may differ.

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
        'Türkiye’deki bir dağ, Mars’ın ve Ay’ın Dünya’daki benzeri olabilir mi?',
      ),
      body: L(
        'Karacadağ is a basalt shield volcano with young lava flows, collapse pits and lava tubes. Nobody has studied it as a planetary analog. We measured it from orbit, the same way Mars and the Moon are measured. Then we drove there to check.',
        'Karacadağ, Güneydoğu Anadolu’da bazalttan bir kalkan volkan. Genç lav akıntıları, çökmüş tavanlar, lav tüpleri var. Bugüne kadar kimse buraya “Mars’a ya da Ay’a benziyor mu” diye bakmamış. Biz önce uydu verisiyle baktık; yani Mars ve Ay nasıl ölçülüyorsa öyle. Sonra kalkıp gittik, yerinde gördük.',
      ),
      source: L(
        'Ovabağ lava field, Karacadağ. Field photograph, 14 November 2026',
        'Ovabağ lav alanı, Karacadağ. 14 Kasım 2026’da sahada çektik.',
      ),
      plate: {
        kind: 'cover',
        src: '/field/banner.webp',
        alt: L(
          'Panorama of the Ovabağ lava field: dark basalt flows and a scoria cone under an overcast sky',
          'Ovabağ lav alanının panoraması: kapalı bir gökyüzünün altında koyu bazalt akıntıları ve bir cüruf konisi',
        ),
      },
      scene: { layer: 'terrain', target: 'arsia', twin: false, hour: 15.8, shot: WIDE },
    },
    {
      id: 'twin',
      evidence: ['orbit'],
      kicker: L('The twin', 'İkiz'),
      figure: { strong: pct(a.twins.arsia.topo / 100), rest: L('terrain match', 'arazi benzerliği') },
      title: L('Same 62 km. Same scale. This is Mars.', 'Aynı 62 km, aynı ölçek. Burası Mars.'),
      body: L(
        'Arsia Mons, a shield volcano with cave skylights on its flank. Its slopes, roughness and relief overlap with Karacadağ’s, measured identically on both elevation models.',
        'Karşınızdaki Arsia Mons: Mars’ta, yamacında mağara girişleri olan dev bir kalkan volkan. Yamaçların eğimi, yüzeyin engebesi, tepeyle düzlük arasındaki yükseklik farkı… Hepsini iki gezegende de aynı yöntemle ölçtük. Karacadağ’la büyük ölçüde örtüşüyor.',
      ),
      source: L(
        'MOLA + HRSC elevation, Mars · SRTM, Earth · 480 m baseline · 150 west–east profiles',
        'Mars: MOLA + HRSC yükseklik verisi · Dünya: SRTM · 480 m aralıkla ölçüm · 150 batı–doğu kesiti',
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
        'Yöntemi önce NASA’nın kullandığı sahalarda denedik. Birinci Mauna Loa çıktı.',
      ),
      body: L(
        `That is the right answer for a Martian shield volcano, so the method works. Unstudied Karacadağ places ${ORDINAL[place('arsia')]} for Mars, ahead of ${beaten.join(' and ')}, and ${ORDINAL[place('tranq')]} for the lunar mare.`,
        `Olması gereken de buydu: Mauna Loa, Mars’taki kalkan volkanlar için zaten kullanılan saha. Demek ki yöntem doğru yeri buluyor. Kimsenin incelemediği Karacadağ ise Mars benzerliğinde ${place('arsia') + 1}. sırada; ${beaten.join(' ve ')} gibi bilinen sahaların önünde. Ay’ın lav düzlükleriyle karşılaştırınca ${place('tranq') + 1}. sırada yer alıyor.`,
      ),
      source: L(
        'Karacadağ, slope from SRTM · eight 62 km squares of Earth, one method',
        'Karacadağ’ın eğim haritası (SRTM) · Dünya’dan sekiz saha, hepsi 62 km’lik kare, hepsi aynı yöntem',
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
        rest: L('in July, seen from orbit', 'temmuzda, uydudan'),
      },
      title: L(
        'Bare basalt, hot by day, and only as far as air allows.',
        'Çıplak bazalt gündüz kavruluyor. Ama hava buna bir yere kadar izin veriyor.',
      ),
      body: L(
        `The lava field swings ${swing} K between 13:30 and 01:30. The same rock on the Moon swings about 290 K. The difference is the atmosphere, and it is the first limit of any Earth analog.`,
        `Lav alanında yüzey sıcaklığı öğleden sonra 13.30 ile gece 01.30 arasında ${swing} derece oynuyor. Aynı kaya Ay’da olsaydı bu fark 290 dereceyi bulurdu. Aradaki farkın sebebi atmosfer. Dünya’daki her benzer sahanın ilk sınırı da bu.`,
      ),
      source: L(
        'VIIRS land surface temperature, NASA GIBS · 12 months',
        'VIIRS uydusundan yer yüzeyi sıcaklığı (NASA GIBS) · 12 ay',
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
        rest: L('match with Mars basalt', 'Mars bazaltına benzerlik'),
      },
      title: L(
        'This lava is chemically closer to Mars than the Moon’s lava is.',
        'Bu lav, kimyasıyla Ay’dan çok Mars’a benziyor.',
      ),
      body: L(
        `Ten major oxides of an Ovabağ lava sample, compared one by one with basalts the Spirit rover analysed on Mars: ${ROCK_MATCH.arsia.score} out of 100. Against Apollo 11 mare basalt it scores ${ROCK_MATCH.tranq.score}, against Apollo 16 highland soil ${ROCK_MATCH.shackleton.score}. As a yardstick, Mars basalt against lunar mare basalt scores ${ROCK_CONTROL}. The Mars rocks are from Gusev crater, not Arsia, which no rover has reached; the lunar basalt is from the Apollo 11 site, about 380 km from the pit.`,
        `Ovabağ’dan alınmış bir lav örneğinin on ana bileşenini, Spirit aracının Mars’ta incelediği bazaltlarla tek tek karşılaştırdık. Sonuç 100 üzerinden ${ROCK_MATCH.arsia.score}. Aynı hesap Apollo 11’in getirdiği Ay bazaltı için ${ROCK_MATCH.tranq.score}, Apollo 16’nın getirdiği Ay toprağı için ${ROCK_MATCH.shackleton.score} veriyor. Kıyas olsun diye: Mars bazaltıyla Ay bazaltı birbirine ancak ${ROCK_CONTROL} benziyor. İki not düşelim. Mars örnekleri Arsia’dan değil, Gusev kraterinden; çünkü Arsia’ya bugüne kadar hiçbir araç inmedi. Ay bazaltı da çukurun kendisinden değil, 380 km kadar ötedeki Apollo 11 iniş bölgesinden.`,
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
      evidence: ['field'],
      kicker: L('The pit', 'Çukur'),
      figure: {
        strong: `${across} m`,
        rest: L(`across, ${deep} m deep`, `genişlik, ${deep} m derinlik`),
      },
      title: L('Orbit cannot see this. We scanned it.', 'Uydu burayı göremiyor. Biz gidip taradık.'),
      body: L(
        `A collapse pit in the Ovabağ flows, with the old roof still hanging over ${pct(PIT_SCAN.roofed_fraction)} of it. In the 30 m elevation model behind every score here, it is smaller than one pixel. The skylights on Arsia Mons were found the same way, only once the camera was sharp enough. Drag to turn it.`,
        `Ovabağ lavlarının içinde, tavanı çökmüş bir boşluk. Tavanın bir kısmı hâlâ yerinde ve çukurun ${pct(PIT_SCAN.roofed_fraction)} kadarını örtüyor. Buradaki bütün puanları 30 metrelik yükseklik verisiyle hesapladık; bu çukur o veride tek bir pikselden bile küçük. Mars’ta Arsia Mons’un yamacındaki delikler de böyle bulunmuştu: kamera yeterince keskinleşince. Modeli sürükleyip çevirebilirsiniz.`,
      ),
      source: L(
        `Our scan: ${n(PIT_SCAN.raw_points)} points, ${n(PIT_SCAN.count)} drawn · yellow line: a 1.7 m person · scale as exported, not yet checked against a tape`,
        `Kendi taramamız: ${n(PIT_SCAN.raw_points)} nokta (ekranda ${n(PIT_SCAN.count)}) · sarı çizgi 1,7 m boyunda bir insan · ölçeği henüz şerit metreyle doğrulamadık`,
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
          `çukurda, dışarıda ${n(MEASURED.outside, 1)} °C`,
        ),
      },
      title: L(
        'We expected a cold trap. The thermometer disagreed.',
        'Soğuk bir çukur bekliyorduk. Termometre öyle demedi.',
      ),
      body: L(
        `A press report put these caves at 4–5 °C in summer, so we predicted cold air pooling underground. At about 15:00 on 14 November the pit was ${warmer} K warmer than the air above it, at ${MEASURED.humidity}% humidity. One reading is not a curve, but it points to buffering, not trapping: rock that remembers the average. That is the property that makes lunar pits candidate shelters.`,
        `Bir gazete haberine göre buradaki mağaralar yazın 4–5 derece oluyor. Biz de soğuk havanın çukurlara dolup orada kaldığını düşünmüştük. 14 Kasım günü saat 15.00 civarında ölçtük: çukurun içi dışarıdan ${warmer} derece daha sıcaktı, nem %${MEASURED.humidity}. Tek bir ölçümle kesin konuşulmaz. Ama görünen o ki kaya soğuğu hapsetmiyor; gündüzle geceyi, yazla kışı dengeliyor. Ay’daki çukurları sığınak adayı yapan da tam olarak bu özellik.`,
      ),
      source: L(
        'The pit from its rim, 14 November 2026 · one handheld reading · † the 24-hour curve is illustrative',
        'Çukura kenarından bakış, 14 Kasım 2026 · elle alınmış tek ölçüm · † 24 saatlik eğri temsilidir',
      ),
      visual: 'day',
      plate: photo(
        'pit',
        L(
          'Looking down into the collapse pit: an overhanging basalt roof above a moss-covered floor',
          'Çukura yukarıdan bakış: yosun tutmuş tabanın üzerine sarkan bazalt tavan',
        ),
      ),
      scene: { layer: 'thermal', target: 'tranq', twin: false, hour: 13.5, shot: FLOWS },
    },
    {
      id: 'scale',
      evidence: ['field', 'demo'],
      kicker: L('The scale', 'Ölçek'),
      figure: { strong: n(OUR_PIT.ratio, 2), rest: L('depth ÷ width', 'derinlik / genişlik oranı') },
      title: L('The same shape, a tenth of the size.', 'Biçim aynı, boyut onda biri.'),
      body: L(
        'Lunar pits and Martian skylights are catalogued by width and depth. Ours sits at the small end of the same family: similar proportions, about ten times smaller. Weaker gravity lets a basalt roof span further on the Moon and Mars. So the shape transfers and the size does not, and that is where this analogy stops.',
        'Ay’daki çukurlar ve Mars’taki tavan delikleri, genişlik ve derinlikleriyle kataloglara geçmiş durumda. Bizim çukur o ailenin en küçüklerinden: oranları onlara benziyor, boyutu ise yaklaşık on kat küçük. Bunun sebebi yerçekimi. Ay’da ve Mars’ta yerçekimi zayıf olduğu için bazalt bir tavan çok daha geniş bir boşluğun üzerinde durabiliyor. Demek ki Karacadağ’dan oraya taşınabilecek olan şey biçim, boyut değil. Benzerlik de burada bitiyor.',
      ),
      source: L(
        'The pit mouth under its overhang, 14 November 2026 · † Moon and Mars points are illustrative, catalogues not yet ingested',
        'Çukurun ağzı ve üzerindeki kaya saçağı, 14 Kasım 2026 · † Ay ve Mars noktaları temsilidir, gerçek kataloglar henüz eklenmedi',
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
        'Ay üssünün kurulacağı yer burası. Güneş burada ufuktan en fazla 1,5 derece yükseliyor.',
      ),
      body: L(
        `At that angle ${pct(a.earth.shadow[low])} of Karacadağ is in shadow, and ${pct(a.twins.shackleton.shadow[low])} of the Shackleton ridge. Our sunset gives 40 minutes of the same light every day: a rehearsal, with its limits measured.`,
        `Güneş bu kadar alçaktayken Shackleton sırtının ${pct(a.twins.shackleton.shadow[low])} kadarı gölgede kalıyor; Karacadağ’da bu oran ${pct(a.earth.shadow[low])}. Bizde aynı ışık her akşam gün batarken yaklaşık 40 dakika sürüyor. Yani her gün tekrarlanabilen bir prova var elimizde; nerede yetersiz kaldığını da biliyoruz.`,
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
      kicker: L('Where to go', 'Nereye'),
      figure: { strong: pct(best.score / 100), rest: L('match, one patch', 'benzerlik, tek bir bölgede') },
      title: L('The closest ground to Mars is here.', 'Mars’a en çok benzeyen yer tam burası.'),
      body: L(
        `A 3 km patch at ${n(where.lat, 3)}°N ${n(where.lon, 3)}°E matches the Arsia flank far better than the mountain as a whole. The map says where a field team should stand.`,
        `Dağın tamamı değil ama ${n(where.lat, 3)}°K ${n(where.lon, 3)}°D civarındaki 3 km’lik bir bölge, Arsia’nın yamacına çok daha fazla benziyor. Harita, sahaya çıkacak bir ekibe nerede durması gerektiğini gösteriyor.`,
      ),
      source: L(
        'Local slope and roughness statistics against the Arsia Mons model',
        'Her noktanın eğim ve engebe değerleri Arsia Mons’unkilerle karşılaştırıldı',
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
        'Yerçekimini, boşluğu ve radyasyonu Dünya’da taklit edemeyiz.',
      ),
      body: L(
        'Every score here comes with the place where the comparison breaks. An analog is useful when its limits are known. The first field day added what orbit cannot see: a pit, a scan, one temperature. Next come the overnight record, a tape-checked scale and rock counts.',
        'Buradaki her puanın yanına, benzerliğin nerede bittiğini de yazdık. Çünkü böyle bir saha, sınırları bilindiği ölçüde işe yarar. İlk saha günümüz uydunun göremediği üç şeyi kattı: bir çukur, bir tarama, bir sıcaklık ölçümü. Sırada gece boyunca alınan kayıt, şerit metreyle ölçek kontrolü ve kaya sayımı var.',
      ),
      source: L(
        'A scoria cone on the Ovabağ field, 14 November 2026 · open the data to check every number',
        'Ovabağ’da bir cüruf konisi, 14 Kasım 2026 · bütün sayıları Veri bölümünden kontrol edebilirsiniz',
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
