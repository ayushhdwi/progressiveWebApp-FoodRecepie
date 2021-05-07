// it is the cache that is not supposed to change as much (or shell) 
const staticCacheName = 'site-static-v2';

const dynamicCache = 'dynamic-cache-v1';

// it is: assets to store in cache
const assets = [
    "/",
    "/index.html",
	"/pages/fallback.html",
    "js/app.js",
    "js/ui.js",
    "js/materialize.js",
    "css/style.css",
    "css/materialize.css",
    "img/dish.png",
    "https://fonts.googleapis.com/css2?family=Material+Icons",
	"img/icons/manifest-icon-192.png",
	"img/icons/manifest-icon-512.png"
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
			.filter(key => key !== staticCacheName)
			.map(key => caches.delete(key))
		})
	)
});

// it is: fetch event
self.addEventListener('fetch', fetchEvent => {
	// console.log('fetc	h event', fetchEvent);
	fetchEvent.respondWith(
		caches.match(fetchEvent.request).then(cacheRes => {
			return cacheRes || fetch(fetchEvent.request).then(fetchRes => {
				return caches.open(dynamicCache).then(cache => {
					// * put() function puts the given response in the cache
					// * and thats why we cloned it first so that we could
					// * return the original response later
					cache.put(fetchEvent.request.url,fetchRes.clone());
					return fetchRes; // dsa
				})
			})
		})
	)
});