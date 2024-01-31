import { products } from './api/api-helpers.js';

/**
 * shortcuts
 */
const menu = document.body.querySelector('menu');
const menuServices = menu.querySelector('.menu-services');

/**
 * menu mouse toggle
 */
menu.querySelector('.menu-orgas').addEventListener('click', () => {
  if (menu.hasAttribute('open')) {
    menu.removeAttribute('open');
  }
  else {
    menu.setAttribute('open', '');
  }
});

/**
 * products keyboard navigation
 */
const productsIds = Object.keys(products);
const ctContainer = document.body.querySelector('ct-container');

let currentProductIndex;

function goToProductIndex (index) {
  currentProductIndex = (index + productsIds.length) % productsIds.length;
  goToProduct(productsIds[currentProductIndex]);
}
function goToProduct (productId) {
  if (!productsIds.includes(productId)) {
    productId = productsIds[0];
  }

  const productElements = menuServices.querySelectorAll(`.menu-services--item`);
  productElements.forEach((productElement) => {
    const isCurrentElement = productElement.getAttribute('data-product-id') === productId;
    if (isCurrentElement) {
      productElement.setAttribute('selected', '');
    }
    else {
      productElement.removeAttribute('selected');
    }
  });
  ctContainer.product = products[productId];
}

function addProductsToMenu () {
  menuServices.innerHTML = productsIds.map((productId) => {
    const product = products[productId];
    const { name, logoUrl } = product;
    return `
      <div class="menu-services--item" data-product-id="${productId}">
        <div class="menu-services--icon"><img src="${logoUrl}" alt=""></div>
        <div class="menu-services--name">${name}</div>
      </div>
    `;
  }).join(``);

  productsIds.forEach((productId) => {
    const productElement = menuServices.querySelector(`[data-product-id="${productId}"]`);
    productElement.addEventListener('click', (e) => {
      const currentTarget = e.currentTarget;
      const productId = currentTarget.getAttribute('data-product-id');
      goToProduct(productId);
    });
  });
}
addProductsToMenu();

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowRight':
      goToProductIndex(currentProductIndex + 1);
      break;
    case 'ArrowLeft':
      goToProductIndex(currentProductIndex - 1);
      break;
  }
});

goToProductIndex(0);
