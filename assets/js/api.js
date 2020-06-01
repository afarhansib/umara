const url = 'https://afarhansib.github.io/umara/data.json'

const status = response => {
  if (response.status !== 200) {
    console.log('Error : ' + response.status)
    return Promise.reject(new Error(response.statusText))
  } else {
    return Promise.resolve(response)
  }
}

const json = response => response.json()

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

const loadContent = (page, params) => {
  switch (page) {
    case 'home':
      loadProduct(page)
      break
    case 'kategori':
      loadCategory(params)
      break
    case 'produk':
      loadProduct(page, params)
      break
    case 'alamat':
      loadAddress()
      break
    case 'keranjang':
      loadCartItems()
      break
    default:
      console.log('idk man.')
  }
}

const loadProduct = (page, params = '') => {
  fetch(url)
    .then(status)
    .then(json)
    .then(data => {
      if (params === '') return loadAllProducts(page, data)
      return loadProductByUrl(data, params)
    })
}

const loadCategory = (params = '') => {
  fetch(url)
    .then(status)
    .then(json)
    .then(data => {
      if (params === '') return loadAllCategory(data)
      return loadCatByUrl(data, params)
    })
}

const loadAllProducts = (page, data) => {
  const wrapper = document.querySelector('.container')
  let content = ''
  if (page === 'produk') {
    content += `<div class="top-bar-page">
      <button class="btn back-btn"><i class="material-icons">chevron_left</i></button>
      <div class="page-title">
        <h1>Produk</h1>
      </div>
    </div>`
  }
  data.forEach(cat => {
    content += `<div class="cat-wrapper">
  <a href="#kategori/${cat.cat_url}" class="cat-head">
    <div class="cat-title">${cat.cat_name}</div>
    <span class="cat-more">
      <i class="material-icons">arrow_forward</i>
    </span>
  </a>
  <div class="cat-item-list">`
    let products = ''
    // content += () => {
    cat['cat_items'].forEach(product => {
      products += `<div class="item-wrapper">
          <div class="item-add">
            <a class="btn"><i class="material-icons">add_shopping_cart</i></a>
          </div>
          <a href="#produk/${product.prod_url}" class="item">
            <div class="item-thumbnail">
              <img src="assets/img/${product.prod_image}" alt="${product.prod_name}">
            </div>
            <div class="item-name">${product.prod_name}</div>
            <div class="item-price">${toRupiahs(product.prod_price)}</div>
          </a>
        </div>`
    })
    // return products
    // }
    content += products
    content += `</div>
</div>`
  })
  wrapper.innerHTML = content
  initAddButton()
  initBackButton()
}

const loadProductByUrl = (data, url) => {
  const wrapper = document.querySelector('.container')
  let product = ''
  data.forEach(e => {
    e['cat_items'].forEach(items => {
      if (items.prod_url === url) {
        product = items
      }
    })
  })
  let content = `<div class="product-image">
       <div class="top-bar">
           <button class="btn back-btn"><i class="material-icons">chevron_left</i></button>
           <div class="stock-availability">
    <span>Stok</span> <i class="material-icons">done</i></div>
    </div>
    <img src="assets/img/${product.prod_image}" alt="${product.prod_name}">
</div>
<h2 class="product-name">${product.prod_name}</h2>
    <h3 class="product-price">${toRupiahs(product.prod_price)}</h3>
    <p class="product-desc">${product.prod_desc}</p>
    <div class="bottom-bar">
    <div class="buy-btn">
        <button class="btn">Beli</button>
    </div>
    
    <div class="fav-btn">
        <button class="btn"><i class="material-icons">favorite_border</i></button>
    </div>
    
    <div class="share-btn">
        <button class="btn"><i class="material-icons">share</i></button>
    </div>
    
    <div class="add-to-cart-btn">
        <button class="btn"><i class="material-icons">add_shopping_cart</i></button>
    </div>
</div>`
  // console.log(url)
  wrapper.innerHTML = content
  initAddButton()
  initBackButton()
  initShareButton({
    name: product.prod_name,
    url: location.href
  })
}

const initAddButton = () => {
  Array.from(document.querySelectorAll('.item-add a.btn, .add-to-cart-btn button.btn')).forEach(e => {
    e.addEventListener('click', () => {
      Array.from(document.querySelectorAll('.cart-count')).forEach(e => {
        e.innerText = Number(e.innerText) + 1
      })
    })
  })
}

const loadAllCategory = data => {
  const wrapper = document.querySelector('.container')
  let content = `
  <div class="top-bar-page">
    <button class="btn back-btn"><i class="material-icons">chevron_left</i></button>
    <div class="page-title">
      <h1>Kategori</h1>
    </div>
  </div>
    <ul class="cat-links">`
  data.forEach(cat => {
    content += `
    <li class="cat-link">
    <a class="ripple" href="#kategori/${cat.cat_url}">
    <h3>${cat.cat_name}</h3>
<i class="material-icons">chevron_right</i></a>
</li>
    `
  })

  content += `
</ul>`

  wrapper.innerHTML = content
  initBackButton()
}

const loadCatByUrl = (data, url) => {
  let catData = {}
  data.forEach(e => {
    if (e.cat_url === url) catData = e
  })
  const wrapper = document.querySelector('.container')
  let content = `<div class="top-bar-page">
    <button class="btn back-btn"><i class="material-icons">chevron_left</i></button>
    <div class="page-title">
      <h1>${catData.cat_name}</h1>
    </div>
  </div>
  <div class="cat-all-item-list">`

  catData['cat_items'].forEach(product => {
    content += `<div class="item-wrapper">
        <div class="item-add">
          <a class="btn"><i class="material-icons">add_shopping_cart</i></a>
        </div>
        <a href="#produk/${product.prod_url}" class="item">
          <div class="item-thumbnail">
            <img src="assets/img/${product.prod_image}" alt="${product.prod_name}">
          </div>
          <div class="item-name">${product.prod_name}</div>
          <div class="item-price">${toRupiahs(product.prod_price)}</div>
        </a>
      </div>`
  })

  content += `</div>`
  wrapper.innerHTML = content
  initAddButton()
  initBackButton()
}

const loadAddress = () => {
  var script = document.createElement('script')
  script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAsXJsG60qMTz7ts-UiSca4Ppc1PnKSVtI&callback=initMap'
  script.defer = true
  script.async = true

  window.initMap = function() {
    var umaraSnack = { lat: -7.690784, lng: 112.231709 }
    var map = new google.maps.Map(document.getElementById('map'), { zoom: 12, center: umaraSnack })
    var marker = new google.maps.Marker({ position: umaraSnack, map: map })
  }

  document.querySelector('.container').appendChild(script)

  let openLink = document.createElement('link')
  openLink.type = 'text/css'
  openLink.rel = "stylesheet"
  openLink.href = "https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@master/en/v6.3.1/css/ol.css"
  var openScript = document.createElement('script')
  openScript.src = "https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@master/en/v6.3.1/build/ol.js"
  document.querySelector('.container').appendChild(openScript)
  document.querySelector('.container').appendChild(openLink)


  setTimeout(() => {
    var map = new ol.Map({
      target: 'openMap',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([112.231709, -7.690784]),
        zoom: 12
      })
    })

    var layer = new ol.layer.Vector({
      source: new ol.source.Vector({
        features: [
          new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.fromLonLat([112.231709, -7.690784]))
          })
        ]
      })
    })
    map.addLayer(layer)

    document.querySelector('.container').insertAdjacentHTML('beforeend', `
    <div id="popup" class="ol-popup">
      <div id="popup-content"></div>
    </div>
    <style>
      .ol-attribution.ol-logo-only,
        .ol-attribution.ol-uncollapsible {
            max-width: calc(100% - 3em) !important;
            height: 1.5em !important;
        }

        .ol-control button,
        .ol-attribution,
        .ol-scale-line-inner {
            font-family: 'Lucida Grande', Verdana, Geneva, Lucida, Arial, Helvetica, sans-serif !important;
        }

        .ol-popup {
            font-family: 'Lucida Grande', Verdana, Geneva, Lucida, Arial, Helvetica, sans-serif !important;
            font-size: 12px;
            position: absolute;
            background-color: white;
            -webkit-filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
            filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
            padding: 15px;
            border-radius: 10px;
            border: 1px solid #cccccc;
            bottom: 12px;
            left: -50px;
            min-width: 100px;
        }

        .ol-popup:after,
        .ol-popup:before {
            top: 100%;
            border: solid transparent;
            content: " ";
            height: 0;
            width: 0;
            position: absolute;
            pointer-events: none;
        }

        .ol-popup:after {
            border-top-color: white;
            border-width: 10px;
            left: 48px;
            margin-left: -10px;
        }

        .ol-popup:before {
            border-top-color: #cccccc;
            border-width: 11px;
            left: 48px;
            margin-left: -11px;
        }
    </style>
    `)

    var container = document.getElementById('popup')
    var content = document.getElementById('popup-content')
    content.innerHTML = '<b>Lokasi Toko</b>'
    var overlay = new ol.Overlay({
      element: container,
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    })
    overlay.setPosition(ol.proj.fromLonLat([112.231709, -7.690784]))
    map.addOverlay(overlay)


  }, 2000)
}

const loadCartItems = () => {
  const wrapper = document.querySelector('.wrapper')
  let content = `
  <div class="cart-item">
    <div class="img" style="background-image: url(assets/img/keripik-tempe.jpg);"></div>
    <div class="item-detail-wrapper">
        <div class="top-sec">
            <div class="prod-name-wrapper">
                <p>Keripik Tempe</p>    
            </div>
            <div class="del-btn-wrapper">
                <button class="btn-clear light"><i class="material-icons">close</i></button>
                </div>
        </div>
        <div class="bot-sec">
            <div class="qty-wrapper">
                <form class="qty">
                    <button class="btn minus-btn" type="button"><i class="material-icons">remove</i></button><input type="number" value="2"><button class="btn plus-btn" type="button"><i class="material-icons">add</i></button>
                </form>
            </div>
            <div class="price-wrapper">
                <p>Rp28.000</p>
            </div>
        </div>
    </div>
    </div>
    <div class="cart-item">
    <div class="img" style="background-image: url(assets/img/keripik-kelor.jpg);"></div>
    <div class="item-detail-wrapper">
        <div class="top-sec">
            <div class="prod-name-wrapper">
                <p>Keripik Kelor</p>    
            </div>
            <div class="del-btn-wrapper">
                <button class="btn-clear light"><i class="material-icons">close</i></button>
                </div>
        </div>
        <div class="bot-sec">
            <div class="qty-wrapper">
                <form class="qty">
                    <button class="btn minus-btn" type="button"><i class="material-icons">remove</i></button><input type="number" value="1"><button class="btn plus-btn" type="button"><i class="material-icons">add</i></button>
                </form>
            </div>
            <div class="price-wrapper">
                <p>Rp14.000</p>
            </div>
        </div>
    </div>
    </div>
  `
  wrapper.innerHTML = content
  // wrapper.innerHTML = `<p class="app">Keranjang anda kosong.</p>`
}