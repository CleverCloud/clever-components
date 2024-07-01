
// DOCS: Don't add a 'use strict', no need for them in modern JS modules.
// DOCS: Put all imports here.
// DOCS: Always keep the ".js" at the end when you reference a file directly [error in ESLint].
// DOCS: We enforce import order [fixed by ESLint].
import { css, html, LitElement } from 'lit';
import '../cc-icon/cc-icon.js';
import '../cc-img/cc-img.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import {
  iconRemixLeafFill as greenIcon,
  iconRemixCheckboxCircleFill as selectedIcon,
} from '../../assets/cc-remix.icons.js';

import { getFlagUrl, getInfraProviderLogoUrl } from '../../lib/remote-assets.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import '../cc-badge/cc-badge.js';

// DOCS: You may setup/init some stuffs here but this should be rare and most of the setup should happen in the component.
const MY_AWESOME_CONST = 'foobar';

// DOCS: You may setup/init constant data used when component is in skeleton state.
const SKELETON_FOOBAR = [
  { foo: '???????' },
  { foo: '????' },
  { foo: '???????' },
];

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

  static get properties () {
    return {
      state: { type: Object },
      _isGreen: { type: Boolean },
    };
  }

  // DOCS: 2. Constructor

  constructor() {
    super();

    /** @type {ZoneItemState} - state of the zone item */
    this.state = { type: 'loading' };

    this._isGreen = false;
  }

  // DOCS: 3. Public methods

  // DOCS: 4. Private methods

  // DOCS: 5. Event handlers

  // DOCS: 6. Custom element lifecycle callbacks

  // DOCS: 7. LitElement lifecycle callbacks
  /**
   * @param {CcCtZoneSelectPropertyValues} changedProperties
   */
  willUpdate (changedProperties) {
    if (changedProperties.has('state') && 'tags' in this.state) {
      this._isGreen = this.state.tags.includes('green');
      this.state.tags = this.state.tags.filter((tag) => tag !== 'green');
    }
  }

  render () {

    const loading = this.state.type === 'loading';
    const data = this.state.type === 'loaded' ? this.state : LOADING_INFO;
    const tags = data.tags ?? [];

    return html`

      ${loading ? html` 
      <div class="title">
        <div class="infra skeleton">${data.name}</div>
        <div class="city skeleton">${data.city}</div>
      </div>
      <div class="thumbnails">
        <cc-img skeleton></cc-img>
        <cc-icon .icon="${data.infra}" skeleton></cc-icon>
        ${this._isGreen
          ? html`<cc-icon class="green" .icon=${greenIcon}></cc-icon>`
          : ``
        }
        <div class="tags">
          <cc-badge skeleton>fii</cc-badge>
        </div>  
      </div>

      ` : ''}

      ${this.state.type === 'loaded' ? html` 
      <div class="title">
        <div class="infra">${data.name}</div>
        <div class="city">${data.city}</div>
      </div>
      <cc-icon class="icon-selected" .icon="${selectedIcon}" size="lg"></cc-icon>
      <div class="thumbnails">
       <cc-img src=${ifDefined(getFlagUrl(data.countryCode))}></cc-img>
        <cc-icon .icon="${data.infra}"></cc-icon>
        ${this._isGreen
          ? html`<cc-icon class="green" .icon=${greenIcon}></cc-icon>`
          : ``
        }
        <div class="tags">
          ${tags.map((tag) => html`<cc-badge>${tag}</cc-badge>`)}
        </div>  
      </div>
      ` : ''}
    `;
  }

  // DOCS: 9. "sub render" private methods used by the main render()

  static get styles () {
    return [
      skeletonStyles,
      // language=CSS
      css`
      :host {
        position: relative;
        display: flex;
        overflow: hidden;
        flex-direction: column;
        border: 2px solid var(--cc-color-border-neutral);
        border-radius: var(--cc-border-radius-default);
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
        width: max-content;
        padding: 1em 1em 0.75em;
      }

      .infra {
        color: var(--cc-color-text-weaker);
        font-size: 0.875em;
        line-height: 1.125;
        padding-inline-start: 0.125em;
      }

      .city {
        margin-top: 0.2em;
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
        padding: 0.75em 1.125em;
        background-color: var(--cc-color-bg-neutral);
        gap: 0.5em;
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

      .infra.skeleton {
        color: transparent;
      }

      .skeleton {
        background-color: #bbb;
      }

     `,
    ];
  }
}

// DOCS: 11. Define the custom element

window.customElements.define('cc-ct-zone-select', CcCtZoneSelect);
