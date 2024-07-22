import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
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
      state: { type: Object },
    };
  }

  constructor() {
    super();

    /** @type {ZoneItemState} - state of the zone item */
    this.state = { type: 'loading' };
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
    if (this.state.type === 'loaded' && !this.state.disabled && !this.state.selected) {
      dispatchCustomEvent(this, 'zone-selected', {
        zone: this.state.name,
        selected: this.state.selected,
      });
    }
  }

  render() {
    const loading = this.state.type === 'loading';
    const data = this.state.type === 'loaded' ? this.state : LOADING_INFO;
    const tags = data.tags ?? [];

    return html`
      ${loading
        ? html`
            <div class="wrapper loading">
              <div class="title">
                <div class="infra skeleton">${data.name}</div>
                <div class="city skeleton">${data.city}</div>
              </div>
              <div class="thumbnails">
                <cc-img skeleton></cc-img>
                <cc-icon .icon="${data.infra}" skeleton></cc-icon>
                <div class="tags">
                  <cc-badge skeleton>fii</cc-badge>
                </div>
              </div>
            </div>
          `
        : ''}
      ${this.state.type === 'loaded'
        ? html`
            <div
              class="wrapper ${classMap({ selected: data.selected, disabled: data.disabled })}"
              tabindex="${data.disabled ? '-1' : '0'}"
              role="button"
            >
              <div class="title">
                <div class="infra">${data.name}</div>
                <div class="city">${data.city}</div>
              </div>
              <cc-icon class="icon-selected" .icon="${selectedIcon}" size="lg"></cc-icon>
              <div class="thumbnails">
                ${data.flagUrl ? html` <cc-img class="flag" src=${data.flagUrl}></cc-img> ` : ''}
                ${data.images.map((image) => html`<cc-img src="${image}"></cc-img>`)}
                <div class="tags">${tags.map((tag) => html`<cc-badge>${tag}</cc-badge>`)}</div>
              </div>
            </div>
          `
        : ''}
    `;
  }

  static get styles() {
    return [
      skeletonStyles,
      // language=CSS
      css`
        :host {
          display: block;
        }

        .wrapper {
          border: 2px solid var(--cc-color-border-neutral);
          border-radius: var(--cc-border-radius-default);
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow: hidden;
          position: relative;
        }

        .wrapper .title {
          flex: 1 1 auto;
        }

        .wrapper .thumbnails {
          flex: 0 0 auto;
        }

        .wrapper:hover:not(.disabled, .loading) {
          border-color: var(--cc-color-border-neutral-hovered);
        }

        .wrapper:not(.selected, .disabled, .loading) {
          cursor: pointer;
        }

        :host(:focus-visible) {
          outline: 0;
        }

        :host(:focus-visible) .wrapper {
          outline: var(--cc-focus-outline);
          outline-offset: 2px;
        }

        .wrapper.selected {
          border-color: var(--cc-color-bg-primary);
        }

        .wrapper.selected .title .infra {
          color: var(--cc-color-text-primary-strong);
        }

        .wrapper.selected .title .city {
          color: var(--cc-color-text-primary-strongest);
        }

        .wrapper.selected .icon-selected {
          opacity: 1;
        }

        .wrapper.selected .thumbnails {
          background-color: var(--cc-color-bg-primary-weak);
        }

        .wrapper.disabled {
          border-color: var(--cc-color-border-neutral-disabled);
          opacity: var(--cc-opacity-when-disabled);
        }

        .wrapper.disabled .title .infra,
        .wrapper.disabled .title .city {
          opacity: var(--cc-opacity-when-disabled);
        }

        .wrapper.disabled .thumbnails {
          background-color: #fafafa;
        }

        .wrapper.disabled .thumbnails cc-icon,
        .wrapper.disabled .thumbnails cc-img {
          filter: grayscale(1);
          opacity: var(--cc-opacity-when-disabled);
        }

        .title {
          padding: 1em 1em 0.75em;
          width: max-content;
        }

        .infra {
          color: var(--cc-color-text-weak);
          font-size: 0.875em;
          line-height: 1.125;
          padding-inline-start: 0.125em;
        }

        .city {
          font-size: 1.5em;
          line-height: 1.125;
          margin-top: 0.2em;
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

          height: 1.125em;
          width: 1.25em;
        }

        .green {
          --cc-icon-color: var(--color-green-100);
          --cc-icon-size: 1.25em;
        }

        .skeleton.infra {
          color: transparent;
        }

        .skeleton {
          background-color: #bbb;
        }

        .flag {
          box-shadow:
            rgb(17 17 26 / 10%) 0 4px 16px,
            rgb(17 17 26 / 10%) 0 8px 24px,
            rgb(17 17 26 / 10%) 0 16px 56px;
        }
      `,
    ];
  }
}

// DOCS: 11. Define the custom element

window.customElements.define('cc-ct-zone-select', CcCtZoneSelect);
