import { css, html, LitElement } from 'lit';
import { i18n } from '../../lib/i18n.js';
import { linkStyles } from '../../templates/cc-link/cc-link.js';
import '../cc-product-card/cc-product-card.js';
import '../cc-badge/cc-badge.js';
import '../cc-icon/cc-icon.js';
import '../cc-input-text/cc-input-text.js';
import { ProductsController } from './products-controller.js';

/**
 * @typedef {import('./cc-product-list.types.js').CategoryData} CategoryData
 * @typedef {import('lit').PropertyValues<CcProductList>} CcProductListPropertyValues
 */

/**
 * A component that displays a list of products in sections and allows to search and filter through it.
 *
 * @cssdisplay block
 */
export class CcProductList extends LitElement {

  static get properties () {
    return {
      categoryDataList: { type: Array },
      filterCategory: { type: String },
      filterInput: { type: String },
    };
  }

  constructor () {
    super();

    /** @type {CategoryData[]} the list of products in their respective categories.  */
    this.categoryDataList = [];

    /** @type {string} a string to presearch through the list */
    this.filterInput = '';

    /** @type {'all'|string} a string to prefilter by a given category */
    this.filterCategory = 'all';

    /** @type {ProductsController} */
    this._productsCrtl = new ProductsController(this);
  }

  /**
   * @param {string} categoryName
   */
  _onBadgeClick (categoryName) {
    this._productsCrtl.filterCategory(categoryName);
  }

  /**
   * @param {Object} event
   * @param {string} event.detail
  */
  _onSearchInput ({ detail: value }) {
    this._productsCrtl.search(value);
  }

  /**
   * @param {CcProductListPropertyValues} changedProperties
  */
  willUpdate (changedProperties) {

    if (changedProperties.has('categoryDataList')) {
      this._productsCrtl.categoryDataList = this.categoryDataList;
    }

    if (changedProperties.has('filterInput') || changedProperties.has('filterCategory')) {
      this._productsCrtl.filterCategory(this.filterCategory);
      this._productsCrtl.search(this.filterInput);
    }

  }

  render () {
    return html`
      <div class="search-form">
        <cc-input-text
          label="${i18n('cc-product-list.search-label')}"
          value="${this.filterInput ?? ''}"
          @cc-input-text:input="${this._onSearchInput}"></cc-input-text>
        <div class="category-filter">
          ${this._renderCategoryFilter()}
        </div>
      </div>
      <div class="products">
        ${this._renderProductsList()}
      </div>
    `;
  }

  _renderCategoryFilter () {

    const categories = this._productsCrtl.getCategories();

    return categories.map((c) => html`
      <cc-badge
        weight="${(c.toggled ? 'dimmed' : 'outlined')}"
        intent="info"
        @click=${() => this._onBadgeClick(c.categoryName)}>
        ${c.categoryName}
      </cc-badge>
    `);
  }

  _renderProductsList () {

    const categoryDataList = this._productsCrtl.getCategoryDataList();

    return categoryDataList.map((categoryData) => html`
      <div class="category">
        <div class="category-title">
          ${categoryData?.icon != null ? html`
            <cc-icon .icon="${categoryData.icon}" class="category-icon"></cc-icon>
          ` : ''}
          <div class="category-name">${categoryData.categoryName}</div>
        </div>
        <div class="category-products">
          ${categoryData.products.map((p) => html`
            <cc-product-card
              name="${p.name}"
              description="${p.description}"
              .keywords="${p.keywords ?? []}"
              icon-url="${p.iconUrl}"
              url="${p?.url}"
            ></cc-product-card>
          `)}
        </div>
      </div>
    `);
  }

  static get styles () {
    return [
      linkStyles,
      // language=CSS
      css`
        :host {
          display: block;
        }

        cc-badge:hover {
          cursor: pointer;
        }

        .category-name {
          font-size: 1.75em;
          font-weight: bold;
        }

        .category-products {
          display: grid;
          gap: 1em;
          grid-template-columns: repeat(auto-fill, minmax(20em, 1fr));
        }

        .category-title {
          display: flex;
          align-items: center;
          margin: 2em 0 1em;
          gap: 0.5em;
        }

        .category-filter {
          display: flex;
          flex-wrap: wrap;
          gap: 0.25em;
        }

        .category-icon {
          width: 1.75em;
          height: 1.75em;
        }

        .search-form {
          display: flex;
          flex-direction: column;
          gap: 0.5em;
        }
      `,
    ];
  }
}

window.customElements.define('cc-product-list', CcProductList);
