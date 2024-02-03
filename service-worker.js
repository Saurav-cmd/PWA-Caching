
 const cacheName = "cacheAssets-v3"
//It triggers when service worker gets installed on 

 //This is on install event 
self.addEventListener('install', (event) => {
    // console.log('SW install', event);

    // Activate itself when it enters the waiting phase.
    self.skipWaiting();

    event.waitUntil(        
        caches.open(cacheName)
            .then((cache) => {
                cache.addAll([
                    '/',
                    '/index.html',
                    '/assets/musical-note.png',
                    '/assets/musical-note_resized.png',
                    '/js/index.js',
                    '/css/index.css',
                    '/manifest.json',
                    '/service-worker.js'
                ]);
            })
            .catch((error) => {
        console.log("Cashe Assets failed", error);
        })
    )

});


//his is on activate event it will get something from the thing we cached
self.addEventListener('activate', (event) => {

    console.log('Activated service worker', event);
    // this is used to get immediate control over the open tabs
    event.waitUntil(clients.claim());
   
    //Remove caches which is not used or the item not matches with new cache name
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                cacheNames.forEach((item) => {
                    if (item != cacheName) {
                        caches.delete(item);
                    }
                });
            })
    );

});

//This will receives all the cached assets like the images, html, css, js
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open(cacheName)
        .then(async (cache) => {
            const response = await cache.match(event.request);
            return response || fetch(event.request);
        })
);
});

