const DB_NAME = 'umara-snack'
const DB_VERSION = 1
const DB_STORE_NAME = 'cart'

var db = function() {
  // console.log("openDb ...")
  var req = indexedDB.open(DB_NAME, DB_VERSION)
  req.onsuccess = function(evt) {
    db = this.result
    // console.log("openDb DONE")
  }
  req.onerror = function(evt) {
    console.error("openDb:", evt.target.errorCode)
  }

  req.onupgradeneeded = function(evt) {
    console.log("openDb.onupgradeneeded")
    let cartStore = evt.currentTarget.result.createObjectStore(DB_STORE_NAME, { keyPath: 'prod_in_cart_id', autoIncrement: true })
    let oldCartStore = evt.currentTarget.result.createObjectStore('oldCart', { keyPath: 'cart_id', autoIncrement: true })

    cartStore.createIndex('prod_id', 'prod_id', { unique: true });
  }
}()

const getObjectStore = (store_name, mode) => {
  let tx = db.transaction(store_name, mode);
  return tx.objectStore(store_name);
}

const getObjectStoreByIndex = (store_name, mode, index) => {
  let tx = db.transaction(store_name, mode)
  let objectStore = tx.objectStore(store_name)
  return objectStore.index(index)
}

const addToCart = async product => {
  const storeData = () => {
    let store = getObjectStore(DB_STORE_NAME, 'readwrite')
    let req = store.add(product)
    req.onsuccess = evt => {
      console.log('produk disimpan')
    }
    req.onerror = evt => {
      console.error("addToCart:", evt)
    }
  }

  const updateData = (data) => {
    let store = getObjectStore(DB_STORE_NAME, 'readwrite')
    let req = store.put(data)
    req.onsuccess = evt => {
      console.log('produk diupdate')
    }
    req.onerror = evt => {
      console.error("addToCart:", evt)
    }
  }

  // let prod_in_cart_id = 1
  await getAll()
    .then(async res => {
      if (res.length === 0) {
        await getLatestIdInCart()
          .then(res => {
            // console.log(res.prod[res.prod.length - 1].prod_in_cart_id)
            if (res === null) {
              product['prod_in_cart_id'] = 1
            }
          })
          .catch(err => console.error(err))
        storeData()
      } else {
        getById(product.prod_id)
          .then(res => {
            if (res === undefined) {
              console.log('produk tidak ada, menambah baru')
              console.log(product['prod_in_cart_id'])
              storeData()
            } else {
              product['prod_in_cart_id'] = res.prod_in_cart_id
              updateData(product)
            }
          })
        console.log('NOT empty')
        // delete product['prod_in_cart_id']
      }
    })
    .catch(err => console.error(err))


}

const getAll = () => {
  return new Promise((res, rej) => {
    let store = getObjectStore(DB_STORE_NAME, 'readonly')
    let req = store.getAll()
    req.onsuccess = evt => {
      let data = req.result
      res(data)
    }
    req.onerror = evt => {
      rej(evt)
    }
  })
}

const getLatestIdInCart = () => {
  return new Promise((res, rej) => {
    let store = getObjectStore('oldCart', 'readonly')
    var openCursorRequest = store.openCursor(null, 'prev')

    openCursorRequest.onsuccess = evt => {
      res(event.target.result.value)
    }

    openCursorRequest.onerror = evt => {
      rej(evt)
    }
  })
}

function getAllItems() {
  var trans = db.transaction(DB_STORE_NAME, IDBTransaction.READ_ONLY)
  var store = trans.objectStore(DB_STORE_NAME)
  var items = []

  trans.oncomplete = function(evt) {
    callback(items)
    return items
  };

  var cursorRequest = store.openCursor()

  cursorRequest.onerror = function(error) {
    console.log(error)
  };

  cursorRequest.onsuccess = function(evt) {
    var cursor = evt.target.result
    if (cursor) {
      items.push(cursor.value)
      cursor.continue()
    }
  }
}

const sample = {
  prod_id: 2,
  timestamp: new Date(),
  qty: 2,
  prod_url: 'keripik-tempe',
  prod_name: 'Keripik Tempe',
  prod_image: 'keripik-tempe.jpg',
  prod_price: 14000
}

const cartSample = {
  cart_id: 1,
  timestamp: new Date(),
  prod: []
}

const getById = id => {
  return new Promise((res, rej) => {
    let store = getObjectStoreByIndex(DB_STORE_NAME, 'readwrite', 'prod_id')
    let req = store.get(id)
    req.onsuccess = evt => {
      let data = req.result
      res(data)
    }
    req.onerror = evt => {
      rej(evt)
    }
  })
}

const moveCartToOld = () => {
  const cart = {
    timestamp: new Date(),
    prod: []
  }
  // get all item
  getAll()
    .then(res => {
      console.log(res)
      if (res.length !== 0) {
        cart.prod = res
        let store = getObjectStore('oldCart', 'readwrite')
        let req = store.add(cart)
        req.onsuccess = evt => {
          let store = getObjectStore(DB_STORE_NAME, 'readwrite')
          let req = store.clear()
          req.onsuccess = evt => {
            console.log('cart disimpan')
          }
          req.onerror = evt => {
            console.error("addToCart:", evt)
          }
        }
        req.onerror = evt => {
          console.error("addToCart:", evt)
        }
      } else {
        console.log('cart item kosong')
      }
    })
    .catch(err => {
      console.error(err)
    })
  // store to oldcart
  // clear all item

}