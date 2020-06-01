const cacheName = 'Umara-Snack-v0.5'
const precacheResources = [
  '/',
  'index.html',
  'manifest.json',
  'assets/fonts/AirbnbCereal-Bold.ttf',
  'assets/fonts/AirbnbCereal-Book.ttf',
  'assets/fonts/MaterialIcons-Regular.ttf',
  'assets/img/icons/icon-72x72.png',
  'assets/img/icons/icon-96x96.png',
  'assets/img/icons/icon-128x128.png',
  'assets/img/icons/icon-144x144.png',
  'assets/img/icons/icon-152x152.png',
  'assets/img/icons/icon-192x192.png',
  'assets/img/icons/icon-384x384.png',
  'assets/img/icons/icon-512x512.png',
  'assets/img/hero.jpg',
  'assets/pages/home.html',
  'assets/pages/alamat.html',
  'assets/pages/keranjang.html',
  'assets/pages/tentang.html',
  'assets/pages/kontak.html',
  'assets/pages/pemesanan.html',
  'assets/pages/kategori.html',
  'assets/pages/produk.html',
  'assets/js/main.js',
  'assets/js/api.js',
  'assets/js/router.js',
  'assets/js/helper.js',
  'assets/css/main.css'
]

self.addEventListener('install', event => {
  console.log('Service worker install event!')
  event.waitUntil(
    caches.open(cacheName)
    .then(cache => {
      // console.log('ready to cache')
      return cache.addAll(precacheResources)
    })
    .catch(e => console.log(e))
  )
})

self.addEventListener('activate', event => {
  console.log('Service worker activate event!')
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== cacheName && cache.startsWith("Umara-Snack")) {
            return caches.delete(cache)
          }
        })
      )
    })
  )
})

const timeoutableFetch = (url, options = {}) => {
  let { timeout = 7000, ...rest } = options
  if (rest.signal) throw new Error("Signal not supported in timeoutable fetch")
  const controller = new AbortController()
  const { signal } = controller
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("Timeout for Promise"))
      controller.abort()
    }, timeout)
    fetch(url, { signal, ...rest })
      .finally(() => clearTimeout(timer))
      .then(resolve, reject)
  })
}

self.addEventListener('fetch', event => {

  // toastBroadcast.postMessage({ payload: event })
  // console.log(event.request)
  event.respondWith(
    timeoutableFetch(event.request).then(response => {
      caches.open(cacheName).then(function(cache) {
        cache.put(event.request, response.clone())
      })
      return response.clone()
    }).catch((err) => {
      console.log('network gagal memuat dari cache')
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse
          }
        })
    })

    // caches.match(event.request)
    // .then(cachedResponse => {
    //   if (cachedResponse) {
    //     return cachedResponse
    //   }
    //   fetch(event.request)
    //     .then(response => {
    //       cache.put(event.request, response.clone())
    //       return response
    //     })
    // })
    // event.respondWith(
    //   caches.open(cacheName).then(function(cache) {
    //     return cache.match(event.request).then(function(response) {
    //       var fetchPromise = fetch(event.request).then(function(networkResponse) {
    //         cache.put(event.request, networkResponse.clone())
    //         return networkResponse
    //       })
    //       return response || fetchPromise
    //     })
    //   })
    // )
  )
})

const toastBroadcast = new BroadcastChannel('toast-channel');
// toastBroadcast.onmessage = (event) => {
//   if (event.data && event.data.type === 'INCREASE_COUNT') {
//     toastBroadcast.postMessage({ payload: ++count })
//   }
// }