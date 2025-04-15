import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { isStringBlank, isStringEmpty } from '../../lib/utils.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import { i18n } from '../../translations/translation.js';
import '../cc-badge/cc-badge.js';
import '../cc-button/cc-button.js';
import '../cc-img/cc-img.js';
import { CcProductCreateEvent } from './cc-order-summary.events.js';

/**
 * @typedef {import('./cc-order-summary.types.js').ConfigurationItem} ConfigurationItem
 * @typedef {import('./cc-order-summary.types.js').LogoInfos} LogoInfos
 * @typedef {import('./cc-order-summary.types.js').OrderSummary} OrderSummary
 */

/**
 * Displays a summary of a product being ordered.
 *
 * The UI is composed of:
 * - global information about the product,
 * - a configuration in the form of a list of label/value,
 * - a button to trigger the creation,
 * - a list of details for additional information.
 *
 * @cssdisplay block
 *
 * @cssprop {FontSize} --cc-order-summary-detail-font-size - The font-size for the list of details (defaults: `0.825em`).
 * @cssprop {FontWeight} --cc-order-summary-font-weight - Sets the value of the font weight CSS property (defaults: `600`).
 *
 * @slot detail - a single piece of information displayed under the main part of the UI. You can insert multiple detail items.
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
      <div class="summary">${this._renderSummary()}</div>
      <div class="details-container">
        <slot name="detail"></slot>
      </div>
    `;
  }

  _renderSummary() {
    const { submitStatus } = this.orderSummary;
    const disabled = submitStatus === 'disabled';
    const waiting = submitStatus === 'waiting';
    return html`
      ${this._renderSummaryHeader()} ${this._renderSummaryBody()}
      <div class="footer">
        <cc-button
          class="btn-submit"
          type="submit"
          primary
          ?waiting=${waiting}
          ?disabled=${disabled && !waiting}
          @cc-button:click=${this._onCreateClick}
        >
          ${i18n('cc-order-summary.create')}
        </cc-button>
      </div>
    `;
  }

  _renderSummaryHeader() {
    const { name, tags, logo } = this.orderSummary;

    const tagTplFn = (/** @type {string} */ tag) =>
      html`<cc-badge intent="info" weight="dimmed">${tag.trim()}</cc-badge>`;

    return html`
      <div class="header">
        ${!isStringEmpty(name)
          ? html`<div class="header--name">${name}</div>`
          : html`<div class="header--name header--name-empty">&hellip;</div>`}
        ${tags?.length > 0
          ? html`<div class="header--tags">${tags.filter((tag) => !isStringBlank(tag)).map(tagTplFn)}</div>`
          : ``}
        ${!isStringEmpty(logo?.url) && !isStringEmpty(logo?.alt)
          ? html`<div class="header--logo">
              <cc-img class="logo" src="${logo.url}" a11y-name="${logo.alt}"></cc-img>
            </div>`
          : ``}
      </div>
    `;
  }

  _renderSummaryBody() {
    return html`<dl class="body">
      ${this.orderSummary.configuration?.map((/** @type {ConfigurationItem} */ configItem) => {
        const { label, value, a11yLive, skeleton, skeletonValueOnly } = configItem;
        const ariaLive = a11yLive ? 'polite' : null;
        const ariaAtomic = a11yLive ? 'false' : null;
        return html`<div class="body--item" aria-live="${ifDefined(ariaLive)}" aria-atomic="${ifDefined(ariaAtomic)}">
          <dt class="body--label">
            <span class="${classMap({ skeleton })}">${label}</span>
          </dt>
          <dd class="body--value ${classMap({ skeleton: skeleton || skeletonValueOnly })}">
            <span>${value}</span>
          </dd>
        </div>`;
      })}
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
          margin-block-end: 0.5em;
          padding-inline: 0.125em;
        }

        .summary {
          background-color: var(--cc-color-bg-neutral, #f5f5f5);
          border: 1px solid var(--cc-color-border-neutral-weak, #e7e7e7);
          border-radius: var(--cc-border-radius-default, 0.25em);
          display: flex;
          flex-direction: column;
          padding: 1.5em;
          row-gap: 2em;
        }
        /* endregion */

        /* region elements > header */
        .header {
          display: grid;
          gap: 0.25em;
          grid-template-columns: 1fr min-content;
        }

        .header--name {
          font-size: 1.125em;
          font-weight: var(--cc-order-summary-font-weight, 600);
          grid-column: 1 / 2;
          grid-row: 1 / 2;
          word-break: break-word;
        }

        .header--tags {
          display: inline-flex;
          flex-wrap: wrap;
          gap: 0.25em;
          grid-column: 1 / 2;
          grid-row: 2 / 3;
        }

        .header--logo {
          grid-column: 2 / 3;
          grid-row: 1 / 3;
        }
        /* endregion */

        /* region elements > body */
        .body {
          display: flex;
          flex-direction: column;
        }

        .body--item {
          align-items: baseline;
          column-gap: 0.5em;
          display: flex;
        }

        .body--item:not(:last-child) {
          border-block-end: 1px dotted var(--cc-color-border-primary-weak, #ccd4dc);
          margin-block-end: 1em;
          padding-block-end: 1em;
        }

        .body--label {
          color: var(--cc-color-text-weak, #404040);
          flex: 1 1 auto;
        }

        .body--value {
          flex: 0 1 auto;
          font-weight: var(--cc-order-summary-font-weight, 600);
        }
        /* endregion */

        /* region elements > details */
        .details-container {
          display: flex;
          flex-direction: column;
          padding-inline: 0.5em;
          row-gap: 0.5em;
        }

        ::slotted([slot='detail']) {
          color: var(--cc-color-text-weak, #404040);
          font-size: var(--cc-order-summary-detail-font-size, 0.825em);
          line-height: 1.5;
        }

        ::slotted([slot='detail']:first-child) {
          margin-block-start: 1.5em;
        }

        ::slotted([slot='detail']:last-child) {
          margin-block-end: 1.5em;
        }
        /* endregion */

        /* region elements > misc */
        .logo {
          border: 1px solid var(--cc-color-border-neutral-weak, #e7e7e7);
          border-radius: var(--cc-border-radius-default, 0.25em);
          height: 3em;
          overflow: hidden;
          width: 3em;
        }

        .btn-submit {
          display: block;
          margin-block-start: 0.5em;
        }

        .skeleton {
          background-color: var(--cc-color-bg-neutral-active, #d9d9d9);
          padding-inline: 0.25em;
        }
        /* endregion */
      `,
    ];
  }
}

// eslint-disable-next-line wc/tag-name-matches-class
window.customElements.define('cc-order-summary-beta', CcOrderSummary);
