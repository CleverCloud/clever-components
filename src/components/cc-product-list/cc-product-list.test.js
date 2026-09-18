import { expect } from '@open-wc/testing';
import { elementUpdated, fixture } from '@open-wc/testing-helpers';
import { html } from 'lit';
import './cc-product-list.js';

const PRODUCTS_BY_CATEGORIES = [
  {
    categoryName: 'Databases',
    products: [generateProduct('PostgreSQL')],
  },
  {
    categoryName: 'Tools',
    products: [generateProduct('Configuration Provider')],
  },
];

function generateProduct(name) {
  return {
    name,
    description: '',
    iconUrl: 'https://example.com/icon.png',
    url: 'https://example.com',
  };
}

function getDisplayedCategories(element) {
  return Array.from(element.shadowRoot.querySelectorAll('.category-name')).map((category) =>
    category.textContent.trim(),
  );
}

function getCheckedCategories(element) {
  return Array.from(element.shadowRoot.querySelectorAll('input[type="radio"]'))
    .filter((radio) => radio.checked)
    .map((radio) => radio.value);
}

describe('cc-product-list', () => {
  describe('categoryFilter property', () => {
    it('applies the category filter when the products are set after it', async () => {
      const element = await fixture(html`<cc-product-list category-filter="Tools"></cc-product-list>`);

      element.productsByCategories = PRODUCTS_BY_CATEGORIES;
      await elementUpdated(element);

      expect(getDisplayedCategories(element)).to.deep.equal(['Tools']);
    });
  });

  describe('category radios', () => {
    it('checks the radio of the category filter', async () => {
      const element = await fixture(
        html`<cc-product-list
          .productsByCategories=${PRODUCTS_BY_CATEGORIES}
          category-filter="Tools"
        ></cc-product-list>`,
      );

      expect(getCheckedCategories(element)).to.deep.equal(['Tools']);
    });
  });
});
