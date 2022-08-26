import '../cc-flex-gap/cc-flex-gap.js';
import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { dispatchCustomEvent } from '../../lib/events.js';
import { i18n } from '../../lib/i18n.js';
import '@shoelace-style/shoelace/dist/components/select/select.js';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';
import { sortZones } from '../../lib/zone.js';
import { shoelaceStyles } from '../../styles/shoelace.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import { CcZone } from '../cc-zone/cc-zone.js';

/** @type {Currency[]} */
const SKELETON_CURRENCIES = [];
/** @type {Zone[]} */
const SKELETON_ZONES = [];

/** @type {Currency} */
const CURRENCY_EUR = { code: 'EUR', changeRate: 1 };

/**
 * @typedef {import('./cc-pricing-header.types.js').Currency} Currency
 * @typedef {import('./cc-pricing-header.types.js').Plan} Plan
 * @typedef {import('../common.types.js').Zone} Zone
 */

/**
 * A component that displays a total price and allows the selection of a currency and a zone.
 *
 * @cssdisplay block
 *
 * @event {CustomEvent<Currency>} cc-pricing-header:change-currency - Fires the `currency` whenever the currency selection changes.
 * @event {CustomEvent<string>} cc-pricing-header:change-zone - Fires the `zoneId` (zone name) whenever the zone selection changes.
 */
export class CcPricingHeader extends LitElement {

  static get properties () {
    return {
      currencies: { type: Array },
      currency: { type: Object },
      totalPrice: { type: Number, attribute: 'total-price' },
      zoneId: { type: String, attribute: 'zone-id' },
      zones: { type: Array },
      _sortedZones: { type: Array },
    };
  }

  constructor () {
    super();

    /** @type {Currency[]|null} Sets the list of currencies available for selection. */
    this.currencies = null;

    /** @type {Currency}  Sets the current selected currency. */
    this.currency = CURRENCY_EUR;

    /** @type {number} Sets total price to display. */
    this.totalPrice = 0;

    /** @type {string|null} Sets the current selected zone by its ID/name. */
    this.zoneId = null;

    /** @type {Zone[]|null} Sets the list of zones available for selection. */
    this.zones = null;

    /** @type {Zone[]|null} */
    this._sortedZones = null;
  }

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

  _onCurrencyChange (e) {
    const currency = this.currencies.find((c) => c.code === e.target.value);
    dispatchCustomEvent(this, 'change-currency', currency);
  }

  _onZoneChange (e) {
    const zoneName = e.target.value;
    dispatchCustomEvent(this, 'change-zone', zoneName);
  }

  update (changedProperties) {
    if (changedProperties.has('zones')) {
      this._sortedZones = sortZones(this.zones);
    }
    super.update(changedProperties);
  }

  render () {

    const currenciesSkeleton = (this.currencies == null);
    const currencies = currenciesSkeleton ? SKELETON_CURRENCIES : this.currencies;

    const zonesSkeleton = (this._sortedZones == null);
    const zones = zonesSkeleton ? SKELETON_ZONES : this._sortedZones;

    return html`
      <cc-flex-gap class="main">

        <sl-select
          class="currency-select ${classMap({ skeleton: currenciesSkeleton })}"
          label=${i18n('cc-pricing-header.currency-text')}
          value=${this.currency?.code}
          ?disabled=${currenciesSkeleton}
          @sl-change=${this._onCurrencyChange}
        >
          ${currencies.map((c) => html`
            <sl-menu-item value=${c.code}>${this._getCurrencySymbol(c.code)} ${c.code}</sl-menu-item>
          `)}
        </sl-select>

        <sl-select
          class="zone-select ${classMap({ skeleton: zonesSkeleton })}"
          label=${i18n('cc-pricing-header.selected-zone')}
          value=${ifDefined(this.zoneId ?? undefined)}
          ?disabled=${zonesSkeleton}
          @sl-change=${this._onZoneChange}
        >
          ${zones.map((zone) => html`
            <sl-menu-item class="zone-item" value=${zone.name}>
              ${CcZone.getText(zone)}
              <cc-zone slot="prefix" .zone=${zone}></cc-zone>
            </sl-menu-item>
          `)}
        </sl-select>

        <div class="estimated-cost">
          <div class="estimated-cost--label">${i18n('cc-pricing-header.est-cost')}</div>
          <div class="estimated-cost--value">
            <span class="total-price">
              ${i18n('cc-pricing-header.price', {
                price: this.totalPrice * this.currency.changeRate,
                code: this.currency.code,
              })}
            </span>
          </div>
        </div>

      </cc-flex-gap>
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
          --cc-gap: 1em;
          --sl-input-height-medium: 2.5em;
        }

        sl-select {
          --focus-ring: 0 0 0 .2em rgba(50, 115, 220, .25);
          --sl-input-background-color: var(--cc-color-bg-default, #fff);
          --sl-input-background-color-disabled: var(--cc-color-bg-neutral-disabled, #eee);
          --sl-input-background-color-hover: var(--cc-color-bg-default, #fff);
          --sl-input-background-color-focus: var(--cc-color-bg-default, #fff);
          --sl-input-border-color-disabled: #eee;
          --sl-input-border-color-focus: var(--cc-color-bg-neutral-hovered, #777);
          --sl-input-border-color-hover: var(--cc-color-bg-neutral-hovered, #777);
          --sl-input-border-color: #aaa;
          --sl-input-border-radius-medium: 0.25em;
          --sl-input-color-focus: var(--cc-color-text-default, #000);
          --sl-input-color-hover: var(--cc-color-text-default, #000);
          --sl-input-color: var(--cc-color-text-default, #000);
          animation: none;
        }

        sl-select::part(label),
        .estimated-cost--label {
          /* same value as out own inputs */
          padding-bottom: 0.35em;
        }

        sl-select::part(menu) {
          background-color: var(--cc-color-bg-default, #fff);
          color: var(--cc-color-text-default);
        }

        sl-menu-item::part(base) {
          color: var(--cc-color-text-default);
        }

        .currency-select {
          flex: 1 1 0;
          min-width: 10em;
        }

        .zone-select {
          flex: 2 1 25em;
        }

        .zone-item {
          margin: 0;
        }

        /* The label is not used in the list display
        It's only used for the current selected value */
        .zone-item::part(label) {
          display: none;
        }

        /* Expand the cc-zone to the whole width */
        .zone-item::part(prefix) {
          display: block;
          flex: 1 1 0;
        }

        .zone-item:hover::part(base),
        .zone-item:focus::part(base) {
          --cc-zone-subtitle-color: var(--cc-color-text-inverted, #fff);
          --cc-zone-tag-bdcolor: var(--cc-color-text-inverted, #fff);
          --cc-zone-tag-bgcolor: transparent;
          color: var(--cc-color-text-inverted, #fff);
        }

        cc-zone {
          margin: 0.25em 0 0.25em 0.5em;
        }

        .estimated-cost--value {
          font-weight: bold;
          height: var(--sl-input-height-medium);
          line-height: var(--sl-input-height-medium);
        }

        .total-price {
          font-size: 1.5em;
        }

        sl-select.skeleton::part(base) {
          --sl-input-background-color-disabled: var(--cc-color-bg-neutral-disabled, #bbb);
        }
      `,
    ];
  }
}

window.customElements.define('cc-pricing-header', CcPricingHeader);
