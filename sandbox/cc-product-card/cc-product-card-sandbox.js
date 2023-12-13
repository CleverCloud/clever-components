import { css, html, LitElement } from 'lit';
import '../../src/components/cc-ansi-palette/cc-ansi-palette.js';
import '../../src/components/cc-block/cc-block.js';
import '../../src/components/cc-input-number/cc-input-number.js';
import '../../src/components/cc-input-text/cc-input-text.js';
import '../../src/components/cc-product-card/cc-product-card.js';
import '../../src/components/cc-toggle/cc-toggle.js';
import '../../src/components/cc-select/cc-select.js';
import { generateRandomKeywords } from '../../src/components/cc-product-card/generate-random-keywords.js';

const DEFAULT_PRODUCT = {
  iconUrl: 'https://placekitten.com/202/202',
  name: 'My product',
  description: 'My description',
  keywords: generateRandomKeywords(3),
};

const API_PRODUCTS = await Promise.all([
  fetch('https://api.clever-cloud.com/v2/products/instances').then((r) => r.json()),
  fetch('https://api.clever-cloud.com/v2/products/addonproviders').then((r) => r.json()),
]).then(([instances, addons]) => [...instances, ...addons]);

const API_PRODUCTS_SELECT = [
  {
    label: 'default',
    value: 'default',
  },
  ...API_PRODUCTS.map((p) => ({ label: p.name, value: p.name })),
];

export class CcProductCardSandbox extends LitElement {

  static get properties () {
    return {
      _currentProduct: { type: Object },
      _componentWidth: { type: Number },
    };
  }

  constructor () {
    super();

    this._currentProduct = DEFAULT_PRODUCT;

    this._componentWidth = 20;

  }

  _onSelect ({ detail: productName }) {
    if (productName === 'default') {
      this._currentProduct = DEFAULT_PRODUCT;
      return;
    }

    const product = API_PRODUCTS.find((p) => p.name === productName);
    this._currentProduct = {
      name: product.name,
      description: `this is ${product.name} product that comes directly from the API with \`${product?.variant?.slug ?? product.id}\` as an identifier`,
      iconUrl: product?.variant?.logo ?? product.logoUrl,
    };
  }

  _onProductInput ({ detail: product }) {
    const parsedProduct = JSON.parse(product);
    if (parsedProduct != null) {
      this._currentProduct = parsedProduct;
    }
  }

  _onWidthInput ({ detail: width }) {
    this._componentWidth = width;
  }

  render () {

    const product = this._currentProduct;

    return html`
      <cc-select
        label="API products"
        value="default"
        .options="${API_PRODUCTS_SELECT}"
        @cc-select:input="${this._onSelect}"
      ></cc-select>
      <cc-input-number value=${this._componentWidth} label="component width (em)" @cc-input-number:input="${this._onWidthInput}"></cc-input-number>
      <cc-block state="open">
        <div slot="title">Change product details</div>
        <cc-input-text value=${JSON.stringify(this._currentProduct, null, '\t')} @cc-input-text:input="${this._onProductInput}" multi></cc-input-text>
      </cc-block>
      <cc-product-card 
        style="width:${this._componentWidth}em;"
        name="${product.name}"
        description="${product.description}"
        icon-url="${product.iconUrl}" 
        .keywords="${product?.keywords ?? []}"
      ></cc-product-card>
    `;
  }

  static get styles () {
    return [
      css`
        :host {
          display: flex;
          gap: 1em;
          flex-direction: column;
        }
      `,
    ];
  }
}

window.customElements.define('cc-product-card-sandbox', CcProductCardSandbox);
