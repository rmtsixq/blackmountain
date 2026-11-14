# Project brief

## Project (fill this in)
- **Idea:** <one sentence: what it does and for whom>
- **Demo flow:** <the 3–4 screens/clicks the judges will see>
- **Judging criteria:** <e.g. innovation, technical depth, design, impact>

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
