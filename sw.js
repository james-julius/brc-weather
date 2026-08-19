/* Playa Weather service worker: precache the shell, network-first for weather APIs
   (falling back to the last cached response when offline on-playa). */
const SHELL = "playa-shell-v1";
const DATA = "playa-data-v1";
const SHELL_URLS = ["./", "./index.html", "./manifest.webmanifest", "./icon.svg"];
const API_HOSTS = ["api.open-meteo.com", "air-quality-api.open-meteo.com", "archive-api.open-meteo.com", "api.weather.gov"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(SHELL).then(c => c.addAll(SHELL_URLS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== SHELL && k !== DATA).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

/* Android periodic background sync: refresh the core forecast into the data cache
   so the app opens with recent data even if it was closed when signal was available. */
const QS = "latitude=40.786&longitude=-119.204&timezone=America%2FLos_Angeles&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch";
self.addEventListener("periodicsync", e => {
  if (e.tag !== "refresh-weather") return;
  e.waitUntil(caches.open(DATA).then(c => Promise.allSettled([
    "https://api.open-meteo.com/v1/forecast?" + QS + "&forecast_days=16" +
      "&current=temperature_2m,wind_speed_10m,wind_gusts_10m,wind_direction_10m,relative_humidity_2m,precipitation" +
      "&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_gusts_10m_max,wind_speed_10m_max,sunrise,sunset" +
      "&hourly=wind_gusts_10m,wind_speed_10m,wind_direction_10m,temperature_2m,relative_humidity_2m,precipitation_probability",
    "https://api.weather.gov/alerts/active?point=40.786,-119.204",
  ].map(u => fetch(u).then(r => { if (r.ok) return c.put(u, r); })))));
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  const bucket = API_HOSTS.includes(url.host) ? DATA : SHELL;
  // network-first everywhere: always fresh online, last-synced copy on-playa
  e.respondWith(
    fetch(e.request)
      .then(r => {
        if (r.ok || r.type === "opaque") {
          const copy = r.clone();
          caches.open(bucket).then(c => c.put(e.request, copy));
        }
        return r;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: false }))
  );
});
