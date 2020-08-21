const CACHE_NAME = "Liga-spanyol-v10";
const urlToCache = [
    "/laligas.github.io/",
    "/laligas.github.io/index.html",
    "/laligas.github.io/navbar.html",
    "/laligas.github.io/manifest.json",
    "/laligas.github.io/team.html",
    "/laligas.github.io/swcon.js",
    "/laligas.github.io/css/materialize.min.css",
    "/laligas.github.io/css/style.css",
    "/laligas.github.io/css/font.woff2",
    "/laligas.github.io/image/laliga.png",
    "/laligas.github.io/image/icons/icon-72.png",
    "/laligas.github.io/image/icons/icon-96m.png",
    "/laligas.github.io/image/icons/icon-128m.png",
    "/laligas.github.io/image/icons/icon-144m.png",
    "/laligas.github.io/image/icons/icon-152m.png",
    "/laligas.github.io/image/icons/icon-192m.png",
    "/laligas.github.io/image/icons/icon-512m.png",
    "/laligas.github.io/js/materialize.min.js",
    "/laligas.github.io/js/navbar.js",
    "/laligas.github.io/js/api.js",
    "/laligas.github.io/js/db.js",
    "/laligas.github.io/js/idb.js",
    "/laligas.github.io/js/logo/77.png",
    "/laligas.github.io/js/logo/78.png",
    "/laligas.github.io/js/logo/79.png",
    "/laligas.github.io/js/logo/80.png",
    "/laligas.github.io/js/logo/81.png",
    "/laligas.github.io/js/logo/82.png",
    "/laligas.github.io/js/logo/83.png",
    "/laligas.github.io/js/logo/86.png",
    "/laligas.github.io/js/logo/88.png",
    "/laligas.github.io/js/logo/89.png",
    "/laligas.github.io/js/logo/90.png",
    "/laligas.github.io/js/logo/92.png",
    "/laligas.github.io/js/logo/94.png",
    "/laligas.github.io/js/logo/95.png",
    "/laligas.github.io/js/logo/250.png",
    "/laligas.github.io/js/logo/263.png",
    "/laligas.github.io/js/logo/278.png",
    "/laligas.github.io/js/logo/558.png",
    "/laligas.github.io/js/logo/559.png",
    "/laligas.github.io/js/logo/745.png",
    "/laligas.github.io/pages/home.html",
    "/laligas.github.io/pages/saved.html",
    "/laligas.github.io/pages/teams.html"
];


// menerapkan services worker
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlToCache);
        })
    );
});

// offline
self.addEventListener("fetch", event => {
    let baseUrl = "https://api.football-data.org/v2/";

    if (event.request.url.indexOf(baseUrl) > -1) {
        event.respondWith(
            caches.open(CACHE_NAME)
                .then(cache => {
                    return fetch(event.request)
                        .then(response => {
                            cache.put(event.request.url, response.clone());
                            return response;
                        })
                })
        )
    } else {
        event.respondWith(
            caches.match(event.request, {
                ignoreSearch: true
            })
                .then(response => {
                    return response || fetch(event.request);
                })
        )
    }
});

// menghapus cache lama untuk version 
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName != CACHE_NAME) {
                        console.log("ServiceWorker: cache " + cacheName + " dihapus");
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});


// web push
self.addEventListener('push', function (event) {
    let body;
    if (event.data) {
        body = event.data.text();
    } else {
        body = 'Push message no payload';
    }
    const options = {
        body: body,
        icon: 'image/icons/Icon-512.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };
    event.waitUntil(
        self.registration.showNotification('Push Notification', options)
    );
});
