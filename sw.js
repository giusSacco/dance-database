const CACHE_NAME = 'dance-db-v2';
const ASSETS = [
    './',
    './index.html',
    './css/styles.css',
    './js/app.js',
    './js/state.js',
    './js/storage.js',
    './js/render.js',
    './js/tags.js',
    './js/editor.js',
    './js/moves.js',
    './js/video.js',
    './js/ai.js',
    './js/ui.js',
    './js/data/default-moves.js',
    './js/data/default-links.js',
    './js/data/tag-meta.js',
    './manifest.json'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    // Network-first for CDN resources, cache-first for local assets
    const url = new URL(event.request.url);

    if (url.origin !== location.origin) {
        // CDN resources: try network first, fall back to cache
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                    return response;
                })
                .catch(() => caches.match(event.request))
        );
    } else {
        // Local assets: cache first, fall back to network
        event.respondWith(
            caches.match(event.request)
                .then(cached => cached || fetch(event.request))
        );
    }
});
