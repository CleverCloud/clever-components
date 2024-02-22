import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { iconRemixArrowDownSLine as iconArrowDown } from '../../assets/cc-remix.icons.js';
import { dispatchCustomEvent } from '../../lib/events.js';
import { i18n } from '../../lib/i18n.js';
import '@shoelace-style/shoelace/dist/components/select/select.js';
import '@shoelace-style/shoelace/dist/components/option/option.js';
import { getCurrencySymbol } from '../../lib/utils.js';
import { sortZones } from '../../lib/zone.js';
import { shoelaceStyles } from '../../styles/shoelace.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import { CcZone } from '../cc-zone/cc-zone.js';
import '../cc-icon/cc-icon.js';
import '../cc-notice/cc-notice.js';

/** @type {Zone[]} */
const SKELETON_ZONES = [];

/** @type {Currency} */
// FIXME: this code is duplicated across all pricing components (see issue #732 for more details)
const DEFAULT_CURRENCY = { code: 'EUR', changeRate: 1 };

/** @type {Temporality} */
// FIXME: this code is duplicated across all pricing components (see issue #732 for more details)
const DEFAULT_TEMPORALITY = { type: '30-days', digits: 2 };

/**
 * @typedef {import('../common.types.js').Currency} Currency
 * @typedef {import('../common.types.js').Temporality} Temporality
 * @typedef {import('./cc-pricing-header.types.js').PricingZoneState} PricingZoneState
 */

/**
 * A component that allows the selection of a temporality, a currency and a zone.
 *
 * @cssdisplay block
 *
 * @fires {CustomEvent<Currency>} cc-pricing-header:change-currency - Fires the `currency` whenever the currency selection changes.
 * @fires {CustomEvent<Temporality>} cc-pricing-header:change-temporality - Fires the `temporality` whenever the temporality selection changes.
 * @fires {CustomEvent<string>} cc-pricing-header:change-zone - Fires the `zoneId` (zone name) whenever the zone selection changes.
 *
 * @cssprop {Color} --cc-pricing-hovered-color - Sets the text color used on hover (defaults: `purple`).
 */
export class CcPricingHeader extends LitElement {

  static get properties () {
    return {
      currencies: { type: Array },
      selectedCurrency: { type: Object, attribute: 'selected-currency' },
      selectedTemporality: { type: Object, attribute: 'selected-temporality' },
      selectedZoneId: { type: String, attribute: 'selected-zone-id' },
      temporalities: { type: Array },
      zones: { type: Object },
    };
  }

  constructor () {
    super();

    /** @type {Currency[]} Sets the list of currencies available for selection. */
    this.currencies = [DEFAULT_CURRENCY];

    /** @type {Currency}  Sets the current selected currency. */
    this.selectedCurrency = DEFAULT_CURRENCY;

    /** @type {Temporality} Sets the current selected temporality. */
    this.selectedTemporality = DEFAULT_TEMPORALITY;

    /** @type {string|null} Sets the current selected zone by its ID/name. */
    this.selectedZoneId = null;

    /** @type {Temporality[]} Sets the list available temporalities. */
    this.temporalities = [DEFAULT_TEMPORALITY];

    /** @type {PricingZoneState} Sets the list of zones available for selection. */
    this.zones = { state: 'loading' };
  }

  /**
   * Returns the currency symbol corresponding to the given currency.
   *
   * @param {Currency} currency - the currency to get the symbol for
   */
  _getCurrencySymbol (currency) {
    // The lang does not really matter
    const nf = new Intl.NumberFormat('en', { style: 'currency', currency });
    return nf
      .formatToParts(0)
      .find((p) => p.type === 'currency')
      .value
      // Safari does not support currencySymbol: 'narrow' in Intl.NumberFormat so we need to do this #sorry
      .replace('$US', '$');
  }

  /**
   * Returns the localized string corresponding to a given temporality type.
   *
   * @param {Temporality['type']} type - the temporality type
   * @return {string} the localized string corresponding to the given temporality type
   */
  _getPriceLabel (type) {
    if (type === 'second') {
      return i18n('cc-pricing-header.price-name.second');
    }
    if (type === 'minute') {
      return i18n('cc-pricing-header.price-name.minute');
    }
    if (type === 'hour') {
      return i18n('cc-pricing-header.price-name.hour');
    }
    if (type === '1000-minutes') {
      return i18n('cc-pricing-header.price-name.1000-minutes');
    }
    if (type === 'day') {
      return i18n('cc-pricing-header.price-name.day');
    }
    if (type === '30-days') {
      return i18n('cc-pricing-header.price-name.30-days');
    }
  }

  /**
   * Retrieves the currency corresponding to the selected currency code.
   * Dispatches a `cc-pricing-header:change-currency` event with the currency as its payload.
   *
   * @param {Event} e - the event that called this method
   */
  _onCurrencyChange (e) {
    const currency = this.currencies.find((c) => c.code === e.target.value);
    dispatchCustomEvent(this, 'change-currency', currency);
  }

  /**
   * Retrieves the temporality corresponding to the selected temporality type.
   * Dispatches a `cc-pricing-header:change-temporality` event with the temporality as its payload.
   *
   * @param {Event} e - the event that called this method
   */
  _onTemporalityChange (e) {
    const temporality = this.temporalities.find((t) => t.type === e.target.value);
    dispatchCustomEvent(this, 'change-temporality', temporality);
  }

  /**
   * Retrieves the zone id from the event payload.
   * Dispatches a `cc-pricing-header:change-zone` event with the zone id as its payload.
   *
   * @param {Event} e - the event that called this method
   */
  _onZoneChange (e) {
    const zoneId = e.target.value;
    dispatchCustomEvent(this, 'change-zone', zoneId);
  }

  render () {
    const zones = this.zones.state === 'loading' ? SKELETON_ZONES : sortZones(this.zones.value);

    if (this.zones.state === 'error') {
      return html`<cc-notice intent="warning" message="${i18n('cc-pricing-header.error')}"></cc-notice>`;
    }

    return html`
      <div class="main">

        <sl-select
          label="${i18n('cc-pricing-header.label.temporality')}"
          class="temporality-select"
          value=${this.selectedTemporality.type}
          @sl-change=${this._onTemporalityChange}
        >
          ${this.temporalities.map((t) => html`
            <sl-option value=${t.type}>${this._getPriceLabel(t.type)}</sl-option>
          `)}
          <cc-icon slot="expand-icon" .icon=${iconArrowDown}></cc-icon>
        </sl-select>
        
        <sl-select
          label="${i18n('cc-pricing-header.label.currency')}"
          class="currency-select"
          value=${this.selectedCurrency?.code}
          @sl-change=${this._onCurrencyChange}
        >
          ${this.currencies.map((c) => html`
            <sl-option value=${c.code}>${getCurrencySymbol(c.code)} ${c.code}</sl-option>
          `)}
          <cc-icon slot="expand-icon" .icon=${iconArrowDown}></cc-icon>
        </sl-select>

        <sl-select
          label="${i18n('cc-pricing-header.label.zone')}"
          class="zone-select ${classMap({ skeleton: this.zones.state === 'loading' })}"
          hoist
          value=${ifDefined(this.selectedZoneId ?? undefined)}
          ?disabled=${this.zones.state === 'loading'}
          @sl-change=${this._onZoneChange}
        >
          ${zones.map((zone) => html`
            <sl-option class="zone-item" value=${zone.name}>
              ${CcZone.getText(zone)}
              <cc-zone slot="prefix" .zone=${zone}></cc-zone>
            </sl-option>
          `)}
          <cc-icon slot="expand-icon" .icon=${iconArrowDown}></cc-icon>
        </sl-select>
      </div>
    `;
  }

  static get styles () {
    return [
      shoelaceStyles,
      skeletonStyles,
      // language=CSS
      css`
        :host {
          display: block;
        }

        .main {
          display: flex;
          flex-wrap: wrap;
          gap: 1em;
        }

        sl-select {
          --cc-icon-size: 1.4em;
          --sl-input-background-color: var(--cc-color-bg-default, #fff);
          --sl-input-background-color-disabled: var(--cc-color-bg-neutral-disabled, #eee);
          --sl-input-background-color-hover: var(--cc-color-bg-default, #fff);
          --sl-input-background-color-focus: var(--cc-color-bg-default, #fff);
          --sl-input-border-color: var(--cc-color-border-neutral-weak, #aaa);
          --sl-input-border-color-disabled: var(--cc-color-border-disabled, #eee);
          --sl-input-border-color-focus: var(--cc-color-border-focused, #777);
          --sl-input-border-radius-medium: var(--cc-border-radius-default, 0.25em);
          --sl-input-color: var(--cc-color-text-default, #000);
          --sl-input-color-hover: var(--cc-pricing-hovered-color, #000);
          --sl-input-font-family: initial;
          --sl-input-height-medium: 2.865em;
          --sl-input-label-color: var(--cc-color-text-default, #000);

          flex: 1 1 10.5em;
          animation: none;
        }

        sl-select::part(form-control-input):focus-within {
          outline: var(--cc-focus-outline, #000);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        sl-select::part(form-control-label) {
          /* same value as out own inputs */
          padding-bottom: 0.35em;
        }

        sl-select::part(display-input) {
          font-family: inherit;
          font-weight: bold;
        }
        
        sl-select::part(combobox) {
          padding: 0.75rem 0.875rem;
        }

        sl-select::part(combobox):hover {
          --cc-icon-color: var(--cc-pricing-hovered-color);

          border: 1px solid var(--cc-color-border-hovered, #777);
        }

        sl-option::part(base) {
          background-color: transparent;
          color: var(--cc-color-text-default, #000);
        }

        sl-option::part(base):hover,
        sl-option:focus-within {
          background-color: var(--cc-color-bg-neutral-hovered, #eee);
        }
        
        sl-option::part(checked-icon) {
          width: 0.7em;
          height: 0.7em;
          margin-right: 0.5em;
        }

        /* region Zone select */

        sl-select.skeleton::part(base) {
          --sl-input-background-color-disabled: var(--cc-color-bg-neutral-disabled, #bbb);
        }
        
        .zone-select {
          flex: 2 1 auto;
        }
        
        /* The label is not used in the list display
        It's only used for the current selected value */

        sl-option.zone-item::part(label) {
          display: none;
        }

        /* Expand the cc-zone to the whole width */

        sl-option.zone-item::part(prefix) {
          display: block;
          flex: 1 1 0;
        }

        sl-option.zone-item::part(base) {
          --cc-zone-tag-category-font-weight: 600;
          --cc-zone-tag-padding: 0;
          --cc-zone-tag-bgcolor: transparent;
          --cc-zone-tag-textcolor: var(--cc-color-text-weak, #333);

          padding: 1em 0.5em;
          border-bottom: solid 1px var(--cc-color-border-neutral-weak, transparent);
        }
        
        sl-option.zone-item::part(checked-icon) {
          align-self: flex-start;
          margin-top: 0.3em;
        }
        /* endregion */
      `,
    ];
  }
}

window.customElements.define('cc-pricing-header', CcPricingHeader);
