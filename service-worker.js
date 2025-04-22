const CACHE_NAME = "morse-cache-v1";
const urlsToCache = [
  "/morse-cryptographer/",
  "/morse-cryptographer/about.html",
  "/morse-cryptographer/index.html",
  "/morse-cryptographer/style.css",
  "/morse-cryptographer/script.js",
  "/morse-cryptographer/howtouse.html",
  "/morse-cryptographer/manifest.json",
  "/morse-cryptographer/icons/icon-192.png",
  "/morse-cryptographer/icons/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
    );
    });
self.addEventListener('activate', event => {
  console.log('Service Worker activated!');
});
