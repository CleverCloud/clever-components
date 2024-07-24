import { css, html, LitElement } from 'lit';
import { iconRemixCheckboxCircleFill as selectedIcon } from '../../assets/cc-remix.icons.js';
import { dispatchCustomEvent } from '../../lib/events.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import '../cc-badge/cc-badge.js';
import '../cc-icon/cc-icon.js';
import '../cc-img/cc-img.js';

/** @type {Partial<ZoneItem>} */
const LOADING_INFO = {
  name: '???',
  city: '?????',
  infra: null,
};

/**
 * @typedef {import('./cc-ct-zone-select.types.js').ZoneItem} ZoneItem
 * @typedef {import('./cc-ct-zone-select.types.js').ZoneItemState} ZoneItemState
 * @typedef {import('./cc-ct-zone-select.types.js').ZoneItemStateLoaded} ZoneItemStateLoaded
 * @typedef {import('./cc-ct-zone-select.types.js').ZoneItemStateLoading} ZoneItemStateLoading
 * @typedef {import('lit').PropertyValues<CcCtZoneSelect>} CcCtZoneSelectPropertyValues
 */

/**
 * A component doing X and Y (one liner description of your component).
 *
 * @cssdisplay block
 *
 * @fires {CustomEvent<any>} cc-ct-zone-select:zone-selected
 *
 * @cssprop {Color} --cc-loader-color - The color of the animated circle (defaults: `#2653af`).
 */
export class CcCtZoneSelect extends LitElement {
  static get properties() {
    return {
      code: { type: String },
      disabled: { type: Boolean, reflect: true },
      flagUrl: { type: String },
      images: { type: Array },
      infra: { type: String },
      name: { type: String },
      selected: { type: Boolean, reflect: true },
      tags: { type: Array },
    };
  }

  constructor() {
    super();

    /** @type {string} */
    this.code = null;

    /** @type {string} */
    this.name = null;

    /** @type {string} */
    this.infra = null;

    /** @type {string} */
    this.flagUrl = null;

    /** @type {string[]} */
    this.images = [];

    /** @type {string[]} */
    this.tags = [];

    /** @type {boolean} */
    this.disabled = false;

    /** @type {boolean} */
    this.selected = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this._onClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('click', this._onClick);
  }

  _onClick() {
    if (this.disabled && this.selected) {
      dispatchCustomEvent(this, 'zone-selected', this.code);
    }
  }

  render() {
    return html`
      <div class="title">
        <div class="infra">${this.code}</div>
        <div class="city">${this.name}</div>
      </div>
      <cc-icon class="icon-selected" .icon="${selectedIcon}" size="lg"></cc-icon>
      <div class="thumbnails">
        ${this.flagUrl ? html` <cc-img class="flag" src=${this.flagUrl}></cc-img> ` : ''}
        ${this.images.map((image) => html`<cc-img src="${image}"></cc-img>`)}
        <div class="tags">${this.tags.map((tag) => html`<cc-badge>${tag}</cc-badge>`)}</div>
      </div>
    `;
  }

  static get styles() {
    return [
      skeletonStyles,
      // language=CSS
      css`
        :host {
          display: flex;
          flex-direction: column;
          position: relative;
          border: 2px solid var(--cc-color-border-neutral);
          border-radius: var(--cc-border-radius-default);
          overflow: hidden;
        }

        :host .title {
          flex: 1 1 auto;
        }
        :host .thumbnails {
          flex: 0 0 auto;
        }

        :host(:hover:not([disabled])) {
          border-color: var(--cc-color-border-neutral-hovered);
        }
        :host(:not([selected]):not([disabled])) {
          cursor: pointer;
        }

        :host(:focus-visible) {
          outline: var(--cc-focus-outline);
          outline-offset: 2px;
        }

        :host([selected]) {
          border-color: var(--cc-color-bg-primary);
        }
        :host([selected]) .title .infra {
          color: var(--cc-color-text-primary-strong);
        }
        :host([selected]) .title .city {
          color: var(--cc-color-text-primary-strongest);
        }
        :host([selected]) .icon-selected {
          opacity: 1;
        }
        :host([selected]) .thumbnails {
          background-color: var(--cc-color-bg-primary-weak);
        }

        :host([disabled]) {
          border-color: var(--cc-color-border-neutral-disabled);
          opacity: var(--cc-opacity-when-disabled);
        }
        :host([disabled]) .title .infra,
        :host([disabled]) .title .city {
          opacity: var(--cc-opacity-when-disabled);
        }
        :host([disabled]) .thumbnails {
          background-color: #fafafa;
        }
        :host([disabled]) .thumbnails cc-icon,
        :host([disabled]) .thumbnails cc-img {
          filter: grayscale(1);
          opacity: var(--cc-opacity-when-disabled);
        }

        .title {
          padding: 1em 1em 0.75em 1em;
        }

        .infra {
          padding-inline-start: 0.125em;
          font-size: 0.875em;
          line-height: 1.125;
          color: var(--cc-color-text-weaker);
        }
        .city {
          font-size: 1.5em;
          line-height: 1.125;
        }

        .icon-selected {
          --cc-icon-color: var(--cc-color-bg-primary);

          position: absolute;
          top: 0.5em;
          right: 0.5em;
          opacity: 0;
        }

        .thumbnails {
          display: inline-flex;
          align-items: center;
          gap: 0.5em;
          padding: 0.75em 1.125em;
          background-color: var(--cc-color-bg-neutral);
        }
        .thumbnails > cc-img {
          --cc-img-fit: contain;

          width: 1.25em;
          height: 1.125em;
        }
      `,
    ];
  }
}

// DOCS: 11. Define the custom element

window.customElements.define('cc-ct-zone-select', CcCtZoneSelect);
