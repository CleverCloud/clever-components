import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { isStringEmpty } from '../../lib/utils.js';
import { i18n } from '../../translations/translation.js';
import '../cc-badge/cc-badge.js';
import '../cc-button/cc-button.js';
import '../cc-img/cc-img.js';

/** @import { ProductCardBadge } from './cc-product-card.types.js' */

/**
 * A component displaying some information about a product in a card.
 *
 * @cssdisplay block
 *
 * @cssprop {FontSize} --cc-product-card-name-font-size - The font-size of the product name (defaults: `1.75em`).
 */
export class CcProductCard extends LitElement {
  static get properties() {
    return {
      additionalText: { type: String, attribute: 'additional-text' },
      badges: { type: Array },
      description: { type: String },
      iconUrl: { type: String, attribute: 'icon-url' },
      name: { type: String },
      productStatus: { type: String, attribute: 'product-status' },
      url: { type: String },
    };
  }

  constructor() {
    super();

    /** @type {string|null} The text shown in a grey band at the bottom of the card, line breaks are kept */
    this.additionalText = null;

    /** @type {Array<ProductCardBadge>} The badges shown next to the name, after the product status */
    this.badges = [];

    /** @type {string|null} The description of the product */
    this.description = null;

    /** @type {string|null} The icon url of the product, no space is reserved for the icon when it is missing or empty */
    this.iconUrl = null;

    /** @type {string} The name of the product */
    this.name = null;

    /** @type {string|null} The status availability of the product */
    this.productStatus = null;

    /** @type {string|null} The url where the user will be redirected when the product is selected  */
    this.url = null;
  }

  render() {
    const hasIcon = !isStringEmpty(this.iconUrl);
    const hasAdditionalText = !isStringEmpty(this.additionalText);

    // language=HTML
    return html`
      <div
        class="wrapper ${classMap({
          'wrapper--no-icon': !hasIcon,
          'wrapper--with-additional-text': hasAdditionalText,
        })}"
      >
        ${hasIcon ? html` <cc-img src="${this.iconUrl}"></cc-img> ` : ''}
        <div class="title">
          <a class="name" href="${this.url}" title="${i18n('cc-product-card.select', { name: this.name })}">
            ${this.name}
          </a>
          ${!isStringEmpty(this.productStatus)
            ? html` <cc-badge class="product-status">${this.productStatus}</cc-badge> `
            : ''}
          ${this.badges.map(
            (badge) => html` <cc-badge class="badge" .intent="${badge.intent}">${badge.content}</cc-badge> `,
          )}
        </div>
        <p class="description">${this.description}</p>
        ${hasAdditionalText ? html` <p class="additional-text">${this.additionalText}</p> ` : ''}
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
          align-items: center;
          background-color: var(--cc-color-bg-default, #fff);
          border: 2px solid var(--cc-color-border-neutral, #aaa);
          border-radius: var(--cc-border-radius-small, 0.25em);
          box-sizing: border-box;
          display: grid;
          gap: var(--cc-spacing-1, 0.25em) var(--cc-spacing-3, 0.5em);
          grid-template-areas:
            'icon title'
            'description description';
          grid-template-columns: min-content 1fr;
          grid-template-rows: min-content auto;
          height: 100%;
          padding: var(--cc-spacing-5, 1em);
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

        .wrapper--no-icon {
          grid-template-areas:
            'title'
            'description';
          grid-template-columns: 1fr;
        }

        /* The band of the additional text goes to the bottom edge of the card, so the wrapper drops its bottom padding. */
        /* The overflow rounds the bottom corners of the band like the card. */
        .wrapper--with-additional-text {
          grid-template-areas:
            'icon title'
            'description description'
            'additional-text additional-text';
          grid-template-rows: min-content auto min-content;
          overflow: hidden;
          padding-block-end: 0;
        }

        .wrapper--no-icon.wrapper--with-additional-text {
          grid-template-areas:
            'title'
            'description'
            'additional-text';
        }

        /* endregion */

        /* region grid-items */

        cc-img {
          border-radius: var(--cc-border-radius-small, 0.25em);
          grid-area: icon;
          height: 2em;
          width: 2em;
        }

        .title {
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          gap: var(--cc-spacing-1, 0.25em) var(--cc-spacing-3, 0.5em);
          grid-area: title;
        }

        .name {
          color: var(--cc-color-text-strongest, #000);
          font-size: var(--cc-product-card-name-font-size, 1.75em);
          grid-area: name;
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

        .product-status,
        .badge {
          font-size: 0.85em;
        }

        .description {
          color: var(--cc-color-text-weak, #333);
          font-size: 0.8em;
          grid-area: description;
          line-height: 1.5em;
        }

        .additional-text {
          background-color: var(--cc-color-bg-neutral-alt, #e7e7e7);
          font-size: 0.875em;
          grid-area: additional-text;
          margin-block-start: var(--cc-spacing-3, 0.5em);
          /* The padding of the wrapper is in the em of the wrapper. Dividing by the font-size of the band matches it exactly: */
          /* the band goes edge to edge, and its text lines up with the content above it. */
          margin-inline: calc(var(--cc-spacing-5, 1em) / -0.875);
          padding: var(--cc-spacing-3, 0.5em) calc(var(--cc-spacing-5, 1em) / 0.875);
          white-space: pre-line;
        }

        /*  endregion */
      `,
    ];
  }
}

window.customElements.define('cc-product-card', CcProductCard);
