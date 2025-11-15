/* eslint-disable no-restricted-globals */
/**
 * Service worker padrão responsável por cachear assets estáticos
 * e fornecer comportamento offline básico.
 */
// A referência abaixo é necessária para o next-pwa injetar a lista de assets precacheados.
// eslint-disable-next-line no-undef
self.__WB_MANIFEST;

const CACHE_NAME = 'bjj-academy-cache-v1';
const OFFLINE_URLS = ['/', '/login', '/dashboard'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(OFFLINE_URLS);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
          return null;
        })
      )
    )
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => caches.match('/login'));
    })
  );
});
