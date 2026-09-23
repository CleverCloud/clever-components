import { expect } from '@open-wc/testing';
import { elementUpdated, fixture } from '@open-wc/testing-helpers';
import { html } from 'lit';
import { createEventSpy } from '../../../test/helpers/event-helper.js';
import { CcInputEvent } from '../common.events.js';
import { CcProductListFilterChangeEvent } from './cc-product-list.events.js';
import './cc-product-list.js';

const PRODUCTS_BY_CATEGORIES = [
  {
    id: 'databases',
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

async function clickCategory(element, value) {
  const radios = Array.from(element.shadowRoot.querySelectorAll('input[type="radio"]:not([data-all-categories])'));
  radios.find((radio) => radio.value === value).click();
  await elementUpdated(element);
}

async function clickAllCategories(element) {
  element.shadowRoot.querySelector('input[type="radio"][data-all-categories]').click();
  await elementUpdated(element);
}

async function typeInSearch(element, value) {
  element.shadowRoot.querySelector('cc-input-text').dispatchEvent(new CcInputEvent(value));
  await elementUpdated(element);
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

    it('applies a category keyed all like any other', async () => {
      const element = await fixture(
        html`<cc-product-list
          .productsByCategories=${[
            { id: 'all', categoryName: 'Everything', products: [generateProduct('PostgreSQL')] },
            { categoryName: 'Tools', products: [generateProduct('Configuration Provider')] },
          ]}
        ></cc-product-list>`,
      );

      await clickCategory(element, 'all');

      expect(getDisplayedCategories(element)).to.deep.equal(['Everything']);
      expect(getCheckedCategories(element)).to.deep.equal(['all']);
    });
  });

  describe('cc-product-list-filter-change event', () => {
    it('reports the key of the clicked category, and null for all categories', async () => {
      const element = await fixture(
        html`<cc-product-list .productsByCategories=${PRODUCTS_BY_CATEGORIES}></cc-product-list>`,
      );
      const filterChangeSpy = createEventSpy(element, CcProductListFilterChangeEvent.TYPE);

      await clickCategory(element, 'databases');
      expect(filterChangeSpy.lastCall.args[0].detail).to.deep.equal({ categoryFilter: 'databases', textFilter: '' });

      await clickCategory(element, 'Tools');
      expect(filterChangeSpy.lastCall.args[0].detail).to.deep.equal({ categoryFilter: 'Tools', textFilter: '' });

      await clickAllCategories(element);
      expect(filterChangeSpy.lastCall.args[0].detail).to.deep.equal({ categoryFilter: null, textFilter: '' });
    });

    it('reports null when the category filter matches no category', async () => {
      const element = await fixture(
        html`<cc-product-list
          .productsByCategories=${PRODUCTS_BY_CATEGORIES}
          category-filter="Databases"
        ></cc-product-list>`,
      );
      const filterChangeSpy = createEventSpy(element, CcProductListFilterChangeEvent.TYPE);

      await typeInSearch(element, 'postgre');

      expect(filterChangeSpy.lastCall.args[0].detail).to.deep.equal({ categoryFilter: null, textFilter: 'postgre' });
    });
  });
});
