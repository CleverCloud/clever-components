import { css, html } from 'lit';
import { CcFormControlElement } from '../../lib/form/cc-form-control-element.abstract.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
import { i18n } from '../../translations/translation.js';
import '../cc-zone-card/cc-zone-card.js';

import { ifDefined } from 'lit/directives/if-defined.js';
import { iconRemixEarthLine as zoneIcon } from '../../assets/cc-remix.icons.js';
import { dispatchCustomEvent } from '../../lib/events.js';

/**
 * @typedef {import('./cc-zone-picker.types.js').ZoneItem} ZoneItem
 * @typedef {import('./cc-zone-picker.types.js').ZoneSection} ZoneSection
 * @typedef {import('./cc-zone-picker.types.js').SingleZoneSection} SingleZoneSection
 * @typedef {import('./cc-zone-picker.types.js').ZonesSections} ZonesSections
 * @typedef {import('../../lib/events.types.js').EventWithTarget<HTMLInputElement>} HTMLInputElementEvent
 * @typedef {import('lit').PropertyValues} CcZonePickerPropertyValues
 */

/**
 * A component that allows you to select a zone from a list of zones sections.
 *
 * @cssdisplay block
 *
 * @fires {CustomEvent<string>} cc-zone-picker:input - Fires the zone code when a zone has been selected.
 */
export class CcZonePicker extends CcFormControlElement {
  static get properties() {
    return {
      ...super.properties,
      disabled: { type: Boolean },
      readonly: { type: Boolean },
      value: { type: String },
      zonesSections: { type: Array, attribute: 'zones-sections' },
    };
  }

  constructor() {
    super();

    /** @type {boolean} whether all the form controls should be disabled */
    this.disabled = false;

    /** @type {boolean} whether all the form controls should be readonly */
    this.readonly = false;

    /** @type {string} current selected zone code */
    this.value = null;

    /** @type {ZonesSections} array of zones sections */
    this.zonesSections = [];
  }

  /**
   * @param {CcZonePickerPropertyValues} changedProperties
   */
  willUpdate(changedProperties) {
    if (changedProperties.has('value') && this.value == null) {
      this.value = this.zonesSections?.[0]?.zones?.[0]?.code;
    }
  }

  // @ts-expect-error: We override this setter as the component doesn't handle error for now.
  set errorMessage(_) {}

  /**
   * @param {HTMLInputElementEvent} e
   */
  _onZoneSelect(e) {
    this.value = e.target.value;
    dispatchCustomEvent(this, 'cc-zone-picker:input', e.target.value);
  }

  render() {
    return html`
      <fieldset @change="${this._onZoneSelect}">
        <legend>
          <cc-icon class="zone-legend-icon" .icon="${zoneIcon}" size="lg"></cc-icon>
          <span class="zone-legend-text"> ${i18n('cc-zone-picker.legend')} </span>
        </legend>
        <div class="zone-section">
          ${this.zonesSections.map((zoneSection, index) => this._renderZoneSection(zoneSection, index))}
        </div>
      </fieldset>
    `;
  }

  /**
   * @param {ZoneSection|SingleZoneSection} zoneSection
   * @param {number} index
   */
  _renderZoneSection(zoneSection, index) {
    const hasZoneSectionHeaderTitle = zoneSection != null && 'title' in zoneSection;
    const zoneSectionHeaderId = hasZoneSectionHeaderTitle ? `section-header-${index}` : null;
    return html`
      ${hasZoneSectionHeaderTitle
        ? html` <div class="zone-section-title" id="${ifDefined(zoneSectionHeaderId)}">${zoneSection.title}</div> `
        : ''}
      <div class="form-controls">
        ${zoneSection.zones.map((zone) => this._renderZoneCard(zone, zone.code === this.value, zoneSectionHeaderId))}
      </div>
    `;
  }

  /**
   * @param {ZoneItem} zone
   * @param {boolean} isZoneSelected
   * @param {string} zoneSectionHeaderId
   */
  _renderZoneCard(zone, isZoneSelected, zoneSectionHeaderId) {
    const disabled = this.readonly ? !isZoneSelected : zone.disabled || this.disabled;
    return html`
      <input
        class="visually-hidden"
        type="radio"
        name="zone"
        .value="${zone.code}"
        ?disabled=${disabled}
        ?checked="${isZoneSelected}"
        id="${zone.code}"
        aria-describedby="${ifDefined(zoneSectionHeaderId)}"
      />
      <label for="${zone.code}">
        <cc-zone-card
          ?selected="${isZoneSelected}"
          ?disabled="${disabled}"
          name="${zone.name}"
          country="${zone.country}"
          code="${zone.code}"
          flag-url="${zone.flagUrl}"
          .images="${zone.images}"
        ></cc-zone-card>
      </label>
    `;
  }

  static get styles() {
    return [
      accessibilityStyles,
      // language=CSS
      css`
        :host {
          display: block;
          /* We have to use px value because we change font-size value and we need the same margin for every other elements */
          --fixed-margin: 34px;
        }

        legend {
          display: flex;
          gap: 0.25em;
        }

        .form-controls {
          display: grid;
          gap: 1em;
          grid-template-columns: repeat(auto-fill, minmax(12.5em, 1fr));
          margin-block-start: 0.5em;
          margin-inline-start: var(--fixed-margin);
        }

        .zone-legend-icon {
          --cc-icon-color: var(--cc-color-text-primary);

          align-self: center;
        }

        .zone-legend-text {
          color: var(--cc-color-text-primary-strongest);
          font-family: var(--cc-ff-form-legend), inherit;
          font-size: 1.625em;
          font-weight: 500;
        }

        .zone-section-title {
          color: var(--cc-color-text-primary-strongest);
          font-family: var(--cc-ff-form-legend), inherit;
          font-size: 1.15em;
          margin-block-start: 1em;
          margin-inline-start: var(--fixed-margin);
        }

        .form-controls + .zone-section-title {
          margin-block-start: 2em;
        }

        fieldset {
          border: none;
          margin: 0;
          padding: 0;
        }

        cc-zone-card {
          height: 100%;
        }

        input[type='radio']:focus-visible + label cc-zone-card {
          border-radius: var(--cc-border-radius-default, 0.25em);
          outline: var(--cc-focus-outline, #000 solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }
      `,
    ];
  }
}

window.customElements.define('cc-zone-picker', CcZonePicker);
