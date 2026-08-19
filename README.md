# 🔥 Playa Weather

Live weather, dust forecasts, and burn-week outlook for **Black Rock City, NV** — built for Burning Man 2026.

**No build step. No API keys. No backend.** One HTML file, free public weather APIs, and an offline-first PWA so it keeps working on the playa with no signal.

## Features

- **Live city map** — the BRC plan (Esplanade–K, trash fence, the Man, Temple, Center Camp) with animated dust particles driven by real wind speed & direction, and rain streaks when rain is forecast. Day/night lighting follows actual sunrise/sunset.
- **Time scrubber** — three modes: **Now** (72 h hourly), **Build Week** (Aug 23–29), and **Burn Week** (Aug 30 – Sep 6) with stylized Gate open, Man Burn 🔥 and Temple Burn moments. The whole dashboard follows the slider.
- **BMIR weatherman** — a generated radio-style forecast narration for whichever hour you're scrubbed to, plus a live BMIR 94.5 stream player that auto-detects when the station is broadcasting (it's seasonal).
- **Dust risk everywhere** — gust-based heuristic (18/25/35 mph tiers), per day *and* per night for every burn-week day.
- **Rain awareness** — hourly probability charts, mud-risk flags, wet-playa warnings. Remember 2023.
- **Model comparison** — Open-Meteo blend vs HRRR vs GFS vs ECMWF vs ICON daily max gusts.
- **Live observations** — nearest RAWS ridge stations (Bluewing, Fox Mountain, …) via the free NWS API.
- **10-year climatology** — burn-week days beyond the forecast horizon show typical conditions computed from ERA5 history.
- **Offline PWA** — service worker + cached data; re-syncs opportunistically whenever you have signal, serves the last sync when you don't.

## Data sources (all free)

| Source | Used for |
|---|---|
| [Open-Meteo](https://open-meteo.com/) | Forecast (blend + HRRR/GFS/ECMWF/ICON), air quality, 10-yr ERA5 archive |
| [NWS api.weather.gov](https://api.weather.gov) | Alerts + live RAWS station observations |
| [BMIR 94.5](https://bmir.org) | Live radio stream (seasonal) |

## Run it

Open `index.html` in a browser. That's it.

For the installable offline PWA, serve it over HTTPS (e.g. Cloudflare Pages):

```sh
npx wrangler pages deploy .
```

Preview the wet-playa UI anytime with `index.html?demo=rain`.

---

🔥 Leave no trace — nothing stored, everything fetched fresh.
