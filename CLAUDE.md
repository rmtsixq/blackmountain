# Project brief

## Project (fill this in)
- **Idea:** BlackMountain — scores the Karacadağ lava field (SE Türkiye) as a Moon / Mars analog from real elevation, temperature and radar data, and ranks it against the analog sites NASA already uses. NASA Space Apps 2026.
- **Demo flow:** the first screen is a language choice (Türkçe / English, or `?lang=tr|en`). Then Findings mode: eleven chapters (cover with the field panorama → Mars twin → ranking vs NASA analog sites → heat → rock chemistry → the pit scan → the night at the pit → pit scale → polar light → where to go → the result), stepped with arrow keys or autoplay. Each chapter is tagged by its evidence: measured on foot, measured from orbit, or published data. "Data" in the header opens the full instrument view (space bar morphs, leaderboard, Field and Limits tabs).
- **Judging criteria:** impact, creativity, validity, relevance, presentation.
- **Data:** everything drawn on the terrain is real (`scripts/ingest.py` → `public/data`). Terrain and light scores are computed in `src/lib/analysis.ts`. Field data from 14–15 Nov 2026: the pit scan (`scan/pit-scan.ply` → `scripts/scan.py` → `public/data/pit.p16`, `src/data/pitScan.ts`), the photos in `public/field`, and the thermometer readings (`LOG` in `src/data/pit.ts`; the thermometers stayed in place 16:00–06:00, add further readings there). Rock chemistry scores come from published analyses (`src/data/rock.ts`). Grids and the scan are stored packed (`scripts/pack.py`, read by `src/lib/pack.ts`); the raw scan (`scan/`, root `*.ply`) stays out of git because it is too large to push. There is no radar score: Sentinel-1 is shown only as Karacadağ's own radar image. Published data in `src/data/pit.ts`: hourly air temperature for the night (Open-Meteo) and Moon/Mars pit dimensions (LROC; Cushing et al. 2007). Calculated, not measured: the pit-floor night curve (`pitModel` in `src/data/pit.ts`) and the lava-tube profile (`src/data/field.ts`). The UI carries no "model" label, no placeholders and no † marks; each chart's caption says the curve is calculated. The whole app is bilingual. Findings text lives in `src/lib/story.ts` and `src/lib/i18n.ts`; the Data view looks strings up by their English text in `src/lib/tr.ts` (`x('…')` from `useT()`), so after changing any English string run `python scripts/check_tr.py`. Turkish is written to read naturally, not translated word for word.
- **Design:** system type (SF / Segoe UI), a light page with neutral greys, and black rounded media tiles (terrain, scan, field photos). Colour means one thing each: yellow (`field`) = measured by us on foot, red (`accent`) = the other world in a comparison; orbit data is neutral ink, a calculated curve is drawn dashed and described as calculated in its caption. Data-view controls are minimal and sit directly on the tile: one line of world names, small layer swatches, a hairline relief slider. Tokens live in `src/index.css`. Never present a calculated curve as measured.

## Stack
Vite + React + TypeScript + Tailwind CSS v4 (already scaffolded and installed).

## How to work
- Reply in the language I write in. Keep answers short; show, don't explain.
- Move fast. Ask at most one question at a time, only when truly blocked; otherwise pick a sensible default and state it in one line.
- The dev server is already running in another pane with HMR (`npm run dev`). Do not start it yourself, and keep it working at all times — never leave the app in a broken state.
- Commit after every working feature with a short conventional message (`feat: ...`, `fix: ...`, `style: ...`).

## Web conventions
- TypeScript everywhere, functional React components, one component per file under `src/components/`.
- Styling with Tailwind utility classes only; no separate CSS files except `index.css` / `globals.css` for theme tokens.
- Design: modern and polished — consistent spacing scale, rounded corners, subtle shadows and borders, a clear type hierarchy, smooth hover/transition states, dark-mode friendly colors. Mobile responsive by default.
- Every screen needs loading, empty and error states. Use realistic seed/demo data so nothing looks blank during the demo.
- Prefer small, well-known libraries when they save real time: `lucide-react` (icons), `framer-motion` (animation), `recharts` (charts), `react-router-dom` (routing, Vite only), `zustand` (state). Ask before adding anything heavy.
- No backend unless the idea needs one. If it does: Vite → a small Express or Hono server in `server/`; Next.js → route handlers in `app/api/`. Mock external APIs when keys are missing.
- Secrets go in `.env` (gitignored); keep `.env.example` up to date.
- No tests unless asked. No over-engineering.
- If something fails twice, stop and propose a simpler path instead of looping.
- Keep `README.md` current: what it is, screenshots placeholder, how to run, tech used — judges read it.
