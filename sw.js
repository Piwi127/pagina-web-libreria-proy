const CACHE_VERSION = "v1";
const STATIC_CACHE = `static-${CACHE_VERSION}`;

const PRECACHE_URLS = [
  "index.html",
  "catalogo.html",
  "detail.html",
  "ofertas.html",
  "contacto.html",
  "trabajos.html",
  "redaccion.html",
  "redaccion-cv.html",
  "redaccion-documentos.html",
  "redaccion-revision.html",
  "assets/css/styles.css",
  "assets/js/ui.js",
  "assets/js/cart.js",
  "assets/js/cards.js",
  "assets/js/search.js",
  "assets/js/search-suggest.js",
  "assets/js/render-products.js",
  "assets/js/product-carousel.js",
  "assets/js/render-offers.js",
  "assets/js/products.js",
  "assets/js/product-specs.js",
  "assets/js/pwa.js",
  "assets/data/featured-products.json",
  "assets/data/offers.json",
  "assets/img/logonuevo.png",
  "assets/img/noise.svg",
  "assets/img/icon.svg",
  "manifest.webmanifest"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== STATIC_CACHE)
            .map((key) => caches.delete(key))
        )
      )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then((res) => res || caches.match("index.html")))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => cached);
    })
  );
});
