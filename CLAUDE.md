# Project brief

## Project (fill this in)
- **Idea:** BlackMountain — a twin-sensor "analog fingerprint" that scores the Karacadağ lava field (Ovabağ lava tubes) against Moon and Mars targets, for the NASA Space Apps 2026 analog challenge.
- **Demo flow:** 3D terrain with data layers → pick a target (Arsia Mons / Tranquillitatis pit / Shackleton ridge) and read the fingerprint → Field tab: lava-tube thermal profile and rock counts → sun timeline to grazing light, then Limits.
- **Judging criteria:** impact, creativity, validity, relevance, presentation.
- **Data:** elevation is real; thermal, radar, scores and field readings are placeholders (marked † in the UI) until the team supplies data. See README "Data status".
- **Design:** monochrome, no boxed cards, no badges or decorative icons; type and hairlines only, one accent (`ember`).

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
