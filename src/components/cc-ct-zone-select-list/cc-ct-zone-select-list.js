import { css, html, LitElement } from 'lit';
import '../cc-icon/cc-icon.js';
import '../cc-img/cc-img.js';

import '../cc-badge/cc-badge.js';
import '../cc-ct-zone-select/cc-ct-zone-select.js';
import '../cc-notice/cc-notice.js';

const LOADING_NUMBER = 10;

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
 *
 * @fires {CustomEvent<any>} example-component:event-name - Fires XXX whenever YYY.
 *
 * @slot - The content of the button (text or HTML). If you want an image, please look at the `image` attribute.
 *
 * @cssprop {Color} --cc-loader-color - The color of the animated circle (defaults: `#2653af`).
 */
export class CcCtZoneSelectList extends LitElement {
  // DOCS: 1. LitElement's properties descriptor

  static get properties() {
    return {
      state: { type: Object },
      _isGreen: { type: Boolean },
    };
  }

  // DOCS: 2. Constructor

  constructor() {
    super();

    /** @type {ZoneListState} - state of the zone item */
    this.state = { type: 'loading' };
  }

  // DOCS: 3. Public methods

  // DOCS: 4. Private methods

  // DOCS: 5. Event handlers

  // DOCS: 6. Custom element lifecycle callbacks

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('cc-ct-zone-select:selected', this._onZoneSelected);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('cc-ct-zone-select:selected', this._onZoneSelected);
  }

  _onZoneSelected({ detail: { zone, selected } }) {
    console.log(zone, selected);
  }

  /**
   * @param {CcCtZoneSelectPropertyValues} changedProperties
   */
  willUpdate(changedProperties) {}

  render() {
    const loading = this.state.type === 'loading';
    const error = this.state.type === 'error';
    const data = this.state.type === 'loaded' ? this.state.zoneItems : new Array(LOADING_NUMBER);

    return html`
      ${error
        ? html` <cc-notice intent="warning" message="Something went wrong while loading zones"></cc-notice> `
        : ''}
      ${loading
        ? html`
            ${data
              .fill(LOADING_NUMBER)
              .map((_) => html` <cc-ct-zone-select .state=${{ type: 'loading' }}></cc-ct-zone-select> `)}
          `
        : ''}
      ${this.state.type === 'loaded'
        ? html`
            ${data.map(
              (zoneItem) => html`
                <cc-ct-zone-select
                  .state=${{ type: 'loaded', ...zoneItem }}
                  tabindex="${zoneItem.disabled ? '-1' : '0'}"
                ></cc-ct-zone-select>
              `,
            )}
          `
        : ''}
    `;
  }

  // DOCS: 9. "sub render" private methods used by the main render()

  static get styles() {
    return [
      // language=CSS
      css`
        :host {
          display: grid;
          gap: 1em;
          grid-template-columns: repeat(auto-fill, minmax(12.5em, 1fr));
        }
      `,
    ];
  }
}

// DOCS: 11. Define the custom element

window.customElements.define('cc-ct-zone-select-list', CcCtZoneSelectList);
