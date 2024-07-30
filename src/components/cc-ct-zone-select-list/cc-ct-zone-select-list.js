import { css, html } from 'lit';
import { createRef } from 'lit/directives/ref.js';
import { CcFormControlElement } from '../../lib/form/cc-form-control-element.abstract.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
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
export class CcCtZoneSelectList extends CcFormControlElement {
  static get properties() {
    return {
      ...super.properties,
      value: { type: String },
      zones: { type: Array },
    };
  }

  constructor() {
    super();

    /** @type {Array<ZoneItem>} */
    this.zones = [];

    this.value = null;

    this._formRef = createRef();
  }

  _onZoneSelect(e) {
    console.log(e.target);
    this.value = e.target.value;
  }

  render() {
    return html`
      <form>
        <fieldset @change="${(e) => this._onZoneSelect(e)}">
          <legend>Zone</legend>
          ${this.zones.map((zone) => this._renderZone(zone, this.value))}
        </fieldset>
      </form>
    `;
  }

  /**
   * @param {ZoneItem} zone
   * @param {string} selectedZoneCode
   */
  _renderZone(zone, selectedZoneCode) {
    const isSelected = zone.code === selectedZoneCode;
    return html`
      <div>
        <input
          class="visually-hidden"
          type="radio"
          name="zone"
          .value="${zone.code}"
          ?disabled=${zone.disabled}
          ?checked="${isSelected}"
          id="${zone.code}"
        />
        <label for="${zone.code}">
          <cc-ct-zone-select
            ?selected="${isSelected}"
            ?disabled="${zone.disabled}"
            name="${zone.name}"
            country="${zone.country}"
            code="${zone.code}"
            flagUrl="${zone.flagUrl}"
            .images="${zone.images}"
            .tags="${zone.tags}"
          ></cc-ct-zone-select>
        </label>
      </div>
    `;
  }

  static get styles() {
    return [
      accessibilityStyles,
      // language=CSS
      css`
        :host {
          display: block;
        }

        input[type='radio']:focus + cc-ct-zone-select {
          outline: var(--cc-focus-outline, #000 solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        fieldset {
          border: none;
          display: grid;
          gap: 1em;
          grid-template-columns: repeat(auto-fill, minmax(12.5em, 1fr));
        }
      `,
    ];
  }
}

window.customElements.define('cc-ct-zone-select-list', CcCtZoneSelectList);
