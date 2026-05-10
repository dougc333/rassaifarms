const CACHE_NAME = "rassai-farms-v2";

const CACHE_ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./script.js",
  "./assets/photos/apricot-boxes.jpg",
  "./assets/photos/black-fig.jpg",
  "./assets/photos/fresh-apricots-hand.jpg",
  "./apricots/figs/green_figs.png",
  "./apricots/quince/quince.png",
  "./assets/photos/blenheim-trees.png",
  "./assets/full/apricot-boxes.jpg",
  "./assets/full/black-fig.jpg",
  "./assets/full/fresh-apricots-hand.png",
  "./assets/full/green-figs.png",
  "./assets/full/quince.png",
  "./assets/full/blenheim-trees.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CACHE_ASSETS))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  if (event.request.destination !== "image") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      });
    })
  );
});
