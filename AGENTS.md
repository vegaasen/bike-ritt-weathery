# AGENTS.md

Guidelines for AI coding agents working in this repository.

## What this project is

**Rittvær** is a React + TypeScript single-page app that shows weather forecasts and historical climate averages at key waypoints along Norwegian cycling races. It uses the free [Open-Meteo](https://open-meteo.com) API — no API key needed. The app is deployed to GitHub Pages.

## Commands

```bash
bun install                # install dependencies
bun run dev                # start dev server (Vite)
bun run build              # typecheck (tsc -b) + production build
bun run lint               # ESLint with type-aware rules
bun run fetch-weather      # refresh src/data/weather-cache.json from Open-Meteo
```

**There is no test suite yet.** Do not run `vitest`, `jest`, or `npm test` — they will fail. Adding Vitest is an open roadmap item.

CI runs `lint` + `build` on every push/PR. Always verify both pass before considering a task done:

```bash
bun run lint && bun run build
```

## Key conventions

- **TypeScript strict mode** — no `any`, no implicit returns, no unused vars.
- **Bun** is the runtime and package manager. Use `bun add` / `bun remove`, not `npm`.
- **ESLint** uses `tseslint.configs.recommendedTypeChecked` — type-aware rules are enforced.
- **No component library** — styling is plain CSS in `src/index.css` and `App.css`.
- **No backend** — everything runs in the browser; data fetching is client-side only.

## Project layout

```
src/data/ritt.json           # Race definitions — edit this to add/modify a ritt
src/data/weather-cache.json  # Auto-generated nightly; do NOT manually edit
src/lib/                     # Pure utility functions (no React)
src/hooks/                   # React hooks (TanStack Query wrappers + localStorage)
src/components/              # UI components
src/pages/                   # Route-level page components
scripts/                     # Node/Bun scripts run outside the browser bundle
```

## Adding a ritt

Edit `src/data/ritt.json`. Each entry must follow the existing schema:

```jsonc
{
  "id": "kebab-case-id",          // used in the URL: /ritt/<id>
  "name": "Ritt Name",
  "distance": 88,                  // km
  "region": "Innlandet",
  "officialDate": "2025-08-23",   // ISO date, update each season
  "waypoints": [                   // exactly 5 entries: start, 3 intermediate, finish
    { "name": "Start", "lat": 60.123, "lng": 10.456, "altitude": 200, "km": 0 },
    ...
  ]
}
```

Waypoint coordinates should be verified against GPX files or race maps — many are still manually approximated.

## Weather cache

`src/data/weather-cache.json` is written by `scripts/fetch-weather-cache.ts` and committed by a nightly GitHub Actions workflow (`.github/workflows/refresh-weather.yml`). It holds pre-fetched historical averages so the app works without hitting the API on every load for far-future dates. Do not hand-edit this file.

## CI / deploy

| Workflow | Trigger | What it does |
|---|---|---|
| `ci.yml` | push/PR (non-doc files) | lint + build |
| `pages.yml` | push to `main` (non-doc files) | build + deploy to GitHub Pages |
| `refresh-weather.yml` | nightly 03:00 UTC + manual | fetch weather cache + commit |

Markdown files and issue templates are excluded from triggering CI and deploy via `paths-ignore`.
