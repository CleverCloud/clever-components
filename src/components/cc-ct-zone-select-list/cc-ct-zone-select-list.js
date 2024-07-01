
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
import '../cc-badge/cc-badge';
import '../cc-notice/cc-notice';
import '../cc-ct-zone-select/cc-ct-zone-select.js';

// DOCS: You may setup/init some stuffs here but this should be rare and most of the setup should happen in the component.
const MY_AWESOME_CONST = 'foobar';

// DOCS: You may setup/init constant data used when component is in skeleton state.
const SKELETON_FOOBAR = [
  { foo: '???????' },
  { foo: '????' },
  { foo: '???????' },
];

const LOADING_NUMBER = 10;

/** @type {ZoneItem} */
const LOADING_INFO = {
  name: '???',
  city: '?????',
  countryCode: 'FR',
  infra: null,
};

/**
 * @typedef {import('./cc-ct-zone-select-list.types.js').ZoneListState} ZoneListState
 * @typedef {import('./cc-ct-zone-select-list.types.js').ZoneListStateLoaded} ZoneListStateLoaded
 * @typedef {import('./cc-ct-zone-select-list.types.js').ZoneListStateLoading} ZoneListStateLoading
 * @typedef {import('./cc-ct-zone-select-list.types.js').ZoneListStateError} ZoneListStateError
 * @typedef {import('lit').PropertyValues<CcCtZoneSelectList>} CcCtZoneSelectPropertyValues
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
export class CcCtZoneSelectList extends LitElement {

  // DOCS: 1. LitElement's properties descriptor

  static get properties () {
    return {
      state: { type: Object },
      _isGreen: { type: Boolean },
    };
  }

  // DOCS: 2. Constructor

  constructor () {
    super();

    /** @type {ZoneListState} - state of the zone item */
    this.state = { type: 'loading' };

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
  }

  render () {

    const loading = this.state.type === 'loading';
    const error = this.state.type === 'error';
    const data = this.state.type === 'loaded' ? this.state.zoneItems : new Array(LOADING_NUMBER);

    return html`
      
      ${error ? html`
        <cc-notice intent="warning" message="Something went wrong while loading zones"></cc-notice>
      ` : ''}

      ${loading ? html` 
      ${data.fill(LOADING_NUMBER).map((_) => html` 
      <cc-ct-zone-select .state=${{ type: 'loading' }}></cc-ct-zone-select>
      `)}
      ` : ''}


      ${this.state.type === 'loaded' ? html` 
      ${data.map((zoneItem) => html` 
       <cc-ct-zone-select .state=${{ type: 'loaded', ...zoneItem }}></cc-ct-zone-select>
      `)}
           ` : ''}
    `;
  }

  // DOCS: 9. "sub render" private methods used by the main render()

  static get styles () {
    return [
      // language=CSS
      css`
    :host {
      display: grid;
      gap: 0.5em;
      grid-template-columns: repeat(auto-fit, minmax(20em, 1fr));
    }

    cc-ct-zone-select {
      --width: 10em;
    }
     `,
    ];
  }
}

// DOCS: 11. Define the custom element

window.customElements.define('cc-ct-zone-select-list', CcCtZoneSelectList);
