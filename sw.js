const CACHE = "gelm-audio-cache-v1";

self.addEventListener("install", e => {
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(clients.claim());
});

self.addEventListener("fetch", e => {
  const req = e.request;

  // Ignorar peticiones con Range (audio streaming correcto)
  if (req.headers.has("range")) {
    return;
  }

  // Solo cachear audio
  if (req.destination === "audio") {
    e.respondWith(
      caches.open(CACHE).then(cache =>
        cache.match(req).then(cached => {
          if (cached) return cached;

          return fetch(req).then(res => {
            cache.put(req, res.clone());
            return res;
          });
        })
      )
    );
  }
});
