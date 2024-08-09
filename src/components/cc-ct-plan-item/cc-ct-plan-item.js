import { css, html, LitElement } from 'lit';
import { iconRemixCheckboxCircleFill as selectedIcon } from '../../assets/cc-remix.icons.js';
import '../cc-icon/cc-icon.js';

/**
 * A component doing X and Y (one liner description of your component).
 *
 * ## Details
 *
 * * Details about bla.
 * * Details about bla bla.
 * * Details about bla bla bla.
 *
 * ## Technical details
 *
 * * Technical details about foo.
 * * Technical details about bar.
 * * Technical details about baz.
 *
 * @cssdisplay block
 *
 *
 * @fires {CustomEvent<ExampleInterface>} example-component:event-name - Fires XXX whenever YYY.
 *
 * @slot - The content of the button (text or HTML). If you want an image, please look at the `image` attribute.
 *
 * @cssprop {Color} --cc-loader-color - The color of the animated circle (defaults: `#2653af`).
 */
export class CcCtPlanItem extends LitElement {
  // DOCS: 1. LitElement's properties descriptor

  static get properties() {
    return {
      id: { type: String },
      name: { type: String },
      details: { type: Array },
      selected: { type: Boolean, reflect: true },
    };
  }

  // DOCS: 2. Constructor

  constructor() {
    super();

    this.id = null;

    this.name = null;

    this.details = [];
  }

  render() {
    return html`
      <div class="title">
        <div class="name">${this.name}</div>
        <div class="decorator"><slot name="decorator"></slot></div>
      </div>
      <cc-icon class="icon-selected" .icon="${selectedIcon}" size="lg"></cc-icon>
      ${this.details?.length
        ? html`<div class="details">${this.details.map((detail) => this._renderDetail(detail))}</div>`
        : ``}
    `;
  }

  _renderDetail(detail) {
    return html`
      <div class="detail">
        <span class="detail-icon"><cc-icon .icon="${detail.icon}" size="md"></cc-icon></span>
        <span class="detail-value">${detail.data.value}&nbsp;${detail.data.name}</span>
      </div>
    `;
  }

  static get styles() {
    return [
      // language=CSS
      css`
        :host {
          border: 2px solid var(--cc-color-border-neutral);
          border-radius: var(--cc-border-radius-default);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          position: relative;
        }

        :host .title {
          flex: 1 1 auto;
        }
        :host .details {
          flex: 0 0 auto;
        }

        :host(:hover) {
          border-color: var(--cc-color-border-neutral-hovered);
        }
        :host(:not([selected])) {
          cursor: pointer;
        }

        :host(:focus-visible) {
          outline: var(--cc-focus-outline);
          outline-offset: 2px;
        }

        :host([selected]) {
          border-color: var(--cc-color-bg-primary);
        }
        :host([selected]) .icon-selected {
          opacity: 1;
        }
        :host([selected]) .name {
          color: var(--cc-color-text-primary-strongest);
        }
        :host([selected]) .details {
          background-color: var(--cc-color-bg-primary-weak);
        }
        :host([selected]) .detail--icon {
          color: var(--cc-color-text-primary);
        }
        :host([selected]) .detail--value {
          color: var(--cc-color-text-primary-strongest);
        }

        .title {
          align-items: center;
          column-gap: 0.375em;
          display: inline-flex;
          flex-wrap: wrap;
          padding: 1em 1em 0.75em;
        }

        .name {
          flex: 0 0 auto;
          font-size: 1.25em;
        }
        .decorator {
          flex: 0 0 auto;
        }

        .icon-selected {
          --cc-icon-color: var(--cc-color-bg-primary);
          opacity: 0;

          position: absolute;
          right: 0.5em;
          top: 0.5em;
        }

        .details {
          background-color: var(--cc-color-bg-neutral);
          display: flex;
          flex-direction: column;
          gap: 0.5em;
          padding: 0.75em 1.125em;
        }

        .detail {
          align-items: center;
          display: inline-flex;
          flex: 0 0 auto;
          gap: 0.5em;
          line-height: 1;
        }

        .detail-icon {
          color: var(--cc-color-text-weak);
          flex: 0 0 auto;
        }
        .detail-value {
          color: var(--cc-color-text-weak);
          flex: 1 1 auto;
          font-size: 0.875em;
        }
      `,
    ];
  }
}

// DOCS: 11. Define the custom element

window.customElements.define('cc-ct-plan-item', CcCtPlanItem);
