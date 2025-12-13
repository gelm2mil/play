const CACHE = "gelm-cache-v1";

self.addEventListener("install", e => {
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(clients.claim());
});

self.addEventListener("fetch", e => {
  const req = e.request;

  // SOLO cachear audio
  if (req.destination === "audio") {
    e.respondWith(
      caches.open(CACHE).then(cache =>
        cache.match(req).then(res => {
          return res || fetch(req).then(net => {
            cache.put(req, net.clone());
            return net;
          });
        })
      )
    );
  }
});
