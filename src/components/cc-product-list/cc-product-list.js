import { css, html, LitElement } from 'lit';
import { i18n } from '../../lib/i18n.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
import { linkStyles } from '../../templates/cc-link/cc-link.js';
import '../cc-product-card/cc-product-card.js';
import '../cc-badge/cc-badge.js';
import '../cc-icon/cc-icon.js';
import '../cc-input-text/cc-input-text.js';
import { ProductsController } from './products-controller.js';

/**
 * @typedef {import('./cc-product-list.types.js').CategoryData} CategoryData
 * @typedef {import('lit').PropertyValues<CcProductList>} CcProductListPropertyValues
 * @typedef {import('lit').TemplateResult<1>} TemplateResult
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
      filterCategory: { type: String, attribute: 'filter-category' },
      filterInput: { type: String, attribute: 'filter-input' },
    };
  }

  constructor () {
    super();

    /** @type {CategoryData[]} the list of products in their respective categories.  */
    this.categoryDataList = [];

    /** @type {string} a string to presearch through the list */
    this.filterInput = '';

    /** @type {string|null} a string to prefilter by a given category */
    this.filterCategory = null;

    /** @type {ProductsController} */
    this._productsCrtl = new ProductsController(this);
  }

  /**
   * @param {Event & { target: HTMLInputElement }} e
   */
  _onCategoryChange (e) {
    this.filterCategory = e.target.value;
  }

  /**
   * @param {Object} event
   * @param {string} event.detail
  */
  _onSearchInput ({ detail: value }) {
    this.filterInput = value;
  }

  /**
   * @param {CcProductListPropertyValues} changedProperties
  */
  willUpdate (changedProperties) {

    if (changedProperties.has('categoryDataList')) {
      this._productsCrtl.categoryDataList = this.categoryDataList;
    }

    if (changedProperties.has('filterInput') && changedProperties.has('filterCategory')) {
      this._productsCrtl.toggleCategory(this.filterCategory);
      this._productsCrtl.search(this.filterInput);
    }
    else if (changedProperties.has('filterCategory')) {
      this._productsCrtl.toggleCategory(this.filterCategory);
    }
    else if (changedProperties.has('filterInput')) {
      this._productsCrtl.search(this.filterInput);
    }
  }

  render () {

    const categories = this._productsCrtl.getCategories();

    return html`
      <div class="search-form">
        <cc-input-text
          label="${i18n('cc-product-list.search-label')}"
          value="${this.filterInput ?? ''}"
          @cc-input-text:input="${this._onSearchInput}"></cc-input-text>
        <fieldset class="category-filter">
          ${this._renderCategory(i18n('cc-product-list.all-label'), 'all', this._productsCrtl.getCurrentCategory() === 'all')}
          ${categories.map((c) => this._renderCategory(c.categoryName, c.categoryName, c.toggled))}
        </fieldset>
      </div>
      <div class="products">
        ${this._renderProductsList()}
      </div>
    `;
  }

  /**
   * @param {string} label
   * @param {string} value
   * @param {boolean} isToggled
   * @returns {TemplateResult}
   */
  _renderCategory (label, value, isToggled) {
    const id = label.replace(' ', '-');
    return html`
      <input 
        type="radio"
        id="${id}"
        .value=${value}
        name="category-filter"
        class="visually-hidden" 
        @change=${this._onCategoryChange}>
      <label for="${id}">
        <cc-badge
          weight="${(isToggled ? 'dimmed' : 'outlined')}"
          intent="info"
        >${label}
        </cc-badge>
      </label>`;
  }

  _renderProductsList () {

    const categoryDataList = this._productsCrtl.getCategoryDataList();

    if (categoryDataList.length === 0) {
      return html`
      <p class="search-empty">${i18n('cc-product-list.search-empty')}</p>
    `;
    }

    return categoryDataList.map((categoryData) => html`
      <div class="category">
        <div class="category-title">
          ${categoryData.icon != null ? html`
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
              url="${p.url}"
            ></cc-product-card>
          `)}
        </div>
      </div>
    `);
  }

  static get styles () {
    return [
      accessibilityStyles,
      linkStyles,
      // language=CSS
      css`
        :host {
          display: block;
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
          margin: 2.5em 0 1.5em;
          gap: 0.5em;
        }

        .category-filter {
          display: flex;
          flex-wrap: wrap;
          padding: 0;
          border: none;
          gap: 0.25em;
        }

        label:hover {
          cursor: pointer;

          --cc-color-bg-primary: var(--cc-color-text-primary-strong);
        }

        input[type='radio']:focus-visible + label {
          /* TODO: change this if we add a custom prop to the cc-badge */
          border-radius: 1em;
          outline: var(--cc-focus-outline, #000 solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        .category-icon {
          width: 1.75em;
          height: 1.75em;
        }

        .search-empty {
          margin: 1.5em 0 0;
          font-style: italic;
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
