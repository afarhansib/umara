const url = '/data.json' 

const status = response => {
  if (response.status !== 200) {
    console.log('Error : ' + response.status)
    return Promise.reject(new Error(response.statusText))
  } else {
    return Promise.resolve(response)
  }
}

const json = response => response.json()

const loadContent = (page, params) => {
	switch(page) {
		case 'home':
			loadProduct()
			break
		case 'kategori':
			loadCategory(params)
			break
		case 'produk':
			loadProduct(params)
			break
		default:
			console.log('idk man.')
	}
}

const loadProduct = (params = '') => {
	fetch(url)
		.then(status)
		.then(json)
		.then(data => {
			if(params === '')	return loadAllProducts(data)
			return loadProductByUrl(params)
		})
}

const loadAllProducts = data => {
	const wrapper = document.querySelector('.container')
	let content = ``
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
}

const initAddButton = () => {
	Array.from(document.querySelectorAll('.item-add a.btn')).forEach(e => {
		e.addEventListener('click', () => {
			Array.from(document.querySelectorAll('.cart-count')).forEach(e => {
				e.innerText = Number(e.innerText) + 1
			})
		})
	})
}