# BlackMountain

Is Karacadağ, a little-studied basalt shield in southeast Türkiye, a useful stand-in for the Moon and Mars?
BlackMountain answers with real data: it compares the mountain with three exploration targets using the same measurements on both worlds, ranks it against the analog sites NASA already uses, and then checks the result on foot: a collapse pit scanned and measured in the field on 14 November 2026.

Built for the NASA Space Apps Challenge 2026, *Identify Earth Locations that Analog the Permanent Moon Base Locations and Mars*.

## Screenshots

_Add screenshots here._

## What it does

- **Morph.** Press space: Karacadağ turns into Arsia Mons (Mars), the Mare Tranquillitatis pit region or the Shackleton connecting ridge (Moon) — real elevation, the same 62 km square, the same vertical scale.
- **Terrain match.** Slope, roughness and relief distributions are computed on every elevation model at a 480 m baseline and compared (Jensen–Shannon distance). A map shows where on the mountain the ground is closest to each target.
- **Leaderboard.** The same score for seven established analog sites (Mauna Loa, Craters of the Moon, Askja, San Francisco Volcanic Field, Atacama, Haughton, Death Valley), so the number means something.
- **Light.** Real solar geometry on the terrain, and shadow curves ray-traced on each elevation model with planetary curvature — the lunar south pole never sees the sun above about 1.5°.
- **Heat and radar.** VIIRS surface temperature (day, night, a full year) and Sentinel-1 backscatter draped on the terrain. The radar layer is Karacadağ's own image only; no radar score is claimed, because no comparable surface radar exists for Mars or the Moon.
- **Rock chemistry.** Ten major oxides of an Ovabağ lava sample compared with Spirit rover basalts and Apollo samples, all from published analyses (`src/data/rock.ts`).
- **The pit.** Our own scan of a collapse pit, about 11 m across and 6 m deep, drawn as a point cloud (`python scripts/scan.py <export.ply>`), with the temperature we read there.
- **Limits.** Where each analogy breaks, stated next to every score.
- **Findings.** After a language choice (Türkçe / English) the app opens on eleven findings, one per screen, each beside its evidence: the terrain, a field photograph or the scan. Every finding is tagged by where its evidence comes from: measured on foot, measured from orbit, published lab analyses, or illustrative †. Arrow keys or autoplay step through them (use autoplay for the demo video). **Data** opens every instrument. Both views are in Turkish and English.

Deep links: `?lang=tr`, `?chapter=5`, or `?mode=explore&target=shackleton&twin=1&layer=terrain&hour=16.6` (`still=1` skips transitions).

## Results so far

Terrain match of Karacadağ, and its rank among eight Earth sites:

| Target | Match | Rank | Leader |
|---|---|---|---|
| Arsia Mons, Mars | 60% | 6th | Mauna Loa |
| Mare Tranquillitatis pit region, Moon | 63% | 3rd | Craters of the Moon |
| Shackleton connecting ridge, Moon | 46% | 6th | Mauna Loa |

Mauna Loa, the standard shield-volcano analog, comes out first for Arsia Mons, which is a sanity check on the method.
The scores describe one 62 km window per site and terrain only.

Rock chemistry match of Ovabağ lava (ten major oxides, 100 = identical): Mars basalt (Spirit, Gusev) 65, lunar mare basalt (Apollo 11) 54, lunar highland soil (Apollo 16) 39. For scale, Mars basalt against lunar mare basalt scores 56. The Mars rocks are from Gusev crater, not Arsia Mons.

Field, 14 November 2026: a collapse pit about 11 m across and 6 m deep with a third of its roof standing (scale not yet tape-checked); 13.0 °C in the pit against 10.3 °C outside at about 15:00, 75% humidity.

## Data

| Layer | Source |
|---|---|
| Earth elevation | AWS Terrain Tiles (SRTM-derived) |
| Surface temperature | VIIRS S-NPP monthly LST via NASA GIBS (the service behind NASA Worldview) |
| Radar | Sentinel-1 C-band seasonal backscatter (Copernicus; Earth Big Data on AWS Open Data) |
| Mars elevation | MOLA + HRSC blended DEM, 200 m (USGS Astrogeology) |
| Moon elevation | LRO LOLA 118 m global (USGS) and 20 m south-pole model (NASA PGDA) |

`python scripts/ingest.py` fetches all of it into `public/data` (`pip install -r scripts/requirements.txt`).

**Still placeholders**, marked † in the app: the 24-hour temperature curve and the Moon / Mars pit catalogue points (`src/data/pit.ts`), and the station positions and readings, lava-tube temperature profile and rock counts (`src/data/field.ts`).

## Run

```bash
npm install
npm run dev
```

## Tech

Vite, React, TypeScript, Tailwind CSS v4, three.js (react-three-fiber, drei), Recharts, Zustand, Framer Motion. Python (rasterio, numpy) for data ingest.
