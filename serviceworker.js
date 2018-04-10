var VERSION = 1;
var STATIC_CACHE_NAME = 'static_' + VERSION;

var ORIGIN = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + "/progrun/";

var FILES = [
	"progrun.png",
	"progrun-192x192.png",
	"base.css",
	"progrun.css",
	"util.js",
	"https://fonts.googleapis.com/css?family=Sansita+One",
	"https://fonts.googleapis.com/css?family=Source+Code+Pro:600,900",
];
var STATIC_FILES = [];
FILES.forEach(function(s) {
	if (!(s.startsWith("http://") || s.startsWith("https://"))) {
		s = ORIGIN + s;
	}
	STATIC_FILES.push(s);
});

var STATIC_FILE_URL_HASH = {};
STATIC_FILES.forEach(function(x) { STATIC_FILE_URL_HASH[x] = true; });

self.addEventListener('install', function(evt) {
	evt.waitUntil(caches.open(STATIC_CACHE_NAME).then(function(cache) {
		return Promise.all(STATIC_FILES.map(function(url) {
			console.log(url);
			return fetch(new Request(url)).then(function(response) {
				if (response.ok)
					return cache.put(response.url, response);
				return Promise.reject("Invalid response " + response.url + " " + response.status);
			});
		}));
	}));
});

self.addEventListener('fetch', function(evt) {
	if (!STATIC_FILE_URL_HASH[evt.request.url])
		return;
	var res = caches.match(evt.request, { cacheName: STATIC_CACHE_NAME });
	evt.respondWith(res);
});
 
self.addEventListener('activate', function(evt) {
	evt.waitUntil(caches.keys().then(function(keys) {
		var promises = [];
		keys.forEach(function(cacheName) {
			if (cacheName != STATIC_CACHE_NAME)
				promises.push(caches.delete(cacheName));
		});
		return Promise.all(promises);
	}));
});

