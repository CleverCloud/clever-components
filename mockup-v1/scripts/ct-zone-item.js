import { LitElement, html, css } from 'lit';
import {
  iconRemixLeafFill as greenIcon,
  iconRemixCheckboxCircleFill as selectedIcon,
} from '../../src/assets/cc-remix.icons.js';

const TAGS_DELIMITER = ':';

export class CtZoneItem extends LitElement {
  static get properties () {
    return {
      name: { type: String },
      city: { type: String },
      countryCode: { type: String, attribute: 'country-code' },
      tags: { type: Array },
      _countryUrl: { type: String, state: true },
      _infraUrl: { type: String, state: true },
      _isGreen: { type: Boolean, state: true },
    };
  };

  constructor () {
    super();

    this.name = '';
    this.city = '';
    this.countryCode = '';
    this.tags = [];
  }

  connectedCallback () {
    super.connectedCallback();
    this.addEventListener('click', this._onClick);
  }

  disconnectedCallback () {
    super.disconnectedCallback();
    this.removeEventListener('click', this._onClick);
  }

  _onClick () {
    this.dispatchEvent(new CustomEvent('ct-zone-item:selected', {
      detail: this.name,
      bubbles: true,
      composed: true,
    }));
  }

  willUpdate (_changedProperties) {
    if (_changedProperties.has('tags')) {
      const infraTag = this.tags.find((tag) => tag.startsWith('infra'));
      this._infraUrl = infraTag != null
        ? `assets/logos-square/${infraTag.split(TAGS_DELIMITER)[1].toLowerCase()}.svg`
        : ``
      ;

      this._isGreen = this.tags.includes('green');
    }
    if (_changedProperties.has('countryCode')) {
      this._countryUrl = `https://assets.clever-cloud.com/flags/${this.countryCode.toLowerCase()}.svg`;
    }

    this.blur();
  }

  render () {
    return html`
      <div class="title">
        <div class="infra">${this.name}</div>
        <div class="city">${this.city}</div>
      </div>
      <cc-icon class="icon-selected" .icon="${selectedIcon}" size="lg"></cc-icon>
      <div class="thumbnails">
        <cc-img src="${this._countryUrl}"></cc-img>
        <cc-img src="${this._infraUrl}"></cc-img>
        ${
          this._isGreen
          ? html`<cc-icon class="green" .icon=${greenIcon}></cc-icon>`
          : ``
        }
      </div>
    `;
  }

  static get styles () {
    return [
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
          background-color: #FAFAFA;
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
        
        .green {
          --cc-icon-color: var(--color-green-100);
          --cc-icon-size: 1.25em;
        }
      `,
    ];
  }
}

customElements.define('ct-zone-item', CtZoneItem);
