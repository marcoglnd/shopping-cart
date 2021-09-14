const cartItemOl = '.cart__items';

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ id: sku, title: name, price, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('span', 'item__price', `R$ ${price.toFixed(2)}`));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho'));

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function getTotal() {
  const listOfItems = document.querySelectorAll('.cart_item_text');
  let total = 0;
  listOfItems.forEach((item) => {
    total += parseFloat(item.innerText.split('$')[1]);
  });
  const totalPrice = document.querySelector('.total-price');
  totalPrice.innerText = `Preço total: R$ ${total.toFixed(2)}`;
}

function cartItemClickListener(event) {
  const selectedItem = event.target.parentElement;
  const parentItem = event.target.parentElement.parentElement;
  parentItem.removeChild(selectedItem);
  const cartItems = document.querySelector(cartItemOl);
  getTotal();
  localStorage.setItem('cartItems', cartItems.innerHTML);
}

function createCartItemElement({ title: name, price: salePrice, thumbnail }) {
  const div = document.createElement('div');
  div.className = 'cart__item';
  const itemText = document.createElement('p');
  itemText.className = 'cart_item_text';
  itemText.innerText = `${name} | Preço: R$ ${salePrice}`;
  div.appendChild(createProductImageElement(thumbnail));
  div.appendChild(itemText);
  div.addEventListener('click', cartItemClickListener);
  return div;
}

function addItemToCart() {
  const items = document.querySelector('.items');
  items.addEventListener('click', (event) => {
    if (event.target.className === 'item__add') {
      const itemID = event.target.parentElement.firstChild.innerText;
      return new Promise((resolve, reject) => {
        fetch(`https://api.mercadolibre.com/items/${itemID}`)
        .then((response) => response.json())
        .then((data) => {
          const cartItem = createCartItemElement(data);
          const cartItems = document.querySelector(cartItemOl);
          cartItems.appendChild(cartItem);
          getTotal();
          localStorage.setItem('cartItems', cartItems.innerHTML);
        });
      });
    }
  });
}

function emptyCart() {
  const emptyButton = document.querySelector('.empty-cart');
  emptyButton.addEventListener('click', () => {
    const cartItems = document.querySelector(cartItemOl);
    cartItems.innerHTML = '';
    getTotal();
    localStorage.setItem('cartItems', cartItems.innerHTML);
  });
}

function fetchAPI() {
  return new Promise((resolve, reject) => {
    fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((data) => data.results.forEach((result) => {
      const productItem = createProductItemElement(result);
      const items = document.querySelector('.items');
      items.appendChild(productItem);
    })).then(() => {
      const container = document.querySelector('.container');
      const loading = document.querySelector('.loading');
      container.removeChild(loading);
    });
    addItemToCart();
    emptyCart();
  });
}

window.onload = function onload() {
  fetchAPI();
  if (localStorage.cartItems) {
    document.querySelector('.cart__items').innerHTML = localStorage.getItem('cartItems');
    const listItems = document.querySelectorAll('.cart__item');
    listItems.forEach((item) => {
      item.addEventListener('click', cartItemClickListener);
    });
    getTotal();
  }
};
