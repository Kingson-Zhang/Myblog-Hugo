importScripts('https://cdn.jsdelivr.net/npm/workbox-cdn/workbox/workbox-sw.js')

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`)

  workbox.routing.registerRoute(
    /\.(?:js|css)$/,
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'static-resources'
    })
  )

  workbox.routing.registerRoute(
    /\.(?:png|jpg|jpeg|svg|gif)$/,
    new workbox.strategies.CacheFirst({
      cacheName: 'image-cache',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 20,
          maxAgeSeconds: 7 * 24 * 60 * 60
        })
      ]
    })
  )

  workbox.routing.registerRoute(
    /^https:\/\/fonts\.googleapis\.com/,
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'google-fonts-stylesheets'
    })
  )

  workbox.routing.registerRoute(
    /^https:\/\/fonts\.gstatic\.com/,
    new workbox.strategies.CacheFirst({
      cacheName: 'google-fonts-webfonts',
      plugins: [
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200]
        }),
        new workbox.expiration.Plugin({
          maxAgeSeconds: 60 * 60 * 24 * 365,
          maxEntries: 30
        })
      ]
    })
  )
} else {
  console.log(`Boo! Workbox didn't load 😬`)
}