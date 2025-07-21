import { css, html, LitElement } from 'lit';
import { isStringEmpty } from '../../lib/utils.js';
import { i18n } from '../../translations/translation.js';
import '../cc-badge/cc-badge.js';
import '../cc-button/cc-button.js';
import '../cc-img/cc-img.js';

/**
 * A component displaying some information about a product in a card.
 *
 * @cssdisplay block
 *
 */
export class CcProductCard extends LitElement {
  static get properties() {
    return {
      description: { type: String },
      iconUrl: { type: String, attribute: 'icon-url' },
      name: { type: String },
      productStatus: { type: String, attribute: 'product-status' },
      url: { type: String },
    };
  }

  constructor() {
    super();

    /** @type {string|null} The description of the product */
    this.description = null;

    /** @type {string} The icon url of the product */
    this.iconUrl = null;

    /** @type {string} The name of the product */
    this.name = null;

    /** @type {string|null} The status availability of the product */
    this.productStatus = null;

    /** @type {string|null} The url where the user will be redirected when the product is selected  */
    this.url = null;
  }

  render() {
    // language=HTML
    return html`
      <div class="wrapper">
        ${this.iconUrl != null ? html` <cc-img src="${this.iconUrl}"></cc-img> ` : ''}
        <a class="name" href="${this.url}" title="${i18n('cc-product-card.select', { name: this.name })}">
          ${this.name}
        </a>
        ${!isStringEmpty(this.productStatus)
          ? html` <cc-badge class="product-status">${this.productStatus}</cc-badge> `
          : ''}
        <p class="description">${this.description}</p>
      </div>
    `;
  }

  static get styles() {
    return [
      // language=CSS
      css`
        :host {
          display: block;
        }

        /* region RESET */

        p {
          margin: 0;
        }

        ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        /* endregion */

        /* region wrapper */

        .wrapper {
          background-color: var(--cc-color-bg-default, #fff);
          border: 2px solid var(--cc-color-border-neutral, #aaa);
          border-radius: var(--cc-border-radius-default, 0.25em);
          box-sizing: border-box;
          display: grid;
          gap: 0.75em;
          grid-template-areas:
            'icon name status'
            'description description description';
          grid-template-columns: min-content auto 1fr;
          grid-template-rows: min-content auto;
          height: 100%;
          padding: 1em;
          position: relative;
        }

        .wrapper:hover {
          border-color: var(--cc-color-border-neutral-focused, #777);
          cursor: pointer;
        }

        .wrapper:focus-within {
          border: 2px solid var(--cc-color-border-neutral-focused, #777);
          outline: var(--cc-focus-outline, #000 solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        .wrapper--no-status {
          grid-template-areas:
            'icon name'
            'description description';
          grid-template-columns: min-content 1fr;
          grid-template-rows: min-content auto;
        }

        /* endregion */

        /* region grid-items */

        cc-img {
          border-radius: var(--cc-border-radius-default, 0.25em);
          height: 2em;
          width: 2em;
        }

        .name {
          color: var(--cc-color-text-strongest, #000);
          font-size: 1.75em;
          text-decoration: none;
        }

        .name::after {
          content: '';
          height: 100%;
          left: 0;
          position: absolute;
          top: 0;
          width: 100%;
        }

        .name:focus {
          outline: none;
        }

        .product-status {
          align-self: center;
          font-size: 0.85em;
          grid-area: status;
          width: min-content;
        }

        .description {
          color: var(--cc-color-text-weak, #333);
          font-size: 0.8em;
          grid-area: description;
          line-height: 1.5em;
        }

        /*  endregion */
      `,
    ];
  }
}

window.customElements.define('cc-product-card', CcProductCard);
