import products from './products.json';

/**
 * menu mouse toggle
 */
const menu = document.body.querySelector('menu');
menu.addEventListener('click', () => {
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
  ctContainer.product = products[productsIds[currentProductIndex]];
}

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
