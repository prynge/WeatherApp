self.addEventListener('fetch', function(event) {
  if (event.request.url == "https://api.openweathermap.org/data/2.5/weather") {
    console.info('responding to OWM fetch with Service Worker! 🤓');
    event.respondWith(fetch(event.request).catch(function(e) {
      var retrievedObject = localStorage.getItem('location');
      return new Response(JSON.parse(retrievedObject));
    }));
  }

  if (event.request.url == "https://api.openweathermap.org/data/2.5/onecall") {
    console.info('responding to OWM fetch with Service Worker! 🤓');
    event.respondWith(fetch(event.request).catch(function(e) {
      var retrievedObject = localStorage.getItem('location');
      return new Response(JSON.parse(retrievedObject));
    }));
  }

  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open('the-magic-cache').then(function(cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
        '/img/logo.ico',
        '/js/script.js',
        '/css/master.css',
      ]);
    })
  );
});


