// =====================================================
//  Telepíthető app (PWA = Progressive Web App) – ugyanúgy, mint a FoodShare-ben
//  - manifest.json: az app neve, ikonja, színe
//  - sw.js (service worker): a háttérben fut, elmenti a fájlokat, így internet nélkül is megnyílik
//  FONTOS: csak http(s)-en működik (Live Server: igen, dupla kattintás / file://: nem).
// =====================================================

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}

// Chrome/Edge/Android: ha telepíthető, megjelenítjük a saját "Telepítés" gombunkat
let installPrompt = null;

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  installPrompt = event;
  document.getElementById("installButton").classList.remove("hidden");
});

document.getElementById("installButton").addEventListener("click", async () => {
  if (!installPrompt) return;
  installPrompt.prompt();
  await installPrompt.userChoice;
  installPrompt = null;
  document.getElementById("installButton").classList.add("hidden");
});

window.addEventListener("appinstalled", () => {
  document.getElementById("installButton").classList.add("hidden");
});
