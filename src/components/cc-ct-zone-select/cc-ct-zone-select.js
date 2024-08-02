import { css, html, LitElement } from 'lit';
import { iconRemixCheckboxCircleFill as selectedIcon } from '../../assets/cc-remix.icons.js';
import { i18n } from '../../lib/i18n.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import '../cc-badge/cc-badge.js';
import '../cc-icon/cc-icon.js';
import '../cc-img/cc-img.js';

/**
 * @typedef {import('./cc-ct-zone-select.types.js').ZoneImage} ZoneImage
 */

/**
 * A component displaying a card with relative zone information (name, code...)
 *
 * @cssdisplay block
 */
export class CcCtZoneSelect extends LitElement {
  static get properties() {
    return {
      code: { type: String },
      countryCode: { type: String, attribute: 'country-code' },
      country: { type: String },
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
    this.country = null;

    /** @type {string} */
    this.countryCode = null;

    /** @type {boolean} */
    this.disabled = false;

    /** @type {string} */
    this.flagUrl = null;

    /** @type {ZoneImage[]} */
    this.images = [];

    /** @type {string} */
    this.infra = null;

    /** @type {string} */
    this.name = null;

    /** @type {boolean} */
    this.selected = false;

    /** @type {string[]} */
    this.tags = [];
  }

  render() {
    return html`
      <div class="title">
        <div class="infra">${this.code}</div>
        <div class="city">${this.name}</div>
      </div>
      <cc-icon class="icon-selected" .icon="${selectedIcon}" size="lg"></cc-icon>
      <div class="thumbnails">
        ${this.flagUrl
          ? html`
              <cc-img
                class="flag"
                src=${this.flagUrl}
                a11y-name="${i18n('cc-ct-zone-select.alt.country-name', {
                  code: this.countryCode,
                  name: this.country,
                })}"
              ></cc-img>
            `
          : ''}
        ${this.images.map((image) => html`<cc-img src="${image.url}" a11y-name="${image.alt}"></cc-img>`)}
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
          border: 2px solid var(--cc-color-border-neutral);
          border-radius: var(--cc-border-radius-default);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          position: relative;
        }

        input {
          height: 100%;
          position: relative;
          width: 100%;
        }

        .flag {
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

        :host(:not([selected], [disabled])) {
          cursor: pointer;
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
          padding: 1em 1em 0.75em;
        }

        .infra {
          color: var(--cc-color-text-weaker);
          font-size: 0.875em;
          line-height: 1.125;
          padding-inline-start: 0.125em;
        }

        .city {
          font-size: 1.5em;
          line-height: 1.125;
        }

        .icon-selected {
          --cc-icon-color: var(--cc-color-bg-primary);

          opacity: 0;
          position: absolute;
          right: 0.5em;
          top: 0.5em;
        }

        .thumbnails {
          align-items: center;
          background-color: var(--cc-color-bg-neutral);
          display: inline-flex;
          gap: 0.5em;
          padding: 0.75em 1.125em;
        }

        .thumbnails > cc-img {
          --cc-img-fit: contain;

          height: 1.5em;
          width: 1.5em;
        }
      `,
    ];
  }
}

window.customElements.define('cc-ct-zone-select', CcCtZoneSelect);
