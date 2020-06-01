window.addEventListener('hashchange', () => {
  const url = location.hash.substr(1).split('/')
  let page = url[0]
  if (page === "") page = "home"
  const params = url[1]
  loadPage(page, params)
  hideSidenav()
  hideBlocker()
}, true)

const loadPage = async (page, params = '') => {
  // console.log('load page' + page)
  // showLoader()
  const loadOk = text => {
    document.querySelector("main").innerHTML = text
    loadContent(page, params)
    initBackButton()
  }

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
            loadOk(text)
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
      loadOk(text)
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

const initBackButton = () => {
  if (document.querySelector('.back-btn')) {
    document.querySelector('.back-btn').addEventListener('click', () => {
      history.back()
    }, true)
  }
}

const initShareButton = data => {
  document.querySelector('.share-btn .btn').addEventListener('click', async e => {
    if (navigator.share) {
      navigator.share({
          title: data.name,
          url: data.url
        }).then(() => {
          console.log('Thanks for sharing!')
        })
        .catch(console.error)
    } else {
      console.log('Not Supported!')
      try {
        await navigator.clipboard.writeText(data.url)
        toast('Link produk ini berhasil disalin.')
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    }
  })
}