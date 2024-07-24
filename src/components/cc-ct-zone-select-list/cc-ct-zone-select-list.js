import { css, html, LitElement } from 'lit';
import '../cc-badge/cc-badge.js';
import '../cc-ct-zone-select/cc-ct-zone-select.js';
import '../cc-icon/cc-icon.js';
import '../cc-img/cc-img.js';
import '../cc-notice/cc-notice.js';

/**
 * @typedef {import('./cc-ct-zone-select-list.types.js').ZoneItem} ZoneItem
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
 * @fires {CustomEvent<any>} example-component:event-name - Fires XXX whenever YYY.
 */
export class CcCtZoneSelectList extends LitElement {
  static get properties() {
    return { zones: { type: Array } };
  }

  constructor() {
    super();

    /** @type {Array<ZoneItem>} */
    this.zones = [];
  }

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

  render() {
    return html`
      <fieldset>
        <legend>Zone</legend>
        ${this.zones.map(
          (zone) => html`
            <div>
              <input type="radio" name="zone" id="${zone.code}" />
              <cc-ct-zone-select
                name="${zone.name}"
                code="${zone.code}"
                flagUrl="${zone.flagUrl}"
                .images="${zone.images}"
              ></cc-ct-zone-select>
            </div>
            <label for="${zone.code}">${zone.code}</label>
          `,
        )}
      </fieldset>
    `;
  }

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

window.customElements.define('cc-ct-zone-select-list', CcCtZoneSelectList);
