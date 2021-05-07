// ! it is the cache that is not supposed to change as much (or shell) 
const staticCacheName = 'site-static';
// ! what assets to store in cache
const assets = [
    "/",
    "/index.html",
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


// install event
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

// activation event
self.addEventListener('activate', actEvent => {
	// console.log('Service worker has been activated', actEvent);
});

// fetch event
self.addEventListener('fetch', fetchEvent => {
	console.log('fetch event', fetchEvent);
	// fetchEvent.waitUntil(
	
	// )
	fetchEvent.respondWith(
			caches.match(fetchEvent.request).then(cacheRes => {
				return cacheRes || fetch(fetchEvent.request);
			})
		)
});

// self.addEventListener('fetch', event => {
// 	event.respondWith(
		
// 	);
// 	event.waitUntil(
		
// 	);
// });