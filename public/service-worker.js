console.log("Hi from your service-worker.js file!");
const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/index.js',
  '/styles.css',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// Add code to install and register your service worker.
// install
self.addEventListener("install", function (evt) {
    // pre cache image data
    evt.waitUntil(
      caches.open(DATA_CACHE_NAME).then((cache) => cache.add("/routes/transaction"))
      );
      
    // pre cache all static assets
    evt.waitUntil(
      caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
    );
  
    // tell the browser to activate this service worker immediately once it
    // has finished installing
    self.skipWaiting();
  });
// ^^^ If done successfully, you should see your static cache in your Application tab.
  
// Add code to activate the service worker and remove old data from the cache.
  self.addEventListener("activate", function(evt) {
    evt.waitUntil(
      caches.keys().then(keyList => {
        return Promise.all(
          keyList.map(key => {
            if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
              console.log("Removing old cache data", key);
              return caches.delete(key);
            }
          })
        );
      })
    );
  
    self.clients.claim();
  });

// // Enable the service worker to intercept network requests.
  self.addEventListener('fetch', function(evt) {
    // code to handle requests goes here
    });

// // Serve static files from the cache. Proceed with a network request when the resource is not in the cache. 
// // This code allows the page to be accessible offline. (This code should be placed in the function handling the fetch event.)
evt.respondWith(
  caches.open(CACHE_NAME).then(cache => {
    return cache.match(evt.request).then(response => {
      return response || fetch(evt.request);
    });
  })
);

// Type the remaining code to cache responses for requests for data. 
// The function handling the fetch event should resemble the following: