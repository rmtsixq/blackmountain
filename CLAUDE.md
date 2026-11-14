# Project brief

## Project (fill this in)
- **Idea:** BlackMountain — scores the Karacadağ lava field (SE Türkiye) as a Moon / Mars analog from real elevation, temperature and radar data, and ranks it against the analog sites NASA already uses. NASA Space Apps 2026.
- **Demo flow:** press "play the 40 s tour" (sun sweep → VIIRS → Sentinel-1 → morph into Arsia Mons and the Shackleton ridge → terrain-match map). Then: space bar to morph, pick a target, read the leaderboard, Field tab, Limits tab.
- **Judging criteria:** impact, creativity, validity, relevance, presentation.
- **Data:** everything drawn on the terrain is real (`scripts/ingest.py` → `public/data`). Terrain and light scores are computed in `src/lib/analysis.ts`. Still placeholders, marked † in the UI: radar and rock scores for the targets (`src/data/targets.ts`) and station readings, tube profile and rock counts (`src/data/field.ts`).
- **Design:** monochrome, no boxed cards, no badges or decorative icons; type and hairlines only, one accent (`ember`). Never present a placeholder as measured.

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
