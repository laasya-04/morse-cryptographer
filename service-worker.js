const CACHE_NAME = "morse-cache-v1";

const urlsToCache = [
  "index.html",
  "about.html",
  "howtouse.html",
  "style.css",
  "script.js",
  "manifest.json",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "offline.html"
];

// Cache files during install
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate and clean up old caches
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});

// Handle fetch requests
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request).then((response) => {
        if (response) return response;

        // Fallback only for navigation requests (pages)
        if (event.request.mode === "navigate") {
          return caches.match("offline.html");
        }
      });
    })
  );
});
