import { css, html } from 'lit';
import { CcFormControlElement } from '../../lib/form/cc-form-control-element.abstract.js';
import { i18n } from '../../lib/i18n.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
import '../cc-badge/cc-badge.js';
import '../cc-ct-zone-select/cc-ct-zone-select.js';
import '../cc-icon/cc-icon.js';
import '../cc-img/cc-img.js';
import '../cc-notice/cc-notice.js';

import { iconRemixEarthLine as zoneIcon } from '../../assets/cc-remix.icons.js';

/**
 * @typedef {import('./cc-ct-zone-select-list.types.js').ZoneItem} ZoneItem
 */

/**
 * A Form Associated Custom Element component displaying zones and allowing to choose one.
 *
 * @cssdisplay block
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

    /** @type {Array<ZoneItem>} array of zones */
    this.zones = [];

    /** @type {String} current selected zone code */
    this.value = null;
  }

  _onZoneSelect(e) {
    this.value = e.target.value;
  }

  render() {
    return html`
      <form>
        <fieldset @change="${this._onZoneSelect}">
          <legend>
            <cc-icon class="zone-legend-icon" .icon="${zoneIcon}" size="lg"></cc-icon>
            <span class="zone-legend-text"> ${i18n('cc-ct-zone-select.legend')} </span>
          </legend>
          <div class="form-controls">${this.zones.map((zone) => this._renderZone(zone, this.value))}</div>
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

        legend {
          display: flex;
          gap: 0.25em;
        }

        .form-controls {
          display: grid;
          gap: 1em;
          grid-template-columns: repeat(auto-fill, minmax(12.5em, 1fr));
          margin: 1em 2em;
        }

        .zone-legend-icon {
          --cc-icon-color: var(--cc-color-text-primary);

          align-self: center;
        }

        .zone-legend-text {
          --ct-form-label-font-family: 'Source Sans 3';
          --ct-form-label-font-size: 1.625em;
          --ct-form-label-font-weight: 500;
          --ct-form-input-font-size: 1.25em;

          color: var(--cc-color-text-primary-strongest);
          font-family: var(--ct-form-label-font-family), sans-serif;
          font-size: var(--ct-form-label-font-size);
          font-weight: var(--ct-form-label-font-weight);
        }

        fieldset {
          border: none;
          margin: 0;
          padding: 0;
        }

        cc-ct-zone-select {
          height: 100%;
        }

        input[type='radio']:focus + label {
          outline: var(--cc-focus-outline, #000 solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }
      `,
    ];
  }
}

window.customElements.define('cc-ct-zone-select-list', CcCtZoneSelectList);
