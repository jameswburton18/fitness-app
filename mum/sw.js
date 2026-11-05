const CACHE = 'stepwise-v1';
// Sturdy at the site root shares this origin, so only clear our own caches.
// figure.js and moves.js are shared with Sturdy and live one level up.
const ASSETS = ['./', './index.html', '../figure.js', '../moves.js', './manifest.webmanifest', './icon.svg'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('stepwise-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Network-first for our own pages (so updates land), cache fallback for offline.
// Fonts and other cross-origin requests: cache-first after first use.
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  if (url.origin === location.origin) {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
          return res;
        })
        .catch(() => caches.open(CACHE).then(c => c.match(e.request).then(m => m || c.match('./index.html'))))
    );
  } else {
    e.respondWith(
      caches.open(CACHE).then(c => c.match(e.request)).then(m => m || fetch(e.request).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      }))
    );
  }
});
