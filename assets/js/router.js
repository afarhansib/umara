window.addEventListener('hashchange', () => {
  const url = location.hash.substr(1).split('/')
  const page = url[0]
  const params = url[1]
  loadPage(page, params)
  hideSidenav()
  hideBlocker()
}, true)

const loadPage = async (page, params = '') => {
	console.log('load page' + page)
  // showLoader()

  const cacheNames = await caches.keys()
  for (const name of cacheNames) {
    const cache = await caches.open(name)
    for (const request of await cache.keys()) {
      let realUrl = request.url.split("/")
      let unused = realUrl.splice(0, 3)
      realUrl = realUrl.join("/")
      if (realUrl === `assets/pages/${page}.html`) {
        console.log("dimuat dari cache")
        cache.match(request)
          .then(res => res.text())
          .then(text => {
            document.querySelector("main").innerHTML = text
      			loadContent(page, params)
          })
          .catch(err => console.error(err));
        return 'dimuat dari cache'
      }
    }
  }

  console.log('dimuat dari server')
  fetch(`assets/pages/${page}.html`)
    .then(status)
    .then(res => res.text())
    .then(text => {
      document.querySelector("main").innerHTML = text
      loadContent(page, params)
    })
    .catch(err => {
      document.querySelector("main").innerHTML = err
      console.error(err)
    })
  return 'dimuat dari server'
}

const showLoader = () => {
  const loader = `<div class="lds-grid">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>`
  document.querySelector("main").innerHTML = loader
}