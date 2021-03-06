//importScripts('');

const staticAssests = [
	'./',
	'./styles.css',
	'./app.js'
];

self.addEventListener('install', async event => {
	const cache = await caches.open('new-static');
	cache.addAll(staticAssests);
});

self.addEventListener('fetch', event => {
	const req = event.request;
	const url = new URL(req.url);

	console.log('origin: '+url.origin);	
	console.log('location: '+location.origin);	
	if(url.origin === location.origin) {
		event.respondWith(cacheFirst(req));
	} else {
		event.respondWith(networkFirst(req));
	}
});

async function cacheFirst(req) {
	const cachedResponse = await caches.match(req);
	return cachedResponse || fetch(req);
}

async function networkFirst(req) {
	console.log(networkFirst);
	const cache = await caches.open('news-dynamic');

	try {
		const res = await fetch(req);
		cache.put(req, res.clone());
		return res;
	} catch (error) {
		return await cache.match(req);
	}
}
