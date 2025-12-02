import { css, html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { iconRemixEarthLine as zoneIcon } from '../../assets/cc-remix.icons.js';
import { CcFormControlElement } from '../../lib/form/cc-form-control-element.abstract.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
import { i18n } from '../../translations/translation.js';
import '../cc-icon/cc-icon.js';
import '../cc-img/cc-img.js';
import '../cc-picker-option/cc-picker-option.js';
import { CcSelectEvent } from '../common.events.js';

/**
 * @import { ZoneItem, ZoneSection, SingleZoneSection, ZonesSections } from './cc-zone-picker.types.js'
 * @import { PropertyValues as CcZonePickerPropertyValues, TemplateResult } from 'lit'
 * @import { EventWithTarget } from '../../lib/events.types.js'
 */

/**
 * A component that allows you to select a zone from a list of zones sections.
 *
 * @cssdisplay block
 *
 * @cssprop {Size} --cc-form-controls-indent - The horizontal space between the start of the line and the form control without the label (defaults: `34px`).
 * @cssprop {Size} --cc-form-label-gap - The space between the label and the control (defaults: `0.35em`).
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
   * @param {EventWithTarget<HTMLInputElement>} e
   */
  _onZoneSelect(e) {
    if (this.readonly) {
      return;
    }

    this.value = e.target.value;
    this.dispatchEvent(new CcSelectEvent(this.value));
  }

  render() {
    return html`
      <fieldset @input="${this._onZoneSelect}">
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
   * @returns {TemplateResult}
   * @private
   */
  _renderZoneCard(zone, isZoneSelected, zoneSectionHeaderId) {
    const { code } = zone;
    const disabled = zone.disabled || this.disabled;
    const readonly = !disabled && this.readonly;
    return html`
      <input
        class="visually-hidden"
        type="radio"
        name="zone"
        .value="${code}"
        ?disabled=${disabled || (readonly && !isZoneSelected)}
        .checked="${isZoneSelected}"
        id="${code}"
        aria-describedby="${ifDefined(zoneSectionHeaderId)}"
      />
      <label for="${code}" class="option-wrapper">
        <cc-picker-option ?selected="${isZoneSelected}" ?readonly="${readonly}" ?disabled="${disabled}">
          ${this._renderZoneBody(zone)} ${this._renderZoneFooter(zone)}
        </cc-picker-option>
      </label>
    `;
  }

  /**
   * @param {ZoneItem} zone
   * @returns {TemplateResult}
   * @private
   */
  _renderZoneBody({ code, name }) {
    return html`
      <div slot="body">
        <div class="option-body--code">${code}</div>
        <div class="option-body--name">${name}</div>
      </div>
    `;
  }

  /**
   * @param {ZoneItem} zone
   * @returns {TemplateResult}
   * @private
   */
  _renderZoneFooter({ country, countryCode, flagUrl, images }) {
    return html`
      <div slot="footer">
        ${flagUrl
          ? html`
              <cc-img
                src=${flagUrl}
                a11y-name="${i18n('cc-zone-picker.alt.country-name', {
                  code: countryCode,
                  name: country,
                })}"
              ></cc-img>
            `
          : ''}
        ${images.map((image) => html`<cc-img src="${image.url}" a11y-name="${image.alt}"></cc-img>`)}
      </div>
    `;
  }

  static get styles() {
    return [
      accessibilityStyles,
      // language=CSS
      css`
        /* region global */
        :host {
          display: block;
        }

        fieldset {
          border: none;
          margin: 0;
          padding: 0;
        }
        /* endregion */

        /* region legend layout & style */
        legend {
          display: flex;
          gap: 0.25em;
          margin-block-end: var(--cc-form-label-gap, 0.35em);
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
        /* endregion */

        /* region global layout */
        .form-controls {
          display: grid;
          gap: 1em;
          grid-template-columns: repeat(auto-fill, minmax(12.5em, 1fr));
          margin-inline-start: var(--cc-form-controls-indent, 34px);
        }
        /* endregion */

        /* region zone section title */
        .zone-section-title {
          color: var(--cc-color-text-primary-strongest);
          font-family: var(--cc-ff-form-legend), inherit;
          font-size: 1.15em;
          margin-block-end: 0.25em;
          margin-inline-start: var(--cc-form-controls-indent, 34px);
        }

        .form-controls + .zone-section-title {
          margin-block-start: 1em;
        }
        /* endregion */

        /* region cc-picker-option */
        input[type='radio']:focus-visible + label cc-picker-option {
          border-radius: var(--cc-border-radius-default, 0.25em);
          outline: var(--cc-focus-outline, #000 solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        .option-wrapper {
          display: inline-flex;
        }

        .option-wrapper cc-picker-option {
          flex: 1 1 auto;
        }

        cc-picker-option [slot='body'] {
          margin-inline: -0.25em;
        }

        cc-picker-option .option-body--code {
          color: var(--cc-color-text-weak);
          font-size: 0.875em;
          line-height: 1.125;
          padding-inline-start: 0.125em;
        }

        cc-picker-option .option-body--name {
          font-size: 1.5em;
          line-height: 1.125;
        }

        cc-picker-option [slot='footer'] {
          column-gap: 0.5em;
          display: flex;
          padding-block: 0.75em;
        }

        cc-picker-option [slot='footer'] > cc-img {
          --cc-img-fit: contain;

          height: 1.5rem;
          width: 1.5rem;
        }

        cc-picker-option[disabled] [slot='footer'] cc-icon,
        cc-picker-option[disabled] [slot='footer'] cc-img {
          filter: grayscale(1);
          opacity: var(--cc-opacity-when-disabled, 0.65);
        }
        /* endregion */
      `,
    ];
  }
}

window.customElements.define('cc-zone-picker', CcZonePicker);
