import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { isStringBlank, isStringEmpty } from '../../lib/utils.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import { i18n } from '../../translations/translation.js';
import '../cc-button/cc-button.js';
import '../cc-img/cc-img.js';
import { CcProductCreateEvent } from './cc-order-summary.events.js';

/**
 * @import { ConfigurationItem, OrderSummary, TotalItem } from './cc-order-summary.types.js'
 */

/**
 * Displays a summary of a product being ordered.
 *
 * The UI is composed of:
 * - a card with global information about the product,
 * - a configuration in the form of a list of label/value,
 * - the tags, in their own section,
 * - a total and a button to trigger the creation,
 * - a list of details for additional information, under the card.
 *
 * ## Details
 *
 * When `productName` is set, the logo becomes decorative: the product name is read from the visible text instead of
 * from the logo alternative text, which drops a duplicate announcement.
 *
 * @cssdisplay block
 *
 * @cssprop {FontSize} --cc-order-summary-detail-font-size - The font-size for the list of details (defaults: `0.825em`).
 * @cssprop {FontWeight} --cc-order-summary-font-weight - Sets the value of the font weight CSS property (defaults: `600`).
 *
 * @slot detail - a single piece of information displayed under the card. You can insert multiple detail items.
 */

export class CcOrderSummary extends LitElement {
  static get properties() {
    return {
      orderSummary: { type: Object, attribute: 'order-summary' },
    };
  }

  constructor() {
    super();

    /** @type {OrderSummary} component main datas */
    this.orderSummary = null;
  }

  _onCreateClick() {
    this.dispatchEvent(new CcProductCreateEvent());
  }

  render() {
    if (this.orderSummary == null) {
      return '';
    }

    return html`
      <div class="title">${i18n('cc-order-summary.title')}</div>
      <div class="card">
        ${this._renderHeader()} ${this._renderBody()} ${this._renderTags()} ${this._renderFooter()}
      </div>
      <div class="details-container">
        <slot name="detail"></slot>
      </div>
    `;
  }

  _renderHeader() {
    const { name, productName, logo } = this.orderSummary;

    // When the product name is visible, the logo is decorative and needs no alternative text.
    const hasProductName = !isStringBlank(productName);
    const hasLogo = !isStringEmpty(logo?.url) && (hasProductName || !isStringEmpty(logo?.alt));

    return html`
      <div class="header">
        ${hasLogo
          ? html`<cc-img class="header--logo" src="${logo.url}" a11y-name="${hasProductName ? '' : logo.alt}"></cc-img>`
          : ``}
        <div class="header--text">
          ${hasProductName ? html`<div class="header--product-name">${productName}</div>` : ``}
          ${!isStringEmpty(name)
            ? html`<div class="header--name">${name}</div>`
            : html`<div class="header--name header--name-empty">&hellip;</div>`}
        </div>
      </div>
    `;
  }

  _renderBody() {
    const configuration = this.orderSummary.configuration ?? [];

    if (configuration.length === 0) {
      return '';
    }

    return html`<dl class="body">
      ${configuration.map((/** @type {ConfigurationItem} */ configItem) => {
        const { label, value, a11yLive, skeleton, skeletonValueOnly } = configItem;
        const ariaLive = a11yLive ? 'polite' : null;
        const ariaAtomic = a11yLive ? 'false' : null;
        return html`<div class="body--item" aria-live="${ifDefined(ariaLive)}" aria-atomic="${ifDefined(ariaAtomic)}">
          <dt class="body--label">
            <span class="${classMap({ skeleton })}">${label}</span>
          </dt>
          <dd class="body--value">
            <span class="${classMap({ skeleton: skeleton || skeletonValueOnly })}">${value}</span>
          </dd>
        </div>`;
      })}
    </dl>`;
  }

  _renderTags() {
    const visibleTags = this.orderSummary.tags?.filter((tag) => !isStringBlank(tag)) ?? [];

    if (visibleTags.length === 0) {
      return '';
    }

    return html`
      <div class="tags">
        <div class="tags--title" id="tags-title">${i18n('cc-order-summary.tags')}</div>
        <ul class="tags--list" aria-labelledby="tags-title">
          ${visibleTags.map((tag) => html`<li class="tags--item">${tag.trim()}</li>`)}
        </ul>
      </div>
    `;
  }

  _renderFooter() {
    const { total, submitStatus } = this.orderSummary;
    const disabled = submitStatus === 'disabled';
    const waiting = submitStatus === 'waiting';

    return html`
      <div class="footer">
        ${total != null ? this._renderTotal(total) : ``}
        <cc-button
          class="btn-submit"
          type="submit"
          primary
          ?waiting=${waiting}
          ?disabled=${disabled && !waiting}
          @cc-click=${this._onCreateClick}
        >
          ${i18n('cc-order-summary.create')}
        </cc-button>
      </div>
    `;
  }

  /** @param {TotalItem} total */
  _renderTotal(total) {
    const { label, value, a11yLive, skeletonValueOnly } = total;
    const ariaLive = a11yLive ? 'polite' : null;
    // The whole item is announced, so a price update is read along with its label.
    const ariaAtomic = a11yLive ? 'true' : null;

    return html`<dl class="total">
      <div class="total--item" aria-live="${ifDefined(ariaLive)}" aria-atomic="${ifDefined(ariaAtomic)}">
        <dt class="total--label">${label}</dt>
        <dd class="total--value">
          <span class="${classMap({ skeleton: skeletonValueOnly })}">${value}</span>
        </dd>
      </div>
    </dl>`;
  }

  static get styles() {
    return [
      skeletonStyles,
      // language=CSS
      css`
        :host {
          display: block;
        }

        /* region reset */
        dl {
          margin-block: 0;
        }

        dd {
          margin-inline-start: 0;
        }
        /* endregion */

        /* region blocks */
        .title {
          color: var(--cc-color-text-weak, #404040);
          font-weight: var(--cc-order-summary-font-weight, 600);
          margin-block-end: var(--cc-spacing-3, 0.5em);
          padding-inline: var(--cc-spacing-0, 0.125em);
        }

        .card {
          background-color: var(--cc-color-bg-default, #fff);
          border: 1px solid var(--cc-color-border-neutral, #bfbfbf);
          border-radius: var(--cc-border-radius-medium, 0.375em);
          display: flex;
          flex-direction: column;
          /* Clips the section backgrounds to the rounded corners. */
          overflow: hidden;
        }
        /* endregion */

        /* region elements > header */
        .header {
          column-gap: var(--cc-spacing-4, 0.75em);
          display: flex;
          padding: var(--cc-spacing-5, 1em) var(--cc-spacing-7, 1.5em);
        }

        .header--logo {
          border-radius: var(--cc-border-radius-small, 0.25em);
          flex: 0 0 auto;
          height: 3em;
          overflow: hidden;
          width: 3em;
        }

        .header--text {
          display: flex;
          flex-direction: column;
          min-width: 0;
          padding-block-start: var(--cc-spacing-1, 0.25em);
        }

        .header--name {
          font-size: 1.125em;
          font-weight: var(--cc-order-summary-font-weight, 600);
          word-break: break-word;
        }

        .header--product-name {
          color: var(--cc-color-text-weak, #404040);
        }
        /* endregion */

        /* region elements > tags */
        .tags {
          background-color: var(--cc-color-bg-neutral, #f5f5f5);
          border-block-start: 1px solid var(--cc-color-border-neutral-weak, #e7e7e7);
          display: flex;
          flex-direction: column;
          gap: var(--cc-spacing-1, 0.25em);
          padding: var(--cc-spacing-5, 1em) var(--cc-spacing-7, 1.5em);
        }

        .tags--title {
          color: var(--cc-color-text-weak, #404040);
          font-size: 0.875em;
          font-weight: var(--cc-order-summary-font-weight, 600);
        }

        .tags--list {
          display: flex;
          flex-wrap: wrap;
          gap: var(--cc-spacing-2, 0.35em);
          list-style: none;
          margin: 0;
          padding: 0;
        }

        /* Close to the look of the tags typed in the tags mode of cc-input-text */
        .tags--item {
          background-color: var(--cc-color-bg-soft, #eee);
          border-radius: var(--cc-border-radius-small, 0.25em);
          color: var(--cc-color-text-default, #262626);
          font-family: var(--cc-ff-monospace, monospace);
          font-size: 0.85em;
          overflow-wrap: anywhere;
          padding: var(--cc-spacing-1, 0.25em);
        }
        /* endregion */

        /* region elements > body */
        .body {
          border-block-start: 1px solid var(--cc-color-border-neutral-weak, #e7e7e7);
          display: flex;
          flex-direction: column;
          padding: var(--cc-spacing-5, 1em) var(--cc-spacing-7, 1.5em);
        }

        .body--item {
          align-items: baseline;
          column-gap: var(--cc-spacing-5, 1em);
          display: flex;
          padding-block: var(--cc-spacing-4, 0.75em);
        }

        .body--item:not(:first-child) {
          border-block-start: 1px solid var(--cc-color-border-neutral-weak, #e7e7e7);
        }

        .body--label {
          color: var(--cc-color-text-weak, #404040);
          flex: 1 1 auto;
        }

        .body--value {
          flex: 0 1 auto;
          font-weight: var(--cc-order-summary-font-weight, 600);
          text-align: end;
        }
        /* endregion */

        /* region elements > details */
        .details-container {
          display: flex;
          flex-direction: column;
          padding-inline: var(--cc-spacing-3, 0.5em);
          row-gap: var(--cc-spacing-3, 0.5em);
        }

        ::slotted([slot='detail']) {
          color: var(--cc-color-text-weak, #404040);
          font-size: var(--cc-order-summary-detail-font-size, 0.825em);
          line-height: 1.5;
        }

        ::slotted([slot='detail']:first-child) {
          margin-block-start: var(--cc-spacing-7, 1.5em);
        }

        ::slotted([slot='detail']:last-child) {
          margin-block-end: var(--cc-spacing-7, 1.5em);
        }
        /* endregion */

        /* region elements > footer */
        .footer {
          background-color: var(--cc-color-bg-primary-weaker, #e6eff8);
          border-block-start: 1px solid var(--cc-color-border-neutral-weak, #e7e7e7);
          display: flex;
          flex-direction: column;
          gap: var(--cc-spacing-5, 1em);
          padding: var(--cc-spacing-5, 1em) var(--cc-spacing-7, 1.5em);
        }

        .total--label {
          color: var(--cc-color-text-weak, #404040);
        }

        .total--value {
          font-size: 1.5em;
          font-weight: var(--cc-order-summary-font-weight, 600);
        }
        /* endregion */

        /* region elements > misc */
        .skeleton {
          background-color: var(--cc-color-bg-neutral-active, #d9d9d9);
          padding-inline: var(--cc-spacing-1, 0.25em);
        }
        /* endregion */
      `,
    ];
  }
}

// eslint-disable-next-line wc/tag-name-matches-class
window.customElements.define('cc-order-summary-beta', CcOrderSummary);
