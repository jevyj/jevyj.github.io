// Knotwork Deep service worker: keeps the whole game cached so it opens in airplane mode.
const CACHE = 'knotwork-8.188-83070';
const FILES = ["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","icon-maskable-512.png","apple-touch-icon.png","favicon-32.png"];
// (2026-11-15, the journeys) the lands' pictures: kept in a cache of their own from version to version, each the first time the
// game fetches it (a run fetches the lands ahead of it as it goes); a land's old picture (another hash) is dropped
const LANDS = 'knotwork-lands';
const LANDFILES = ["lands/arabia-labels.webp?v=e2c3746c14","lands/arabia.webp?v=130d22f210","lands/ashwoods-labels.webp?v=fe4df6c3fc","lands/ashwoods.webp?v=cac354366a","lands/circle-entrance-arabia.webp?v=5efbbbd556","lands/circle-entrance-eden.webp?v=62dd09f7bf","lands/circle-labels.webp?v=a04c05f21a","lands/circle.webp?v=e6f367c4f2","lands/eden-labels.webp?v=56752f6728","lands/eden.webp?v=0bc72272d0","lands/erythraeum-entrance-ashwoods.webp?v=ab0f16d07a","lands/erythraeum-entrance-xanthe.webp?v=eba2fb2c3a","lands/erythraeum-labels.webp?v=4c9854473d","lands/erythraeum.webp?v=051095b880","lands/hellespontus-entrance-promethei.webp?v=5f6c8d4f46","lands/hellespontus-entrance-shore.webp?v=e98fd4953f","lands/hellespontus-labels.webp?v=ccf22065a4","lands/hellespontus.webp?v=b1f41d84d2","lands/ismenius-labels.webp?v=0430ad1fe5","lands/ismenius.webp?v=9198de60aa","lands/northrim-entrance-circle.webp?v=23f1845d74","lands/northrim-entrance-erythraeum.webp?v=81e102c86c","lands/northrim-entrance-hellespontus.webp?v=7230eeec9d","lands/northrim-labels.webp?v=da416d4767","lands/northrim.webp?v=377bf3045b","lands/promethei-labels.webp?v=5a3622493c","lands/promethei.webp?v=eb674c00ed","lands/rootways-entrance-circle.webp?v=d0838fc186","lands/rootways-entrance-erythraeum.webp?v=8adad1c535","lands/rootways-entrance-hellespontus.webp?v=a95b776035","lands/rootways-labels.webp?v=0ae94341fb","lands/rootways.webp?v=6801167ce3","lands/shore-labels.webp?v=d67baa13c8","lands/shore.webp?v=96c8fbff91","lands/still-labels.webp?v=5df37edef7","lands/still.webp?v=e0509b0855","lands/tyrrhena-labels.webp?v=7eb1acef7d","lands/tyrrhena.webp?v=f66ec6cb9d","lands/world-over.webp?v=b97437a002","lands/world.webp?v=5a009981cf","lands/xanthe-labels.webp?v=0dd6fccecb","lands/xanthe.webp?v=59d935f22d"];
// (8.124) the battle songs: kept in a cache of their own from version to version, each the first time the game fetches it;
// an old render of a song (another hash) is dropped
const MUSIC = 'knotwork-music';
const SONGS = ["music/act1-fight.mp3?v=8056121fd1","music/act2-fight.mp3?v=1cfaf0d0b8","music/act3-fight.mp3?v=e945e3a831","music/act4-fight.mp3?v=69afd3fde0","music/act1-boss.mp3?v=c2975ec8e6","music/act2-boss.mp3?v=32d6afa012","music/act3-boss.mp3?v=61e1105873","music/act4-boss.mp3?v=b9e73446e3","music/still-map.mp3?v=c205d03af3","music/still-fight.mp3?v=b96dcab8f1","music/still-boss.mp3?v=1abf236a2e","music/ismenius-map.mp3?v=ccfb838ad1","music/ismenius-fight.mp3?v=f217803508","music/ismenius-boss.mp3?v=9ac4478722","music/tyrrhena-map.mp3?v=37ecbd8e12","music/tyrrhena-fight.mp3?v=38b3f9fc00","music/tyrrhena-boss.mp3?v=2448d542fc","music/ashwoods-map.mp3?v=e76f36a1a6","music/ashwoods-fight.mp3?v=7227bf9e82","music/ashwoods-boss.mp3?v=43261479f4","music/xanthe-map.mp3?v=35cec6c7eb","music/xanthe-fight.mp3?v=95ea762dc5","music/xanthe-boss.mp3?v=651b95cd33","music/eden-map.mp3?v=9eb21fac9c","music/eden-fight.mp3?v=56c0cbdaf6","music/eden-boss.mp3?v=c0dd49e94c","music/arabia-map.mp3?v=5d53b81a48","music/arabia-fight.mp3?v=97b89c20f9","music/arabia-boss.mp3?v=ce03b902a9","music/shore-map.mp3?v=7c55b9ef1b","music/shore-fight.mp3?v=7dc468e1a1","music/shore-boss.mp3?v=72ae3ea90b","music/promethei-map.mp3?v=1c5bc54c90","music/promethei-fight.mp3?v=aca86b5ff8","music/promethei-boss.mp3?v=147c95110e","music/erythraeum-map.mp3?v=0c81e87d2c","music/erythraeum-fight.mp3?v=ad1848ba69","music/erythraeum-boss.mp3?v=a012dde87b","music/circle-map.mp3?v=7d0af84d6f","music/circle-fight.mp3?v=a1403816c1","music/circle-boss.mp3?v=faa6f8a623","music/hellespontus-map.mp3?v=74545bd444","music/hellespontus-fight.mp3?v=5506dc2a4b","music/hellespontus-boss.mp3?v=39c4f652da","music/northrim-map.mp3?v=cb536e6539","music/northrim-fight.mp3?v=9855d0d21d","music/northrim-boss.mp3?v=d1e3e1910b","music/rootways-map.mp3?v=376a047520","music/rootways-fight.mp3?v=22943e7112","music/rootways-boss.mp3?v=afd6f3e79a"];
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
