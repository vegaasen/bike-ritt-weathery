# Startstreken 🚴

**Sjekk været langs ruten for norske sykkelritt, langrenn, triathlon og ultraløp.**

Pick a Norwegian race, choose a date, and get weather conditions at ~5 key points along the route — from start to finish. Uses live forecasts when the date is close, and 10-year historical climate averages when planning further ahead.

**Live app: [vegaasen.github.io/startstreken](https://vegaasen.github.io/startstreken/)**

---

## Features

- Browse 36 well-known Norwegian sykkelritt with official race dates
- Select any date to see weather along the route
- **Forecast mode** — live data from Open-Meteo when the date is ≤ 16 days away
- **Climate average mode** — 10-year historical average (2015–2024) for dates further in the future
- **Pacing** — set start/finish time to get waypoint-specific hourly forecasts
- **Gear suggestions** — rule-based recommendations from temperature, precipitation, and wind
- **Elevation profile** — SVG chart with waypoint markers
- **Map view** — Leaflet map with colour-coded waypoint pins and OSRM route polyline
- **Bookmarks** — save ritt + date combos via "Mine ritt" (persisted in localStorage)
- **Wind direction** — compass bearing + relative label (Medvind/Motvind/Sidevind)
- **Feels-like temperature** — `apparent_temperature` from Open-Meteo
- **Precipitation probability** — % chance of rain alongside expected mm
- Shareable URLs — date is stored in the query string (`/ritt/birkebeinerrittet?date=2025-08-23`)
- Dark mode via `prefers-color-scheme`

## Ritt included

| Ritt | Distance | Region | Disiplin |
|---|---|---|---|
| Birkebeinerrittet | 88 km | Innlandet | Terreng |
| GravelBirken | 92 km | Innlandet | Terreng |
| HalvBirken Sykkel | 46 km | Innlandet | Terreng |
| UltraBirken | 110 km | Innlandet | Terreng |
| Styrkeprøven | 540 km | Trøndelag / Innlandet | Landevei |
| Jotunheimen Rundt | 430 km | Innlandet / Vestland | Landevei |
| Bergen-Voss | 78 km | Vestland | Landevei |
| Haugastøl–Bergen | 182 km | Vestland | Landevei |
| Rallarvegen | 82 km | Vestland / Viken | Terreng |
| Nordsjørittet (Egersund–Flekkefjord) | 91 km | Rogaland | Landevei |
| Nordsjørittet (Jæren, Egersund–Sandnes) | 88 km | Rogaland | Landevei |
| Lysebotn Opp | 14 km | Rogaland | Landevei |
| Lysebotn-Bryne Rittet | 147 km | Rogaland | Landevei |
| Garborgriket Rundt | 70 km | Rogaland | Terreng |
| Haugesund-Sauda | 107 km | Rogaland / Vestland | Landevei |
| L'Étape Trondheim | 130 km | Trøndelag | Landevei |
| Victoriarunden | 120 km | Trøndelag | Landevei |
| Tour de Frøya | 44 km | Trøndelag | Landevei |
| Øyungen Rundt | 45 km | Trøndelag | Terreng |
| Nordmarka Rundt | 148 km | Oslo / Viken | Landevei |
| OBOS Terrengsykkelrittet | 28 km | Oslo | Terreng |
| Color Line Tour | 210 km | Agder | Landevei |
| Tyrifjorden Rundt | 145 km | Viken | Landevei |
| Eikerrittet | 90 km | Viken | Landevei |
| Stenhoggerrittet | 46 km | Viken | Terreng |
| Elgrittet | 54 km | Viken | Terreng |
| Randsfjorden Rundt | 152 km | Viken | Landevei |
| Grenserittet | 80 km | Østfold / Sverige | Terreng |
| Skjebergrittet | 38 km | Østfold | Terreng |
| Valdresrittet | 54 km | Innlandet | Terreng |
| Mjøsrittet | 167 km | Innlandet | Landevei |
| Sjusjørittet | 56 km | Innlandet | Terreng |
| Trysil-Knut / Osensjøen Rundt Gravel | 60 km | Innlandet | Terreng |
| Skjærgårdsrittet | 75 km | Vestland | Landevei |
| Tour de Lyngen | 94 km | Troms | Landevei |
| Midnattsolrittet | 46 km | Nordland | Landevei |

---

## Getting started

```bash
bun install
bun run dev            # starts dev server
bun run build          # production build (tsc + vite)
bun run lint           # ESLint (type-aware)
bun run fetch-weather  # refresh src/data/weather-cache.json manually
```

The weather cache (`src/data/weather-cache.json`) is also refreshed nightly via GitHub Actions — you only need `fetch-weather` locally if you want fresh historical data before committing.

## Project structure

```
src/
  data/
    ritt.json                    # Curated ritt with waypoints
    weather-cache.json           # Nightly-refreshed historical weather cache (auto-generated)
  lib/
    weather.ts                   # Open-Meteo forecast + historical fetchers
    wmo.ts                       # WMO weather code → Norwegian label + emoji
    wind.ts                      # Wind direction helpers + relative label (Medvind/Motvind/Sidevind)
    timing.ts                    # Waypoint arrival time calculator from start/finish time
    difficulty.ts                # Difficulty rating derived from weather + route conditions
    ritt.ts                      # Ritt data helpers and type definitions
  hooks/
    useWeather.ts                # TanStack Query wrapper (useQueries per waypoint)
    useMyRitt.ts                 # Bookmark persistence in localStorage
    usePageTitle.ts              # Sets <title> per route
  components/
    RittCard.tsx                 # Race card on the home page
    RittMap.tsx                  # Leaflet map with waypoints + OSRM route polyline
    DatePicker.tsx               # Date input with reset-to-official-date button
    TimePicker.tsx               # Start/finish time inputs
    WeatherStrip.tsx             # Row of weather cards + forecast/climate banner
    WeatherCard.tsx              # Per-waypoint: temp, rain, wind, icon
    ElevationProfile.tsx         # SVG elevation chart with waypoint dots
    GearSuggestion.tsx           # Gear recommendations from weather conditions
    HistoricalWeatherTable.tsx   # Historical averages table view
    ShareButton.tsx              # Copy shareable link to clipboard
    NavBar.tsx                   # Top navigation bar
    ErrorBoundary.tsx            # App-level + per-strip error boundary
    ReloadPrompt.tsx             # PWA update prompt
  pages/
    HomePage.tsx                 # Ritt grid, sorted by official date
    RittPage.tsx                 # Detail: meta + date picker + weather strip
    NotFoundPage.tsx             # 404 catch-all
  App.tsx                        # Router + QueryClientProvider
scripts/
  fetch-weather-cache.ts         # Fetches historical data and writes weather-cache.json
```

## Tech stack

| | |
|---|---|
| Framework | React 19 + TypeScript 6 (strict) |
| Build | Vite 8, Bun |
| Routing | react-router-dom v7 |
| Data fetching | TanStack Query v5 |
| Map | Leaflet + react-leaflet |
| PWA | vite-plugin-pwa |
| Weather API | [Open-Meteo](https://open-meteo.com) (free, no auth) |

---

## Roadmap

### Open

- [ ] **Langrenn** — add cross-country ski races (Birkebeinerrennet, Holmenkollmarsjen etc.); add `type` field to data model; show relative humidity for ski disciplines
- [ ] **Triathlon** — add Norwegian triathlon events (e.g. Norseman, Isklar Norseman Xtreme); multi-discipline waypoint support
- [ ] **Ultraløp** — add Norwegian ultra runs (e.g. Nordmarka 100, Romeriksåsen Ultra); adapt waypoint model for running
- [ ] **GPX upload** — derive waypoints automatically from a GPX file
- [ ] **Official start time pre-fill** — pre-populate start time with the known mass-start time per ritt
- [ ] **Comparison mode** — show official date vs custom date side by side
- [ ] **Hourly breakdown** — expand a waypoint card to show hour-by-hour forecast
- [ ] **Elevation-aware pacing** — `calcFinishTimeFromSpeed` currently uses linear distance; add elevation correction
- [ ] **Tests** — Vitest unit tests for `weather.ts` (mocked fetch) and `wmo.ts`
- [ ] **Offline / PWA** — cache last-fetched weather for use without connectivity
- [ ] **Weather trend indicator** — warmer/colder arrow relative to day before
- [ ] **UV index** — relevant for long summer ritt on exposed mountain terrain
- [ ] **Wet road risk** — combine recent precip + temp to flag likely icy/wet conditions

### Data quality

- [ ] **Verify waypoint coordinates** — several ritt are manually curated; cross-check against GPX files or Strava segments
- [ ] **Altitude values** — confirm `altitude` per waypoint for accurate temperature correction
- [ ] **Official dates** — update `ritt.json` each year when terminlisten is published

---

## Data sources

- Weather: [Open-Meteo](https://open-meteo.com) — free, CORS-friendly, no API key required
- Race calendar: [sykling.no](https://sykling.no/sykkelritt/terminliste/)
- EQTimer APIs: https://api.eqtiming.com/docs#!/Event
- Route waypoints: manually curated from maps and race websites
