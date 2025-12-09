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
  const shouldActivateImmediately = !self.registration || !self.registration.active;
  const preCache = caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_URLS));
  const forceActivate = shouldActivateImmediately ? self.skipWaiting() : Promise.resolve();

  event.waitUntil(Promise.all([preCache, forceActivate]));
});

self.addEventListener('activate', (event) => {
  const clearOldCaches = caches.keys().then((keys) =>
    Promise.all(
      keys.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
        return null;
      })
    )
  );
  const claimClients = self.clients && self.clients.claim ? self.clients.claim() : Promise.resolve();

  event.waitUntil(Promise.all([clearOldCaches, claimClients]));
});

self.addEventListener('message', (event) => {
  if (event?.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
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
