const cacheName = 'version 1.18'
self.addEventListener("install", function (event) {
  // console.log('WORKER: install event in progress.');
  event.waitUntil(
    /* The caches built-in is a promise-based API that helps you cache responses,
       as well as finding and deleting them.
    */
    caches
      /* You can open a cache by name, and this method returns a promise. We use
         a versioned cache name here so that we can remove old cache entries in
         one fell swoop later, when phasing out an older service worker.
      */
      .open(cacheName)
      .then(function (cache) {
        /* After the cache is opened, we can fill it with the offline fundamentals.
           The method below will add all resources we've indicated to the cache,
           after making HTTP requests for each of them.
        */
        return cache.addAll([
          './',
          './audio/bloop.wav',
          './audio/roll.wav',
          './audio/tick.wav',
          './audio/whoosh.wav',
          './images/icon-72.png',
          './images/icon-96.png',
          './images/icon-128.png',
          './images/icon-144.png',
          './images/icon-152.png',
          './images/icon-192.png',
          './images/icon-384.png',
          './images/icon-512.png',
          './images/logo.png',
          'src/css/animations.css',
          'src/css/index.css',
          'src/js/dice.js',
          'src/js/domUpdates.js',
          'src/js/game.js',
          'src/js/index.js',
          'src/js/player.js',
          'src/js/points.js',
          './index.html',
        ]);
      })
      .then(function () {
        console.log('WORKER: install completed');
      })
  );
});

self.addEventListener('message', function (event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
  caches.keys().then(function (names) {
    for (let name of names)
      if(name !== cacheName) caches.delete(name);
  });
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});