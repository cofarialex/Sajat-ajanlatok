// =====================================================
//  Service worker – a böngésző a háttérben futtatja
//  "Először hálózat": mindig a friss fájlt próbálja letölteni,
//  és csak ha nincs internet, akkor adja vissza az elmentett változatot.
// =====================================================

const CACHE = "arajanlat-v5"; // ha új fájl kerül a listába, növeld a számot

const APP_FILES = [
  "./", "index.html", "style.css", "data.js", "i18n.js", "script.js", "pdf.js", "pwa.js",
  "firebase-config.js", "cloud.js", "jobs.js",
  "manifest.json", "logo.svg", "icon-180.png", "icon-192.png", "icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(APP_FILES)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  // Csak a saját fájljainkat, a betűtípusokat és a Firebase könyvtárat mentjük el.
  // Az adatbázis forgalmát (firestore.googleapis.com) nem szabad elkapni, azt a Firebase intézi.
  const url = event.request.url;
  const ours = url.startsWith(self.location.origin) || url.includes("gstatic.com") || url.includes("fonts.googleapis.com");
  if (!ours) return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
