const CACHE_NAME = 'geohogar-cache-v40';
const ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/i18n.js',
  '/js/app.js',
  '/js/ui.js',
  '/js/data.js',
  '/js/map.js',
  '/js/firebase-auth.js',
  '/js/firebase-db.js',
  '/js/ai-assistant.js',
  '/js/alerts.js',
  '/js/currency.js',
  '/js/glossary.js',
  '/js/broker.js',
  '/js/broker-alerts.js',
  '/js/broker-valuation.js',
  '/manifest.json'
];

// Install Event
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // We use addAll but wrap in catch to prevent failure if some asset is missing
      return cache.addAll(ASSETS).catch(err => console.log('Error caching initial assets:', err));
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event (Network First, fallback to cache)
self.addEventListener('fetch', (e) => {
  // Only handle GET requests and local/web resources (no firebase or external APIs)
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) {
    return;
  }

  e.respondWith(
    fetch(e.request)
      .then((res) => {
        // Cache clone of successful responses
        if (res.status === 200) {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, resClone);
          });
        }
        return res;
      })
      .catch(() => caches.match(e.request).then((cachedResponse) => cachedResponse || fetch(e.request)))
  );
});
