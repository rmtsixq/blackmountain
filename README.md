# BlackMountain

A twin-sensor analog fingerprint of Karacadağ (SE Türkiye) for Moon and Mars exploration.
Built for the NASA Space Apps Challenge 2026: *Identify Earth Locations that Analog the Permanent Moon Base Locations and Mars*.

The young basalt flows and lava tubes around Ovabağ are compared against three targets — Arsia Mons (Mars), the Mare Tranquillitatis pit and the Shackleton Connecting Ridge (Moon) — on five axes. Each axis pairs an Earth instrument with a Moon/Mars instrument that measures the same physics, and states where the analogy breaks.

## Screenshots

_Add screenshots here._

## What is in the app

- **3D terrain** of a 62 × 62 km scene, drawn as stacked elevation profiles coloured by the active data layer.
- **Layers:** elevation, surface temperature, radar roughness, slope, analog score per target.
- **Sun simulation:** real solar geometry for the field day; drag the timeline to cast shadows, including the grazing light used for the polar-light test.
- **Probe:** hover the terrain for coordinates, values and the west–east transect.
- **Fingerprint:** radar chart and axis-by-axis comparison per target.
- **Field:** stations, lava-tube thermal profile, rock abundance against the Golombek–Rapp model, low-sun rock detection.
- **Limits:** what Earth cannot reproduce.

Deep links: `?layer=score&target=tranq&hour=16.6`.

## Data status

| Real | Simulated placeholder (marked † in the UI) |
|---|---|
| Elevation (`public/dem`, Terrarium tiles, zoom 11) | Surface temperature, radar roughness |
| Slope, relief shading | Analog scores and axis read-outs |
| Sun position | Station positions and readings, tube profile, rock counts |

To swap in real data: station and chart values live in `src/data/field.ts`, target scores in `src/data/targets.ts`, raster layers in `computeFields` in `src/lib/layers.ts`.

## Run

```bash
npm install
npm run dev
```

## Tech

Vite, React, TypeScript, Tailwind CSS v4, three.js (react-three-fiber, drei), Recharts, Zustand, Framer Motion.

Elevation: Terrain Tiles on AWS (SRTM-derived).
