// Knotwork Deep service worker: keeps the whole game cached so it opens in airplane mode.
const CACHE = 'knotwork-8.45-76746';
const FILES = ["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","icon-maskable-512.png","apple-touch-icon.png","favicon-32.png"];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  // cache first (it works offline); the page itself refreshes in the background when there is a connection
  e.respondWith(caches.match(req, { ignoreSearch: true }).then((hit) => {
    const net = fetch(req).then((res) => {
      if (res && res.ok && (req.mode === 'navigate' || FILES.some((f) => f !== './' && req.url.endsWith(f)))) {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
      }
      return res;
    }).catch(() => hit || caches.match('index.html'));
    return hit || net;
  }));
});
