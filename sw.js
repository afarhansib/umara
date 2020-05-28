const cacheName = 'Umara-Snack-v0.1'
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
  'assets/images/hero.jpg',
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
      console.log('ready to cache')
      return cache.addAll(precacheResources)
    })
    .catch(e => console.log(e))
  )
})

self.addEventListener('activate', event => {
  console.log('Service worker activate event!')
})

self.addEventListener('fetch', event => {
  event.respondWith(caches.match(event.request)
    .then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse
      }
      return fetch(event.request)
    })
  )
})