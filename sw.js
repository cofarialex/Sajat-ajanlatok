// =====================================================
//  Service worker – a böngésző a háttérben futtatja
//  "Először hálózat": mindig a friss fájlt próbálja letölteni,
//  és csak ha nincs internet, akkor adja vissza az elmentett változatot.
// =====================================================

const CACHE = "arajanlat-v1"; // ha új fájl kerül a listába, növeld a számot

const APP_FILES = [
  "./", "index.html", "style.css", "data.js", "script.js", "pwa.js",
  "manifest.json", "icon-180.png", "icon-192.png", "icon-512.png",
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
