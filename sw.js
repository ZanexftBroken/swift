const CACHE_NAME = 'swift-pos-v1';
const urlsToCache = [
  './index.html',
  './manifest.json'
];

// Install Service Worker and Cache App Shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Serve Cached content when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request).then(fetchRes => {
            return caches.open(CACHE_NAME).then(cache => {
                // Cache new requests dynamically (like Firebase scripts, Tailwind)
                if(event.request.method === 'GET' && event.request.url.startsWith('http')) {
                    cache.put(event.request, fetchRes.clone());
                }
                return fetchRes;
            });
        });
      }).catch(() => {
          // If offline and not cached, just fail gracefully
          console.log("You are offline.");
      })
  );
});
