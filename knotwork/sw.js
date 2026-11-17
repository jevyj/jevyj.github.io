// Knotwork Deep service worker: keeps the whole game cached so it opens in airplane mode.
const CACHE = 'knotwork-8.171.2-78335';
const FILES = ["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","icon-maskable-512.png","apple-touch-icon.png","favicon-32.png"];
// (2026-11-15, the journeys) the lands' pictures: kept in a cache of their own from version to version, each the first time the
// game fetches it (a run fetches the lands ahead of it as it goes); a land's old picture (another hash) is dropped
const LANDS = 'knotwork-lands';
const LANDFILES = ["lands/arabia.webp?v=9fa78d5ef2","lands/ashwoods.webp?v=71d9d30dfe","lands/circle.webp?v=d9bec8f54d","lands/eden.webp?v=9e231d7687","lands/erythraeum.webp?v=8f2c091bfd","lands/hellespontus.webp?v=d7b35f2dce","lands/ismenius.webp?v=6cb4d3baae","lands/northrim.webp?v=df8d8e67ac","lands/promethei.webp?v=3f2b9c08b8","lands/rootways.webp?v=eba7ab09b1","lands/shore.webp?v=551f632878","lands/still.webp?v=86803b2478","lands/tyrrhena.webp?v=cec5115d23","lands/world-over.webp?v=b247f68dc9","lands/world.webp?v=be5cf09fc3","lands/xanthe.webp?v=ef5aa08e97"];
// (8.124) the battle songs: kept in a cache of their own from version to version, each the first time the game fetches it;
// an old render of a song (another hash) is dropped
const MUSIC = 'knotwork-music';
const SONGS = ["music/act1-fight.mp3?v=8056121fd1","music/act2-fight.mp3?v=1cfaf0d0b8","music/act3-fight.mp3?v=e945e3a831","music/act4-fight.mp3?v=69afd3fde0","music/act1-boss.mp3?v=c2975ec8e6","music/act2-boss.mp3?v=32d6afa012","music/act3-boss.mp3?v=61e1105873","music/act4-boss.mp3?v=b9e73446e3"];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE && k !== MUSIC && k !== LANDS).map((k) => caches.delete(k))))
    .then(() => caches.open(LANDS)).then((c) => c.keys().then((reqs) => Promise.all(reqs.filter((r) => { const u = new URL(r.url); return !LANDFILES.some((s) => u.pathname.endsWith('/' + s.split('?')[0]) && u.search === '?' + s.split('?')[1]); }).map((r) => c.delete(r)))))
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
  if (new URL(req.url).pathname.includes('/lands/')) {
    e.respondWith(caches.open(LANDS).then((c) => c.match(req).then((hit) => hit || fetch(req).then((res) => { if (res && res.ok) c.put(req, res.clone()); return res; }))));
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
