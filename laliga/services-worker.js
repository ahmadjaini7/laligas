const CACHE_NAME = "Liga-spanyol-v10";
const urlToCache = [
    "/",
    "/index.html",
    "/navbar.html",
    "/manifest.json",
    "/team.html",
    "/swcon.js",
    "/css/materialize.min.css",
    "/css/style.css",
    "/css/font.woff2",
    "/image/laliga.png",
    "/image/icons/icon-72.png",
    "/image/icons/icon-96m.png",
    "/image/icons/icon-128m.png",
    "/image/icons/icon-144m.png",
    "/image/icons/icon-152m.png",
    "/image/icons/icon-192m.png",
    "/image/icons/icon-512m.png",
    "/js/materialize.min.js",
    "/js/navbar.js",
    "/js/api.js",
    "/js/db.js",
    "/js/idb.js",
    "/js/logo/77.png",
    "/js/logo/78.png",
    "/js/logo/79.png",
    "/js/logo/80.png",
    "/js/logo/81.png",
    "/js/logo/82.png",
    "/js/logo/83.png",
    "/js/logo/86.png",
    "/js/logo/88.png",
    "/js/logo/89.png",
    "/js/logo/90.png",
    "/js/logo/92.png",
    "/js/logo/94.png",
    "/js/logo/95.png",
    "/js/logo/250.png",
    "/js/logo/263.png",
    "/js/logo/278.png",
    "/js/logo/558.png",
    "/js/logo/559.png",
    "/js/logo/745.png",
    "/pages/home.html",
    "/pages/saved.html",
    "/pages/teams.html"
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