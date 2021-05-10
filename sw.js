// it is the cache that is not supposed to change as much (or shell) 
const staticCacheName = 'site-static-v14';
const dynamicCacheName = 'dynamic-cache-v16';

// it is: assets to store in cache
const assets = [
    "/",
    "/index.html",
    "pages/fallback.html",
    "js/app.js",
    "js/ui.js",
    "js/materialize.js",
    "css/style.css",
    "css/materialize.css",
    "img/dish.png",
    "https://fonts.googleapis.com/icon?family=Material+Icons",
    "https://fonts.googleapis.com/css2?family=Material+Icons",
    "https://fonts.gstatic.com/s/materialicons/v85/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2",
    "img/icons/manifest-icon-192.png",
    "img/icons/manifest-icon-512.png",
];

// it is: install event
self.addEventListener('install',installEvent => {
	// console.log('service worker has been installed', installEvent);
	installEvent.waitUntil(
		caches.open(staticCacheName).then(cache => {
			console.log('caching shell assets');
			// use to add a single item
			// cache.add
			// * use to add a array of items
			cache.addAll(assets);
		})
	);
});

// it is: activation event
self.addEventListener('activate', actEvent => {
	// console.log('Service worker has been activated', actEvent);
	actEvent.waitUntil(
		caches.keys().then(keys => {
			// console.log(key);
			return keys
			.filter(key => key !== staticCacheName && key !== dynamicCacheName)
			.map(key => caches.delete(key))
		})
	)
});

// it is: cache size limiting function
const limitCacheSize = (name,size) => {
	caches.open(name).then(cache => {
		cache.keys().then(keys => {
			if(keys.length > size) {
				cache.delete(keys[0]).then(limitCacheSize(name, size));
			}
		})
	})
}

// it is: fetch event
self.addEventListener('fetch', fetchEvent => {
	// console.log('fetc	h event', fetchEvent);
	if(fetchEvent.request.url.indexOf('firestore.googleapis.com') === -1) {

		fetchEvent.respondWith(
			caches.match(fetchEvent.request).then(cacheRes => {
                return (
                    cacheRes || fetch(fetchEvent.request).then((fetchRes) => {
                        return caches.open(dynamicCacheName).then((cache) => {
                            // * put() function puts the given response in the cache and thats why
                            // * we cloned it first so that we could return the original response later
                            if(fetchEvent.request.url.indexOf('chrome-extension') === -1) {
								// * if the request contains chrome-extension://xyz in URL then skip
								cache.put(fetchEvent.request.url, fetchRes.clone());
							}
								limitCacheSize(dynamicCacheName, 15);
								return fetchRes;
                        });
                    })
                );
                // * here we can serve the fallback page. this promisse neither returned the asset
                // * from cache nor from server (as its offline)
            }).catch(() => {
				if(fetchEvent.request.url.indexOf('.html') > -1) {
					return caches.match('/pages/fallback.html')
				}
			})
		);
	}
});