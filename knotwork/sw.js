// Knotwork Deep service worker: keeps the whole game cached so it opens in airplane mode.
const CACHE = 'knotwork-8.145-19438';
const FILES = ["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","icon-maskable-512.png","apple-touch-icon.png","favicon-32.png"];
// (8.124) the battle songs: kept in a cache of their own from version to version, each the first time the game fetches it;
// an old render of a song (another hash) is dropped
const MUSIC = 'knotwork-music';
const SONGS = ["music/act1-fight.mp3?v=8056121fd1","music/act2-fight.mp3?v=1cfaf0d0b8","music/act3-fight.mp3?v=e945e3a831","music/act4-fight.mp3?v=69afd3fde0","music/act1-boss.mp3?v=c2975ec8e6","music/act2-boss.mp3?v=32d6afa012","music/act3-boss.mp3?v=61e1105873","music/act4-boss.mp3?v=b9e73446e3"];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE && k !== MUSIC).map((k) => caches.delete(k))))
    .then(() => caches.open(MUSIC)).then((c) => c.keys().then((reqs) => Promise.all(reqs.filter((r) => { const u = new URL(r.url); return !SONGS.some((s) => u.pathname.endsWith('/' + s.split('?')[0]) && u.search === '?' + s.split('?')[1]); }).map((r) => c.delete(r)))))
    .catch(() => {}).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  if (new URL(req.url).pathname.includes('/music/')) {
    e.respondWith(caches.open(MUSIC).then((c) => c.match(req).then((hit) => hit || fetch(req).then((res) => { if (res && res.ok) c.put(req, res.clone()); return res; }))));
    return;
  }
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
