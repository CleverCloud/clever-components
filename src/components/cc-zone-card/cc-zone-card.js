import { css, html, LitElement } from 'lit';
import { iconRemixCheckboxCircleFill as selectedIcon } from '../../assets/cc-remix.icons.js';
import { i18n } from '../../translations/translation.js';
import '../cc-icon/cc-icon.js';
import '../cc-img/cc-img.js';

/**
 * @typedef {import('./cc-zone-card.types.js').ZoneImage} ZoneImage
 */

/**
 * A component displaying a card with relative zone information (name, code...)
 *
 * @cssdisplay flex
 */
export class CcZoneCard extends LitElement {
  static get properties() {
    return {
      code: { type: String },
      country: { type: String },
      countryCode: { type: String, attribute: 'country-code' },
      disabled: { type: Boolean, reflect: true },
      flagUrl: { type: String, attribute: 'flag-url' },
      images: { type: Array },
      name: { type: String },
      selected: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super();

    /** @type {string} The zone code */
    this.code = null;

    /** @type {string} The country name */
    this.country = null;

    /** @type {string} The ISO 3166-1 alpha-2 country code (e.g: FR) */
    this.countryCode = null;

    /** @type {boolean} Whether the card should be disabled */
    this.disabled = false;

    /** @type {string} The url of the flag image */
    this.flagUrl = null;

    /** @type {ZoneImage[]} A list of images that will displayed in the footer */
    this.images = [];

    /** @type {string} The name of the zone */
    this.name = null;

    /** @type {boolean} Whether the card should be selected */
    this.selected = false;
  }

  render() {
    return html`
      <div class="title">
        <div class="zone-code">${this.code}</div>
        <div class="zone-name">${this.name}</div>
      </div>
      <cc-icon class="icon-selected" .icon="${selectedIcon}" size="lg"></cc-icon>
      <div class="thumbnails">
        ${this.flagUrl
          ? html`
              <cc-img
                class="flag"
                src=${this.flagUrl}
                a11y-name="${i18n('cc-zone-card.alt.country-name', {
                  code: this.countryCode,
                  name: this.country,
                })}"
              ></cc-img>
            `
          : ''}
        ${this.images.map((image) => html`<cc-img src="${image.url}" a11y-name="${image.alt}"></cc-img>`)}
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

        .title {
          flex: 1 1 auto;
          padding: 1em 1em 0.75em;
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

        :host([selected]) .title .zone-code {
          color: var(--cc-color-text-primary-strong);
        }

        :host([selected]) .title .zone-name {
          color: var(--cc-color-text-primary-strongest);
        }

        :host([selected]) .icon-selected {
          display: block;
        }

        :host([selected]) .thumbnails {
          background-color: var(--cc-color-bg-primary-weak);
        }

        :host([disabled]) {
          border-color: var(--cc-color-border-neutral-disabled);
          opacity: var(--cc-opacity-when-disabled);
        }

        :host([disabled]) .zone-code {
          color: #fff;
        }

        :host([disabled]) .thumbnails cc-icon,
        :host([disabled]) .thumbnails cc-img {
          filter: grayscale(1);
        }

        .zone-code {
          color: var(--cc-color-text-weak);
          font-size: 0.875em;
          line-height: 1.125;
          padding-inline-start: 0.125em;
        }

        .zone-name {
          font-size: 1.5em;
          line-height: 1.125;
        }

        .icon-selected {
          --cc-icon-color: var(--cc-color-bg-primary);

          display: none;
          position: absolute;
          right: 0.5em;
          top: 0.5em;
        }

        .thumbnails {
          align-items: center;
          background-color: var(--cc-color-bg-neutral);
          display: inline-flex;
          flex: 0 0 auto;
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

window.customElements.define('cc-zone-card', CcZoneCard);
