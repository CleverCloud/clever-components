// DOCS: Don't add a 'use strict', no need for them in modern JS modules.
// DOCS: Put all imports here.
// DOCS: Always keep the ".js" at the end when you reference a file directly [error in ESLint].
// DOCS: We enforce import order [fixed by ESLint].
import { css, html, LitElement } from 'lit';
import { iconRemixCheckboxCircleFill as selectedIcon } from '../../assets/cc-remix.icons.js';
import '../cc-icon/cc-icon.js';
import '../cc-img/cc-img.js';

import { classMap } from 'lit/directives/class-map.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import '../cc-badge/cc-badge.js';

// DOCS: You may setup/init some stuffs here but this should be rare and most of the setup should happen in the component.
const MY_AWESOME_CONST = 'foobar';

// DOCS: You may setup/init constant data used when component is in skeleton state.
const SKELETON_FOOBAR = [{ foo: '???????' }, { foo: '????' }, { foo: '???????' }];

/** @type {ZoneItem} */
const LOADING_INFO = {
  name: '???',
  city: '?????',
  countryCode: 'FR',
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
 * @prop {String} one - Description for one.
 * @prop {Boolean} two - Description for two.
 * @prop {ExampleInterface[]} three - Description for three.
 *
 * @fires {CustomEvent<ExampleInterface>} example-component:event-name - Fires XXX whenever YYY.
 *
 * @slot - The content of the button (text or HTML). If you want an image, please look at the `image` attribute.
 *
 * @cssprop {Color} --cc-loader-color - The color of the animated circle (defaults: `#2653af`).
 */
export class CcCtZoneSelect extends LitElement {
  // DOCS: 1. LitElement's properties descriptor

  static get properties() {
    return {
      state: { type: Object },
    };
  }

  // DOCS: 2. Constructor

  constructor() {
    super();

    /** @type {ZoneItemState} - state of the zone item */
    this.state = { type: 'loading' };
  }

  // DOCS: 4. Private methods

  // DOCS: 5. Event handlers

  // DOCS: 6. Custom element lifecycle callbacks

  // DOCS: 7. LitElement lifecycle callbacks
  /**
   * @param {CcCtZoneSelectPropertyValues} changedProperties
   */
  willUpdate(changedProperties) {
    console.log(changedProperties);
    // if (changedProperties.has('state') && 'disabled' in this.state) {
    //   console.log('hello');
    //   this._disabled = true;
    // }
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
            <div class="wrapper ${classMap({ selected: data.selected, disabled: data.disabled })}">
              <div class="title">
                <div class="infra">${data.name}</div>
                <div class="city">${data.city}</div>
              </div>
              <cc-icon class="icon-selected" .icon="${selectedIcon}" size="lg"></cc-icon>
              <div class="thumbnails">
                <cc-img class="flag" src=${data.flagUrl}></cc-img>
                ${data.images.map((image) => html`<cc-img src="${image}"></cc-img>`)}
                <div class="tags">${tags.map((tag) => html`<cc-badge>${tag}</cc-badge>`)}</div>
              </div>
            </div>
          `
        : ''}
    `;
  }

  // DOCS: 9. "sub render" private methods used by the main render()

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
          overflow: hidden;
          position: relative;
          height: 100%;
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
          color: var(--cc-color-text-weaker);
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

        .infra.skeleton {
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
