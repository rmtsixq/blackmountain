// Turkish for the Data view, keyed by the English text used in the code.
// Written to read as Turkish, not as a word-for-word rendering.
// `npm run lint` does not check keys; run scripts/check_tr.py after edits.

export const TR: Record<string, string> = {
  // worlds and targets
  Earth: 'Dünya',
  Moon: 'Ay',
  'the Moon': 'Ay',
  'Mare Tranquillitatis Pit': 'Mare Tranquillitatis Çukuru',
  'Shackleton Connecting Ridge': 'Shackleton Bağlantı Sırtı',
  ' and ': ' ve ',
  'Earth · Türkiye': 'Dünya · Türkiye',
  'Mars · shield volcano': 'Mars · kalkan volkan',
  'Moon · lava plain': 'Ay · lav düzlüğü',
  'Moon · south pole': 'Ay · güney kutbu',
  'World shown': 'Gösterilen yer',
  'Compare Karacadağ with': 'Karacadağ’ın karşılaştırıldığı yer',

  'A basaltic shield flank in the area where candidate cave skylights were reported from orbit (Cushing et al. 2007). Same rock family and flow morphology as Karacadağ, at ten times the size.':
    'Bazaltik bir kalkan volkanın yamacı. Uydu görüntülerinde mağara girişi olabilecek deliklerin bildirildiği bölge burası (Cushing vd. 2007). Kayaç ailesi ve lav akıntılarının biçimi Karacadağ’la aynı; yalnızca on kat daha büyük.',
  'A collapse pit about 100 m across in mare basalt, a candidate entrance to a lava tube. LRO Diviner shows its shaded floor holding near 17 °C. The pit itself is smaller than one cell of this grid; the terrain shown is the mare around it.':
    'Ay’ın lav düzlüğünde yaklaşık 100 m genişliğinde bir çöküntü çukuru; bir lav tüpünün girişi olabilir. LRO Diviner ölçümlerine göre gölgede kalan tabanı 17 °C civarında duruyor. Çukurun kendisi bu haritanın tek bir hücresinden küçük; gördüğünüz arazi çevresindeki düzlük.',
  'The ridge between Shackleton and de Gerlache craters, the region targeted for the first Moon Base missions. The south pole and Shackleton crater are inside this square.':
    'Shackleton ile de Gerlache kraterleri arasındaki sırt. İlk Ay üssü görevlerinin hedeflediği bölge burası. Güney kutbu ve Shackleton krateri bu karenin içinde.',

  'MOLA + HRSC blend, 200 m': 'MOLA + HRSC birleşimi, 200 m',
  'LRO LOLA polar model, 20 m': 'LRO LOLA kutup modeli, 20 m',
  'Arsia Mons, north flank': 'Arsia Mons, kuzey yamacı',
  'Tranquillitatis pit': 'Tranquillitatis çukuru',
  'Connecting ridge': 'Bağlantı sırtı',
  'South pole': 'Güney kutbu',

  'about 100 K per sol': 'bir Mars gününde yaklaşık 100 K',
  'about 290 K (≈ 390 K noon, ≈ 95 K before dawn)': 'yaklaşık 290 K (öğlen ≈ 390 K, şafaktan önce ≈ 95 K)',
  'well over 100 K between sunlit ridge and neighbouring cold traps':
    'güneş alan sırt ile yanındaki soğuk tuzaklar arasında 100 K’den çok fazla',
  'Mars orbital thermal IR (TES / THEMIS)': 'Mars yörüngesinden termal kızılötesi (TES / THEMIS)',
  'LRO Diviner, equatorial surface (Williams et al. 2017)': 'LRO Diviner, ekvator yüzeyi (Williams vd. 2017)',
  'LRO Diviner polar maps': 'LRO Diviner kutup haritaları',

  'Alkali basalt, ten major oxides (Agostini et al. 2022)': 'Alkali bazalt, on ana oksit (Agostini vd. 2022)',
  'Spirit APXS, Gusev crater': 'Spirit APXS, Gusev krateri',
  'Four ground basalt interiors, Adirondack class': 'Yüzeyi tıraşlanmış dört bazalt, Adirondack sınıfı',
  'Apollo 11 sample 10017': 'Apollo 11 örneği 10017',
  'High-titanium mare basalt': 'Titanyumca zengin Ay bazaltı',
  'Apollo 16 soil 64501': 'Apollo 16 toprağı 64501',
  'Feldspathic highland soil': 'Feldispatça zengin yayla toprağı',

  // where each comparison breaks
  'Arsia is about 435 km wide and Karacadağ a tenth of that: the match holds for a 62 km window of flank, not for the whole edifice.':
    'Arsia yaklaşık 435 km genişliğinde, Karacadağ onun onda biri. Benzerlik yamacın 62 km’lik bir penceresi için geçerli, dağın bütünü için değil.',
  'Earth’s sky scatters light into shadows. Martian shadows are harder and skylight interiors darker.':
    'Dünya’da gökyüzü ışığı saçarak gölgeleri aydınlatır. Mars’ta gölgeler daha sert, deliklerin içi daha karanlıktır.',
  'A thin CO₂ atmosphere lets the Martian surface swing about five times further than Karacadağ does under one bar of air.':
    'Mars’ın ince CO₂ atmosferi yüzünden yüzey sıcaklığı, bir barlık havanın altındaki Karacadağ’a göre yaklaşık beş kat fazla oynar.',
  'The Mars analyses are from Gusev crater, not Arsia, which no rover has reached. Karacadağ lavas are alkaline, and water and vegetation weather them in ways Mars does not.':
    'Mars analizleri Arsia’dan değil, Gusev kraterinden; Arsia’ya hiçbir araç inmedi. Ayrıca Karacadağ lavları alkali; su ve bitki örtüsü onları Mars’ta olmayan biçimde aşındırıyor.',
  'A mare plain is far flatter than any volcano flank. In one-sixth gravity, lunar tubes can also be far wider than any on Earth.':
    'Ay’ın lav düzlüğü herhangi bir volkan yamacından çok daha düz. Altıda bir yerçekiminde Ay’daki tüpler de Dünya’dakilerden çok daha geniş olabilir.',
  'No sky glow on the Moon: shadow edges are absolute, and a 14-day night follows each day.':
    'Ay’da gökyüzü ışımaz: gölgenin kenarı keskindir ve her gündüzü 14 günlük bir gece izler.',
  'The lunar surface swings about 290 K in vacuum; Karacadağ, under air and moisture, moves a small fraction of that.':
    'Ay yüzeyi boşlukta yaklaşık 290 K oynar. Hava ve nemin altındaki Karacadağ bunun küçük bir kısmı kadar oynuyor.',
  'The sample is from the Apollo 11 site, about 380 km from the pit. Both are basalt, but mare lavas are dry and titanium-rich: no hydrated minerals, no organics.':
    'Örnek çukurdan değil, yaklaşık 380 km ötedeki Apollo 11 iniş bölgesinden. İkisi de bazalt; ama Ay lavları kuru ve titanyumca zengin: sulu mineral de organik madde de yok.',
  'A ridge between impact craters, not a volcanic flank. Crater walls here are steeper than almost anything on a basalt shield.':
    'Burası bir volkan yamacı değil, çarpma kraterleri arasında bir sırt. Krater duvarları, bazalt bir kalkan volkandaki hemen her yerden daha dik.',
  'Karacadağ gets about 40 minutes a day with the sun below 4°. At the pole the sun circles the horizon for months and never climbs above about 1.5°.':
    'Karacadağ’da güneş her gün yaklaşık 40 dakika 4°’nin altında kalıyor. Kutupta ise güneş aylarca ufukta dolanır ve 1,5°’nin üzerine pek çıkmaz.',
  'Nothing on Earth approaches cryogenic cold-trap temperatures. Only the trapping mechanism compares, not the numbers.':
    'Dünya’da hiçbir yer oradaki soğuk tuzakların sıcaklığına yaklaşamaz. Karşılaştırılabilen yalnızca mekanizma; sayılar değil.',
  'Apollo 16 highland soil stands in for the pole, where nothing has been sampled. Wrong rock entirely: bright feldspar-rich crust against dark iron-rich basalt.':
    'Kutuptan hiç örnek alınmadığı için yerine Apollo 16’nın yayla toprağını kullandık. Kayaç bambaşka: bir yanda açık renkli, feldispatça zengin kabuk; öbür yanda koyu, demirce zengin bazalt.',

  // axes
  Topography: 'Topoğrafya',
  Illumination: 'Aydınlanma',
  'Thermal swing': 'Sıcaklık oynaması',
  'Rock chemistry': 'Kayaç kimyası',
  Terrain: 'Arazi',
  Light: 'Işık',
  Thermal: 'Sıcaklık',
  Rock: 'Kayaç',
  'SRTM elevation': 'SRTM yükseklik verisi',
  'Sun on the DEM': 'Yükseklik modelinde güneş',
  'VIIRS day and night': 'VIIRS gündüz ve gece',
  'Ovabağ lava, sample CA 134': 'Ovabağ lavı, örnek CA 134',
  'Median slope {a}°, relief {b} m': 'Ortanca eğim {a}°, yükselti farkı {b} m',
  'Sun on {dem}': '{dem} üzerinde güneş',
  '{n}% of ground shadowed at 5° sun': 'Güneş 5° yükseklikteyken zeminin %{n} kadarı gölgede',
  '{k} K day to night on the lava field': 'Lav alanında gündüzle gece arasında {k} K',
  'computed from both': 'iki tarafta da hesaplandı',
  'measured vs published': 'yayımlanmış değerle karşılaştırıldı',
  'Axis by axis': 'Eksenlere göre karşılaştırma',
  'What we read on Earth, what is read on {body}, and where the comparison stops holding.':
    'Dünya’da ölçtüğümüz değer, {body} için yayımlanmış değer ve karşılaştırmanın geçerliliğini yitirdiği nokta.',

  // what Earth cannot reproduce
  Gravity: 'Yerçekimi',
  Atmosphere: 'Atmosfer',
  Radiation: 'Radyasyon',
  'Water and life': 'Su ve yaşam',
  Sensors: 'Ölçüm araçları',
  'Earth cannot reproduce 0.17 g (Moon) or 0.38 g (Mars). Tube widths, dust behaviour and mobility do not transfer directly.':
    'Dünya’da 0,17 g (Ay) ya da 0,38 g (Mars) elde edilemez. Tüplerin genişliği, tozun davranışı ve araçların hareketi oraya doğrudan taşınamaz.',
  'One bar of air scatters light into shadows, damps temperature extremes and carries moisture. The Moon has vacuum; Mars has under 1% of our pressure.':
    'Bir barlık hava gölgeleri aydınlatır, sıcaklık uçlarını törpüler ve nem taşır. Ay’da boşluk var; Mars’taki basınç bizimkinin yüzde birinden az.',
  'Our magnetosphere and atmosphere block the radiation that makes tubes attractive as shelters in the first place.':
    'Lav tüplerini sığınak olarak cazip kılan şey radyasyon; oysa Dünya’da manyetik alan ve atmosfer onu zaten kesiyor.',
  'The Ovabağ pits are humid and inhabited. Rain, soil and vegetation alter the basalt at rates unknown on either target.':
    'Ovabağ’daki çukurlar nemlidir ve içlerinde canlı yaşamı vardır. Yağmur, toprak ve bitki örtüsü bazaltı iki hedefte de görülmeyen bir hızla değiştirir.',
  'The four elevation models differ in native resolution (Earth 30 m, Moon 118 m and 20 m, Mars 200 m). All statistics are taken at a 480 m baseline so none is flattered by detail.':
    'Dört yükseklik modelinin çözünürlüğü farklı (Dünya 30 m, Ay 118 m ve 20 m, Mars 200 m). Hiçbiri ayrıntı sayesinde öne geçmesin diye bütün istatistikler 480 m aralıkla alındı.',
  'What Earth cannot reproduce': 'Dünya’da yeniden üretilemeyen koşullar',
  'Stating the limits is part of the result. None of these change with more data.':
    'Sınırların belirtilmesi sonucun bir parçasıdır. Aşağıdakiler daha fazla veriyle değişmez.',
  'The weakest measured axis for each target': 'Her hedef için en zayıf eksen',
  'Where each comparison should not be trusted.': 'Karşılaştırmanın en zayıf kaldığı noktalar.',

  // sidebar
  Fingerprint: 'Parmak izi',
  Field: 'Saha',
  Limits: 'Sınırlar',
  "Elevation (Earth, Moon, Mars), VIIRS surface temperature, Sentinel-1 radar and the sun's position are real data; every terrain and light score is computed from them in the browser. Rock chemistry scores come from published analyses. The pit scan and the thermometer readings are our own, from 14–15 November 2026; the night curve and the lava-tube profile are calculated from these.":
    'Yükseklik (Dünya, Ay, Mars), VIIRS yüzey sıcaklığı, Sentinel-1 radar görüntüsü ve güneşin konumu gerçek veridir. Arazi ve ışık puanlarının tamamı bu verilerden, tarayıcıda hesaplanır. Kayaç kimyası puanları yayımlanmış analizlere dayanır. Çukur taraması ve termometre ölçümleri 14–15 Kasım 2026’da tarafımızdan yapıldı; gece eğrisi ve lav tüpü profili bunlardan hesaplanmıştır.',
  '% terrain match': 'arazi benzerliği (%)',
  'Karacadağ ranks {ord} of {n} Earth sites for the terrain of {name}':
    '{name} arazisine benzerlikte Karacadağ, {n} saha arasında {place}. sırada',
  ', ahead of every established analog tested.': '; denenen bütün bilinen sahaların önünde.',
  ', ahead of {names}. {leader} leads.': '; {names} gibi sahaların önünde. İlk sırada {leader} var.',
  '. {leader} leads.': '. İlk sırada {leader} var.',
  elevation: 'yükseklik',
  across: 'genişlik',
  'elevation models': 'yükseklik modeli',
  'months of VIIRS': 'aylık VIIRS verisi',
  'Four axes. Terrain and light are computed from elevation on both worlds; thermal compares VIIRS with published values; rock chemistry compares published analyses. The other two targets are dashed.':
    'Dört eksen. Arazi ve ışık, iki gezegenin yükseklik verisinden hesaplanıyor. Sıcaklıkta VIIRS ölçümleri yayımlanmış değerlerle, kayaç kimyasında yayımlanmış analizler birbiriyle karşılaştırılıyor. Diğer iki hedef kesikli çizgiyle gösterildi.',

  // leaderboard
  'Against the analog sites NASA already uses': 'NASA’nın kullandığı sahalarla karşılaştırma',
  'Eight 62 km squares of Earth, each compared with {name} by slope, roughness and relief at a {m} m baseline. Light is the overlap of their shadow curves.':
    'Dünya’dan sekiz saha, her biri 62 km’lik bir kare. Hepsi {name} ile eğim, engebe ve yükselti farkı bakımından, {m} m aralıkla karşılaştırıldı. Işık puanı, gölge eğrilerinin ne kadar örtüştüğünü gösteriyor.',
  site: 'saha',
  light: 'ışık',
  terrain: 'arazi',
  'Each square is centred on the site named; a different window would score differently. Terrain only: this says nothing yet about rock, dust or temperature.':
    'Her kare adı geçen sahanın üzerine ortalandı; başka bir pencere başka bir puan verirdi. Bu sıralama yalnızca araziye bakıyor; kayaç, toz ya da sıcaklık hakkında bir şey söylemiyor.',
  'Idaho, USA': 'Idaho, ABD',
  'Hawaiʻi, USA': 'Hawaii, ABD',
  Iceland: 'İzlanda',
  'Arizona, USA': 'Arizona, ABD',
  Chile: 'Şili',
  'Devon Island, Canada': 'Devon Adası, Kanada',
  'California, USA': 'Kaliforniya, ABD',

  // slope and shadow
  'How steep the ground is': 'Eğim dağılımı',
  'Share of each 62 km square at every slope, measured the same way ({m} m baseline) on Karacadağ and on {name}.':
    '62 km’lik karenin her eğim değerine düşen payı. Karacadağ’da ve {name} üzerinde aynı yöntemle ({m} m aralıkla) ölçüldü.',
  '{a} overlap in slope, {b} in roughness, {c} in relief.': 'Eğimde {a}, engebede {b}, yükselti farkında {c} örtüşme.',
  '{a}–{b}° slope': '{a}–{b}° eğim',
  '{v} % of ground': 'zeminin %{v} kadarı',
  median: 'ortanca',
  'Ground in shadow as the sun drops': 'Güneş alçaldıkça gölgede kalan zemin',
  'Horizon angles traced on each elevation model, curvature of the planet included. The lunar south pole never sees the sun above about 1.5°.':
    'Ufuk açıları her yükseklik modelinde, gezegenin eğriliği de hesaba katılarak çıkarıldı. Ay’ın güney kutbunda güneş 1,5°’nin üzerine pek çıkmaz.',
  'At 1.5° of sun, {a} of Karacadağ is in shadow; {b} of {name}.':
    'Güneş 1,5° yükseklikteyken Karacadağ’ın {a} kadarı gölgede; {name} için bu oran {b}.',
  'Sun {e}° above the horizon': 'Güneş ufuktan {e}° yukarıda',
  '{v} % in shadow': '%{v} gölgede',
  'other targets': 'diğer hedefler',

  // a year of temperature
  Jan: 'Oca',
  Feb: 'Şub',
  Apr: 'Nis',
  Jun: 'Haz',
  Jul: 'Tem',
  Aug: 'Ağu',
  Sep: 'Eyl',
  Oct: 'Eki',
  Nov: 'Kas',
  Dec: 'Ara',
  'A year on the lava field, from orbit': 'Lav alanında bir yıl, uydudan',
  'VIIRS monthly surface temperature over the young Ovabağ flows at 13:30 and 01:30, Nov 2025 to Oct 2026.':
    'Genç Ovabağ lavlarının üzerinde VIIRS aylık yüzey sıcaklığı; 13.30 ve 01.30 geçişleri, Kasım 2025 – Ekim 2026.',
  'No temperature series': 'Sıcaklık serisi yok',
  'Run scripts/ingest.py to fetch it.': 'Veriyi çekmek için scripts/ingest.py betiğini çalıştırın.',
  'The surface averages {v} over the year.': 'Yüzeyin yıllık ortalaması {v}.',
  'Summit, day': 'Zirve, gündüz',
  'Summit, night': 'Zirve, gece',
  'Lava field, 13:30': 'Lav alanı, 13.30',
  'Lava field, 01:30': 'Lav alanı, 01.30',
  'field, day': 'lav alanı, gündüz',
  'field, night': 'lav alanı, gece',
  summit: 'zirve',
  'reported in-tube': 'haberde geçen mağara sıcaklığı',
  'A press report puts these caves at 4–5 °C in summer (dashed line). On 14 November we read {t} °C in a partly roofed collapse pit: {gap} K below this annual mean, and warmer than the air outside at the same hour. A pit open to the sky is not a closed tube, so our reading neither confirms the press figure nor rules it out.':
    'Basında bu mağaralar için yazın 4–5 °C değeri bildirilmiştir (kesikli çizgi). 14 Kasım’da tavanı kısmen açık bir çöküntü çukurunda {t} °C ölçtük: yıllık ortalamanın {gap} K altında, aynı saatteki dış havanın ise üzerinde. Üstü açık bir çukur kapalı bir tüple aynı koşullarda değildir; bu nedenle ölçümümüz basındaki değeri ne doğrular ne de çürütür.',

  // what we measured on foot
  'What we measured on foot': 'Sahada ölçtüklerimiz',
  'Ovabağ lava field, 14–15 November 2026: a collapse pit scanned in three dimensions, with thermometers inside and outside it.':
    'Ovabağ lav alanı, 14–15 Kasım 2026: üç boyutlu olarak taranan bir çöküntü çukuru ve çukurun içine ve dışına yerleştirilen termometreler.',
  opening: 'açıklık',
  depth: 'derinlik',
  'still under the roof': 'tavanın örttüğü bölüm',
  'points in the scan': 'taramadaki nokta sayısı',
  'in the pit, 16:00': 'çukurda, 16.00',
  'outside, 16:00': 'dışarıda, 16.00',
  'Humidity in the pit was {h}. Dimensions are read from the scan, at the scale the scanning app exported.':
    'Çukurdaki nem {h} olarak ölçüldü. Boyutlar, tarama uygulamasının verdiği ölçekle taramadan okundu.',
  'The Ovabağ lava field': 'Ovabağ lav alanı',
  'Looking down into the collapse pit': 'Çöküntü çukuruna yukarıdan bakış',
  'The pit mouth under its overhang': 'Kaya saçağının altında çukurun ağzı',
  'A crack in the lava': 'Lavda bir çatlak',
  'A scoria cone on the field': 'Lav alanında bir cüruf konisi',
  'Basalt blocks on the flows': 'Lav akıntılarında bazalt blokları',
  'The night at the pit': 'Çukurda gece',
  'The thermometers stayed in place from 16:00 on 14 November until 06:00 the next morning.':
    'Termometreler 14 Kasım saat 16.00’dan ertesi sabah 06.00’ya kadar yerinde kaldı.',

  // lava tube
  'Inside a lava tube': 'Lav tüpünün içi',
  'How a day of temperature fades with depth, from sunlit basalt to 25 m inside, calculated as a damped wave. The vertical line is the sun slider.':
    'Gün içindeki sıcaklık değişiminin derinlikle nasıl söndüğü, güneş alan bazalttan 25 m içeriye kadar; sönümlü dalga olarak hesaplandı. Dikey çizgi, güneş kaydırıcısında seçili saattir.',
  'Calculated: {a} of swing outside becomes {b} at 25 m.': 'Hesaba göre dışarıdaki {a} değişim, 25 m içeride {b} değerine iniyor.',
  '{h} solar time': 'güneş saatiyle {h}',
  'Sunlit basalt': 'Güneş alan bazalt',
  Shade: 'Gölge',
  Entrance: 'Giriş',
  '10 m in': '10 m içeride',
  '25 m in': '25 m içeride',
  'Lunar pits hold about 17 °C in shade while the surface runs from +127 °C to −173 °C (LRO Diviner). The calculation shows the same damping at the scale of an Earth tube.':
    'Ay’daki çukurlar gölgede 17 °C dolayında kalırken yüzey +127 °C ile −173 °C arasında değişir (LRO Diviner). Hesap, aynı sönümlenmeyi Dünya’daki bir tüpün ölçeğinde gösterir.',

  // terrain overlay
  Elevation: 'Yükseklik',
  'Surface temperature, 13:30': 'Yüzey sıcaklığı, 13.30',
  'Day–night swing': 'Gündüz–gece farkı',
  'Radar backscatter': 'Radar geri saçılımı',
  Slope: 'Eğim',
  'Terrain match': 'Arazi benzerliği',
  'SRTM-derived terrain tiles': 'SRTM’den türetilmiş arazi verisi',
  'VIIRS S-NPP, Oct 2026 mean (NASA GIBS)': 'VIIRS S-NPP, Ekim 2026 ortalaması (NASA GIBS)',
  'VIIRS 13:30 minus 01:30, Oct 2026': 'VIIRS 13.30 ile 01.30 farkı, Ekim 2026',
  'Sentinel-1 C-band VV, Sep–Nov': 'Sentinel-1 C bandı VV, Eylül–Kasım',
  'Derived from elevation': 'Yükseklik verisinden hesaplandı',
  'Slope + roughness statistics vs target': 'Eğim ve engebe istatistikleri hedefle karşılaştırıldı',
  'Not loaded for the twin terrain': 'Bu katman yalnızca Karacadağ için mevcut',
  Layer: 'Katman',
  'LOLA / MOLA elevation': 'LOLA / MOLA yükseklik verisi',
  'Move over the terrain to read it.': 'Değerleri görmek için imleci arazinin üzerinde gezdirin.',
  '{name}, {e} km E {s} km S': '{name}, {e} km D {s} km G',
  '{lat}°N {lon}°E': '{lat}°K {lon}°D',
  slope: 'eğim',
  'K swing': 'K fark',
  'terrain match': 'arazi benzerliği',
  noon: 'öğle',
  'VIIRS overpass': 'VIIRS geçişi',
  'grazing light': 'yatay ışık',
  'sun {e} above horizon, bearing {a}°': 'güneş ufuktan {e} yukarıda, yön {a}°',
  'Local solar time, 14 November': 'Yerel güneş saati, 14 Kasım',
  Relief: 'Kabartma',
  'Relief: how far heights are stretched': 'Kabartma: yüksekliklerin kaç kat büyütüldüğü',
  'Rotate the view': 'Görünümü döndür',
  'Reset the view': 'Görünümü sıfırla',

  'closest terrain to {name} · {score}%': '{name} arazisine en çok benzeyen bölge · %{score}',

  // loading
  'Fetching elevation, temperature and radar': 'Yükseklik, sıcaklık ve radar verisi alınıyor',
  'Deriving slope on three worlds': 'Üç gezegende eğim hesaplanıyor',
  'Scoring eight Earth sites against Mars and the Moon': 'Sekiz saha Mars ve Ay’la karşılaştırılıyor',
  Ready: 'Hazır',
}
