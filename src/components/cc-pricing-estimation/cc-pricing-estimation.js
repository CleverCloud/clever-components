import '@shoelace-style/shoelace/dist/components/option/option.js';
import '@shoelace-style/shoelace/dist/components/select/select.js';
import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import {
  iconRemixAddLine as iconAdd,
  iconRemixArrowDownSLine as iconArrowDown,
  iconRemixDeleteBin_4Line as iconBin,
  iconRemixSubtractLine as iconSubtract,
} from '../../assets/cc-remix.icons.js';
import { LostFocusController } from '../../controllers/lost-focus-controller.js';
import { dispatchCustomEvent } from '../../lib/events.js';
import { PricingConsumptionSimulator } from '../../lib/pricing.js';
import { getCurrencySymbol } from '../../lib/utils.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
import { shoelaceStyles } from '../../styles/shoelace.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import { i18n } from '../../translations/translation.js';
import '../cc-badge/cc-badge.js';
import '../cc-icon/cc-icon.js';
import '../cc-notice/cc-notice.js';

/** @type {Record<FormattedFeature['code'], () => string|Node>} */
const FEATURES_I18N = {
  'connection-limit': () => i18n('cc-pricing-estimation.feature.connection-limit'),
  cpu: () => i18n('cc-pricing-estimation.feature.cpu'),
  databases: () => i18n('cc-pricing-estimation.feature.databases'),
  dedicated: () => i18n('cc-pricing-estimation.feature.dedicated'),
  'disk-size': () => i18n('cc-pricing-estimation.feature.disk-size'),
  gpu: () => i18n('cc-pricing-estimation.feature.gpu'),
  'has-logs': () => i18n('cc-pricing-estimation.feature.has-logs'),
  'has-metrics': () => i18n('cc-pricing-estimation.feature.has-metrics'),
  'is-migratable': () => i18n('cc-pricing-estimation.feature.is-migratable'),
  'max-db-size': () => i18n('cc-pricing-estimation.feature.max-db-size'),
  memory: () => i18n('cc-pricing-estimation.feature.memory'),
  version: () => i18n('cc-pricing-estimation.feature.version'),
};
const AVAILABLE_FEATURES = Object.keys(FEATURES_I18N);
const THIRTY_DAYS_IN_HOURS = 24 * 30;

// FIXME: this code is duplicated across all pricing components (see issue #732 for more details)
const DEFAULT_CURRENCY = 'EUR';

/** @type {Temporality} */
// FIXME: this code is duplicated across all pricing components (see issue #732 for more details)
const DEFAULT_TEMPORALITY = { type: '30-days', digits: 2 };

/**
 * @typedef {import('./cc-pricing-estimation.types.js').PricingEstimationState} PricingStateEstimation
 * @typedef {import('./cc-pricing-estimation.types.js').RuntimePlanWithQuantity} RuntimePlanWithQuantity
 * @typedef {import('./cc-pricing-estimation.types.js').CountablePlanWithQuantity} CountablePlanWithQuantity
 * @typedef {import('../common.types.js').PricingSection} PricingSection
 * @typedef {import('../common.types.js').FormattedFeature} FormattedFeature
 * @typedef {import('../common.types.js').Temporality} Temporality
 * @typedef {import('@shoelace-style/shoelace').SlSelect} SlSelect
 * @typedef {import('../../lib/events.types.js').EventWithTarget<SlSelect>} SlSelectEvent
 * @typedef {import('lit/directives/ref.js').Ref<HTMLParagraphElement>} HTMLParagraphElementRef
 * @typedef {import('lit').PropertyValues<CcPricingEstimation>} CcPricingEstimationPropertyValues
 */

/**
 * A component to display a list of selected product plans with the ability to change their quantity or remove them from the list.
 *
 * WARNING:
 *
 * All products added to the estimation must be part of the Clever Cloud Price System (see `/v4/billing/price-system?zone_id&currency`).
 * Custom products cannot be added to the estimation because the `cc-pricing-estimation` cannot determine their price based on the selected currency.
 *
 * @cssdisplay block
 *
 * @fires {CustomEvent<RuntimePlanWithQuantity|CountablePlanWithQuantity>} cc-pricing-estimation:change-quantity - Fires the plan with a modified quantity whenever the quantity on the input changes.
 * @fires {CustomEvent<string>} cc-pricing-estimation:change-currency - Fires the `currency` whenever the currency selection changes.
 * @fires {CustomEvent<Temporality>} cc-pricing-estimation:change-temporality - Fires the `temporality` whenever the temporality selection changes.
 * @fires {CustomEvent<RuntimePlanWithQuantity|CountablePlanWithQuantity>} cc-pricing-estimation:delete-plan - Fires the plan whenever a delete button is clicked or when the quantity reaches 0.
 *
 * @slot footer - Content at the bottom of the component. Typically used to insert links and call to action elements.
 * @cssprop {Background} --cc-pricing-estimation-counter-bg - Sets the background (color or gradient) of the product counter (defaults: `var(--cc-color-bg-strong)`).
 * @cssprop {Color} --cc-pricing-hovered-color - Sets the text color used on hover (defaults: `purple`).
 * @cssprop {Color} --cc-pricing-estimation-counter-color - Sets the text color of the product counter (defaults: `var(--cc-color-text-inverted)`).
 */
export class CcPricingEstimation extends LitElement {
  static get properties() {
    return {
      currencies: { type: Array },
      isToggleEnabled: { type: Boolean, attribute: 'is-toggle-enabled' },
      selectedCurrency: { type: String, attribute: 'selected-currency' },
      selectedPlans: { type: Array, attribute: 'selected-plans' },
      selectedTemporality: { type: Object, attribute: 'selected-temporality' },
      state: { type: Object },
      temporalities: { type: Array },
      _isCollapsed: { type: Boolean, state: true },
      _selectedPlansWithPrices: { type: Array, state: true },
    };
  }

  constructor() {
    super();

    /** @type {string[]} Sets the list of currencies. */
    this.currencies = [DEFAULT_CURRENCY];

    /** @type {boolean} Switches the display to toggle.
     * Should be set to true when you want the content of the estimation to be hidden by default, with a button to show / hide it (for instance when the viewport is reduced).
     * You may use JavaScript (for instance a `change` listener on `window.matchMedia`) to sync this prop with a media query breakpoint
     * so that when you switch the positioning of the component with CSS it also enables the toggle mode.
     */
    this.isToggleEnabled = false;

    /** @type {string} Sets the current currency. */
    this.selectedCurrency = DEFAULT_CURRENCY;

    /** @type {Array<RuntimePlanWithQuantity|CountablePlanWithQuantity>} Sets the list of selected plans with their quantity. */
    this.selectedPlans = [];

    /** @type {Temporality} Sets the current temporality. */
    this.selectedTemporality = DEFAULT_TEMPORALITY;

    /** @type {PricingStateEstimation} Sets the state of the component. */
    this.state = { type: 'loading' };

    /** @type {Temporality[]} Sets the list of temporalities. */
    this.temporalities = [DEFAULT_TEMPORALITY];

    /** @type {Map<string, Omit<PricingSection, 'service'>>} */
    this._countablePriceMap = null;

    /** @type {boolean} Collapses the component if `isToggleEnabled` is also set to `true`. */
    this._isCollapsed = false;

    /** @type {Map<string, number>} */
    this._runtimePriceMap = null;

    /** @type {Array<RuntimePlanWithQuantity|CountablePlanWithQuantity>} Sets the list of selected plans with their quantity. */
    this._selectedPlansWithPrices = [];

    /** @type {HTMLParagraphElementRef} */
    this._totalRef = createRef();

    new LostFocusController(this, '.plan', ({ suggestedElement }) => {
      if (suggestedElement != null) {
        const planToggleHeaderElement = suggestedElement.querySelector('.plan__toggle__header');
        if (planToggleHeaderElement instanceof HTMLElement) {
          planToggleHeaderElement.focus();
        }
      } else {
        this._totalRef.value?.focus();
      }
    });
  }

  /**
   * Returns the localized "estimated/temporality" based on the given temporality type.
   *
   * @param {Temporality['type']} type - the temporality type
   * @returns {string|Node}
   */
  _getEstimatedPriceLabel(type) {
    switch (type) {
      case 'second':
        return i18n('cc-pricing-estimation.estimated-price-name.second');
      case 'minute':
        return i18n('cc-pricing-estimation.estimated-price-name.minute');
      case 'hour':
        return i18n('cc-pricing-estimation.estimated-price-name.hour');
      case '1000-minutes':
        return i18n('cc-pricing-estimation.estimated-price-name.1000-minutes');
      case 'day':
        return i18n('cc-pricing-estimation.estimated-price-name.day');
      case '30-days':
        return i18n('cc-pricing-estimation.estimated-price-name.30-days');
    }
  }

  /**
   * Returns the translated string corresponding to a feature code.
   *
   * @param {FormattedFeature} feature - the feature to translate
   * @return {string|Node|void} the translated feature name if a translation exists or nothing if the translation does not exist
   */
  _getFeatureName(feature) {
    if (feature == null) {
      return '';
    }

    if (FEATURES_I18N[feature.code] != null) {
      return FEATURES_I18N[feature.code]();
    }

    if (feature.name != null) {
      return i18n('cc-pricing-estimation.feature.custom', { featureName: feature.name });
    }
  }

  /**
   * Returns the formatted value corresponding to a feature
   *
   * @param {FormattedFeature} feature - the feature to get the formatted value from
   * @return {string|Node|void} the formatted value for the given feature or the feature value itself if it does not require any formatting
   */
  _getFeatureValue(feature) {
    if (feature == null) {
      return '';
    }

    switch (feature.type) {
      case 'boolean':
        return i18n('cc-pricing-estimation.type.boolean', { boolean: feature.value === 'true' });
      case 'boolean-shared':
        return i18n('cc-pricing-estimation.type.boolean-shared', { shared: feature.value === 'shared' });
      case 'bytes':
        return feature.code === 'memory' && feature.value === '0'
          ? i18n('cc-pricing-estimation.type.boolean-shared', { shared: true })
          : i18n('cc-pricing-estimation.type.bytes', { bytes: Number(feature.value) });
      case 'number':
        return feature.code === 'cpu' && feature.value === '0'
          ? i18n('cc-pricing-estimation.type.boolean-shared', { shared: true })
          : i18n('cc-pricing-estimation.type.number', { number: Number(feature.value) });
      case 'number-cpu-runtime':
        return i18n('cc-pricing-estimation.type.number-cpu-runtime', {
          /**
           * Narrowing the type would make the code less readable for no gain, improving the type to separate
           * `number-cpu-runtime` from other types makes the code a lot more complex for almost no superior type safety
           */
          // @ts-ignore
          cpu: feature.value.cpu,
          // @ts-ignore
          shared: feature.value.shared,
        });
      case 'string':
        return feature.value.toString();
    }
  }

  /**
   * Returns the number of products currently in the selectedPlans.
   *
   * @return {number} total number of products
   */
  _getProductCount() {
    return this._selectedPlansWithPrices.reduce((itemCount, plan) => {
      return itemCount + plan.quantity;
    }, 0);
  }

  /**
   * Returns the price computed based on the given temporality
   *
   * @param {Temporality['type']} type - the temporality type
   * @param {number} hourlyPrice - the hourly price to compute
   * @return {number} the computed price based on the given temporality
   */
  _getPrice(type, hourlyPrice) {
    if (this.state.type === 'loading') {
      return 0;
    }

    switch (type) {
      case 'second':
        return hourlyPrice / 60 / 60;
      case 'minute':
        return hourlyPrice / 60;
      case 'hour':
        return hourlyPrice;
      case '1000-minutes':
        return (hourlyPrice / 60) * 1000;
      case 'day':
        return hourlyPrice * 24;
      case '30-days':
        return hourlyPrice * 24 * 30;
    }
  }

  /**
   * Returns the translated price label corresponding to a temporality
   *
   * @param {Temporality['type']} type - the temporality type
   * @return {string|Node} the translated label corresponding to the given temporality
   */
  _getPriceLabel(type) {
    switch (type) {
      case 'second':
        return i18n('cc-pricing-estimation.price-name.second');
      case 'minute':
        return i18n('cc-pricing-estimation.price-name.minute');
      case 'hour':
        return i18n('cc-pricing-estimation.price-name.hour');
      case '1000-minutes':
        return i18n('cc-pricing-estimation.price-name.1000-minutes');
      case 'day':
        return i18n('cc-pricing-estimation.price-name.day');
      case '30-days':
        return i18n('cc-pricing-estimation.price-name.30-days');
    }
  }

  /**
   * Gets the computed price based on a given temporality.
   * Returns the localized and formatted price based on the language and the given number of digits.
   *
   * @param {Temporality['type']} type - the temporality type
   * @param {number} hourlyPrice - the price to base the calculations on
   * @param {number} digits - the number of digits to be used for price rounding
   * @returns {string}
   */
  _getPriceValue(type, hourlyPrice, digits) {
    const price = this._getPrice(type, hourlyPrice);
    return i18n('cc-pricing-estimation.price', { price, currency: this.selectedCurrency, digits });
  }

  /**
   * Returns the total price for a given plan (factoring its quantity)
   *
   * @param {CountablePlanWithQuantity|RuntimePlanWithQuantity} plan - the plan to compute the total for
   * @return {number} the total price for the given plan
   */
  _getTotalPlanPrice(plan) {
    if (this.state.type === 'loading') {
      return 0;
    }

    const unitPlanPrice = plan.price;
    const price = this._getPrice(this.selectedTemporality.type, unitPlanPrice);
    return price * plan.quantity;
  }

  /**
   * Returns the total price by adding the total price of each plan within selectedPlans
   *
   * @return {number} the total price (counting all plans)
   */
  _getTotalPrice() {
    return this._selectedPlansWithPrices?.map((plan) => this._getTotalPlanPrice(plan)).reduce((a, b) => a + b, 0);
  }

  /**
   * Dispatches a `cc-pricing-estimation:change-currency` event with the currency as payload.
   *
   * @param {SlSelectEvent} e - the event that called this method
   */
  _onCurrencyChange(e) {
    dispatchCustomEvent(this, 'change-currency', e.target.value);
  }

  /**
   * Dispatches a `cc-pricing-estimation:change-quantity` event with the plan which quantity has been reduced by 1.
   * If quantity = 0, dispatches a `cc-pricing-estimation:delete-plan` instead with the plan as payload.
   *
   * @param {CountablePlanWithQuantity|RuntimePlanWithQuantity} plan - the plan to modify
   */
  _onDecreaseQuantity(plan) {
    const quantity = plan.quantity - 1;

    if (quantity > 0) {
      dispatchCustomEvent(this, 'change-quantity', { ...plan, quantity });
    } else {
      dispatchCustomEvent(this, 'delete-plan', plan);
    }
  }

  /**
   * Dispatches a `cc-pricing-estimation:delete-plan` event with the plan as its payload
   *
   * @param {CountablePlanWithQuantity|RuntimePlanWithQuantity} plan - the plan to delete
   */
  _onDeletePlan(plan) {
    dispatchCustomEvent(this, 'delete-plan', plan);
  }

  /**
   * Dispatches a `cc-pricing-estimation:change-quantity` event with the plan which quantity has been increased by 1.
   *
   * @param {CountablePlanWithQuantity|RuntimePlanWithQuantity} plan - the plan to modify
   */
  _onIncreaseQuantity(plan) {
    const quantity = plan.quantity + 1;
    dispatchCustomEvent(this, 'change-quantity', { ...plan, quantity });
  }

  /**
   * Dispatches a `cc-pricing-estimation:change-temporality` event with the selected temporality as its payload.
   *
   * @param {SlSelectEvent} e - the event that called this method
   */
  _onTemporalityChange(e) {
    const temporality = this.temporalities.find((t) => t.type === e.target.value);
    dispatchCustomEvent(this, 'change-temporality', temporality);
  }

  /**
   * Toggles the `_isCollapsed` property to show / hide the component content (when `this.isToggleEnabled === true`)
   */
  _onToggle() {
    this._isCollapsed = !this._isCollapsed;
  }

  _computeUnitPrices() {
    if (this.state.type === 'loading') {
      this._selectedPlansWithPrices = this.selectedPlans.map((selectedPlan) => ({
        ...selectedPlan,
        price: 0,
      }));
      return;
    }

    this._selectedPlansWithPrices = this.selectedPlans.map((selectedPlan) => {
      if ('sections' in selectedPlan) {
        const sectionsWithUpdatedPrices = selectedPlan.sections.map((section) => ({
          ...section,
          ...this._countablePriceMap.get(section.service),
        }));
        const simulator = new PricingConsumptionSimulator(sectionsWithUpdatedPrices);

        return {
          ...selectedPlan,
          price: simulator.getTotalPrice() / THIRTY_DAYS_IN_HOURS,
        };
      }

      return {
        ...selectedPlan,
        price: this._runtimePriceMap.get(selectedPlan.priceId) ?? selectedPlan.price,
      };
    });
  }

  /** @param {CcPricingEstimationPropertyValues} changedProperties */
  willUpdate(changedProperties) {
    // This is not done within the `render` function because we only want to reset this value in specific cases.
    // If `isToggleEnabled` is set to true, we need to make sure the content is hidden by default
    if (changedProperties.has('isToggleEnabled') && this.isToggleEnabled === true) {
      this._isCollapsed = true;
    }

    if (changedProperties.has('state') && this.state.type === 'loaded') {
      /** @type {Array<[string, number]>} */
      const runtimePricesAsKeyValue = this.state.runtimePrices.map(({ priceId, price }) => [priceId, price]);
      /** @type {Array<[PricingSection['service'], Omit<PricingSection, 'service'>]>} */
      const countablePricesAsKeyValue = this.state.countablePrices.map(({ service, ...rest }) => [
        service,
        { ...rest },
      ]);
      this._runtimePriceMap = new Map(runtimePricesAsKeyValue);
      this._countablePriceMap = new Map(countablePricesAsKeyValue);
      this._computeUnitPrices();
    }

    if (changedProperties.has('selectedPlans') && this.state.type !== 'error') {
      this._computeUnitPrices();
    }
  }

  render() {
    if (this.state.type === 'error') {
      return html`<cc-notice intent="warning" message=${i18n('cc-pricing-estimation.error')}></cc-notice> `;
    }

    const totalPrice = this._getTotalPrice();
    const skeleton = this.state.type === 'loading';

    return html`
      ${this.isToggleEnabled ? this._renderHeaderWithToggle(totalPrice, skeleton) : this._renderHeaderWithoutToggle()}

      <div class="content ${classMap({ 'content--hidden': this.isToggleEnabled && this._isCollapsed })}">
        ${this._selectedPlansWithPrices.map((plan) => this._renderSelectedPlan(plan, skeleton))}

        <p class="content__total" tabindex="-1" ${ref(this._totalRef)}>
          <strong>
            <span class="visually-hidden"> ${i18n('cc-pricing-estimation.total.label')} </span>
            <span class="content__total__price ${classMap({ skeleton })}">
              ${i18n('cc-pricing-estimation.price', {
                price: totalPrice,
                currency: this.selectedCurrency,
                digits: this.selectedTemporality.digits,
              })}
            </span>
          </strong>
          <span>${i18n('cc-pricing-estimation.tax-excluded')}</span>
          <span class="content__total__estimated">${this._getEstimatedPriceLabel(this.selectedTemporality.type)}</span>
        </p>

        ${this._renderSelectForm(skeleton)}

        <slot name="footer"></slot>
      </div>
    `;
  }

  /**
   * @param {number} totalPrice
   * @param {boolean} skeleton
   */
  _renderHeaderWithToggle(totalPrice, skeleton) {
    const productCount = this._getProductCount();

    return html`
      <div class="header header--toggle">
        <strong class="header__heading">${i18n('cc-pricing-estimation.heading')}</strong>
        <span class="header__badge">
          ${productCount}
          <span class="visually-hidden">${i18n('cc-pricing-estimation.count.label', { productCount })}</span>
        </span>
        <p class="header__total ${classMap({ 'header__total--hidden': !this._isCollapsed })}">
          <strong class="${classMap({ skeleton })}">
            ${i18n('cc-pricing-estimation.price', {
              price: totalPrice,
              currency: this.selectedCurrency,
              digits: this.selectedTemporality.digits,
            })}
          </strong>
          <span>${i18n('cc-pricing-estimation.tax-excluded')}</span>
        </p>
        <button class="header__toggle-btn" @click="${this._onToggle}">
          ${this._isCollapsed ? i18n('cc-pricing-estimation.show') : i18n('cc-pricing-estimation.hide')}
        </button>
      </div>
    `;
  }

  _renderHeaderWithoutToggle() {
    const productCount = this._getProductCount();

    return html`
      <div class="header">
        <strong class="header__heading">${i18n('cc-pricing-estimation.heading')}</strong>
        <span class="header__badge">
          ${productCount}
          <span class="visually-hidden">${i18n('cc-pricing-estimation.count.label', { productCount })}</span>
        </span>
      </div>
    `;
  }

  /**
   * @param {CountablePlanWithQuantity|RuntimePlanWithQuantity} plan - the plan to render
   * @param {boolean} skeleton
   */
  _renderSelectedPlan(plan, skeleton) {
    const totalPlanPrice = this._getTotalPlanPrice(plan);
    const hasFeatures = 'features' in plan && Array.isArray(plan.features);

    return html`
      <div class="plan">
        <details class="plan__toggle">
          <summary class="plan__toggle__header">
            <span class="plan__toggle__header__name">
              ${plan.productName}
              <span class="plan__toggle__header__name__plan"> &ndash; ${plan.name}</span>
            </span>

            <span class="plan__toggle__header__total ${classMap({ skeleton })}">
              ${i18n('cc-pricing-estimation.price', {
                price: totalPlanPrice,
                currency: this.selectedCurrency,
                digits: this.selectedTemporality.digits,
              })}
            </span>

            <span class="plan__toggle__header__expand">
              <cc-icon .icon=${iconArrowDown}></cc-icon>
            </span>
          </summary>
          ${hasFeatures
            ? html`
                <dl class="plan__features">
                  ${plan.features
                    ?.filter((feature) => AVAILABLE_FEATURES.includes(feature.code) || feature.name != null)
                    ?.map((feature) => {
                      return html`
                        <div class="plan__features__feature">
                          <dt>${this._getFeatureName(feature)}</dt>
                          <dd>${this._getFeatureValue(feature)}</dd>
                        </div>
                      `;
                    })}
                </dl>
              `
            : ''}
          <div class="plan__price">
            <span>
              <span class="visually-hidden">${i18n('cc-pricing-estimation.price.unit.label')}</span>
              <span class="${classMap({ skeleton })}">
                ${this._getPriceValue(this.selectedTemporality.type, plan.price, this.selectedTemporality.digits)}
              </span>
            </span>
            <div class="plan__price__quantity">
              <button
                @click="${() => this._onDecreaseQuantity(plan)}"
                title="${i18n('cc-pricing-estimation.plan.qty.btn.decrease', {
                  productName: plan.productName,
                  planName: plan.name,
                })}"
                ?disabled=${skeleton}
              >
                <cc-icon
                  .icon=${iconSubtract}
                  a11y-name=${i18n('cc-pricing-estimation.plan.qty.btn.decrease', {
                    productName: plan.productName,
                    planName: plan.name,
                  })}
                ></cc-icon>
              </button>
              <strong class="plan__price__quantity__counter" aria-live="polite" aria-atomic="true">
                <span class="visually-hidden">${i18n('cc-pricing-estimation.plan.qty.label')}</span>
                ${plan.quantity}
              </strong>
              <button
                @click="${() => this._onIncreaseQuantity(plan)}"
                title="${i18n('cc-pricing-estimation.plan.qty.btn.increase', {
                  productName: plan.productName,
                  planName: plan.name,
                })}"
                ?disabled=${skeleton}
              >
                <cc-icon
                  .icon=${iconAdd}
                  a11y-name=${i18n('cc-pricing-estimation.plan.qty.btn.increase', {
                    productName: plan.productName,
                    planName: plan.name,
                  })}
                ></cc-icon>
              </button>
            </div>
            <strong class="plan__price__total ${classMap({ skeleton })}" aria-live="polite" aria-atomic="true">
              <span class="visually-hidden">
                ${i18n('cc-pricing-estimation.plan.total.label', {
                  productName: plan.productName,
                  planName: plan.name,
                })}
              </span>
              ${i18n('cc-pricing-estimation.price', {
                price: totalPlanPrice,
                currency: this.selectedCurrency,
                digits: this.selectedTemporality.digits,
              })}
            </strong>
          </div>
        </details>
        <button
          class="plan__delete"
          title="${i18n('cc-pricing-estimation.plan.delete', {
            productName: plan.productName,
            planName: plan.name,
          })}"
          @click="${() => this._onDeletePlan(plan)}"
          ?disabled=${skeleton}
        >
          <cc-icon
            .icon=${iconBin}
            a11y-name="${i18n('cc-pricing-estimation.plan.delete', {
              productName: plan.productName,
              planName: plan.name,
            })}"
          ></cc-icon>
        </button>
      </div>
    `;
  }

  /** @param {boolean} skeleton */
  _renderSelectForm(skeleton) {
    return html`
      <div class="form">
        <sl-select
          label="${i18n('cc-pricing-estimation.label.temporality')}"
          class="temporality-select"
          hoist
          placement="top"
          value=${this.selectedTemporality?.type}
          @sl-change=${this._onTemporalityChange}
        >
          ${this.temporalities.map(
            (temporality) => html`
              <sl-option
                ?disabled=${skeleton && this.selectedTemporality.type !== temporality.type}
                value=${temporality.type}
                >${this._getPriceLabel(temporality.type)}</sl-option
              >
            `,
          )}
          <cc-icon slot="expand-icon" .icon=${iconArrowDown} size="xl"></cc-icon>
        </sl-select>

        <sl-select
          label="${i18n('cc-pricing-estimation.label.currency')}"
          class="currency-select"
          hoist
          placement="top"
          value=${this.selectedCurrency}
          @sl-change=${this._onCurrencyChange}
        >
          ${this.currencies.map(
            (currency) => html`
              <sl-option ?disabled=${skeleton && this.selectedCurrency !== currency} value=${currency}
                >${getCurrencySymbol(currency)} ${currency}</sl-option
              >
            `,
          )}
          <cc-icon slot="expand-icon" .icon=${iconArrowDown} size="xl"></cc-icon>
        </sl-select>
      </div>
    `;
  }

  static get styles() {
    return [
      accessibilityStyles,
      shoelaceStyles,
      skeletonStyles,
      // language=CSS
      css`
        :host {
          display: block;
          padding: 2em;
        }

        .skeleton {
          background-color: #bbb;
          color: transparent;
        }

        button {
          background: transparent;
          border: none;
        }

        sl-select::part(form-control-input):focus-within,
        summary:focus-visible,
        button:focus {
          outline: var(--cc-focus-outline, #000);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        /* region header */

        .header {
          align-items: center;
          color: var(--cc-color-text-default, #000);
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
        }

        .header--toggle {
          align-items: center;
          display: grid;
          gap: 0 0.5em;
          grid-template-areas:
            'heading counter btn'
            'total total total';
          grid-template-columns: auto 1fr auto;
          line-height: 1.5;
        }

        .header__heading {
          font-size: 1.3em;
          font-weight: bold;
          grid-area: heading;
        }

        .header__badge {
          align-items: center;
          background: var(--cc-pricing-estimation-counter-bg, var(--cc-color-bg-strong, #000));
          border-radius: 50%;
          color: var(--cc-pricing-estimation-counter-color, var(--cc-color-text-inverted, #fff));
          display: inline-flex;
          font-size: 0.9em;
          font-weight: bold;
          grid-area: counter;
          height: 1.7em;
          justify-content: center;
          min-width: 1.7em;
          width: max-content;
        }

        .header__toggle-btn {
          color: var(--cc-color-text-primary-highlight, blue);
          cursor: pointer;
          font-size: 1em;
          font-weight: 500;
          grid-area: btn;
          justify-self: flex-end;
          text-decoration: none;
        }

        .header__toggle-btn:hover {
          color: var(--cc-pricing-hovered-color, purple);
        }

        .header__total {
          font-size: 1.1em;
          grid-area: total;
          margin: 0;
        }

        .header__total--hidden {
          display: none;
        }

        .header__total strong {
          font-weight: bold;
        }

        /* endregion */

        /* region content */

        .content {
          margin-top: 1em;
        }

        .content--hidden {
          display: none;
        }

        /* region plan section */

        .plan {
          align-items: center;
          border-bottom: solid 1px var(--cc-color-border-neutral-weak, #eee);
          column-gap: 0.5em;
          display: grid;
          grid-template-areas:
            'plan-header plan-delete'
            'plan-features plan-features'
            'plan-price plan-price';
          grid-template-columns: 1fr auto;
          padding-block: 1em;
        }

        .plan__toggle {
          display: contents;
        }

        .plan__delete {
          --cc-icon-color: var(--cc-color-text-danger);
          --cc-icon-size: 1.2em;

          cursor: pointer;
          grid-area: plan-delete;
          height: 1.5em;
          padding: 0;
          transition: transform 0.2s ease-in;
          width: 1.5em;
        }

        .plan__delete:hover {
          --cc-icon-color: var(--cc-pricing-hovered-color, purple);
        }

        .plan__toggle__header {
          align-items: center;
          box-sizing: border-box;
          cursor: pointer;
          display: grid;
          gap: 0.5em;
          grid-area: plan-header;
          grid-template-columns: auto 1fr auto;
          /* Remove the summary icon */
          list-style: none;
        }

        /* Remove the summary icon on WebKit */

        .plan__toggle__header::-webkit-details-marker {
          display: none;
        }

        .plan__toggle__header__name {
          font-weight: 600;
        }

        .plan__toggle__header__name__plan {
          font-weight: normal;
        }

        .plan__toggle__header__total {
          font-weight: 600;
          justify-self: flex-end;
        }

        .plan__toggle[open] .plan__toggle__header__total {
          visibility: hidden;
        }

        .plan__toggle__header__expand {
          --cc-icon-size: 1.5em;

          box-sizing: border-box;
          transition: transform 0.2s ease-in;
        }

        .plan__toggle[open] .plan__toggle__header__expand {
          transform: rotate(-180deg);
        }

        .plan__toggle__header .plan__toggle__header__expand cc-icon {
          transition: transform 0.2s ease-in;
        }

        .plan__toggle__header:hover {
          --cc-icon-color: var(--cc-pricing-hovered-color, purple);

          color: var(--cc-pricing-hovered-color, purple);
        }

        dl,
        dt,
        dd {
          margin: 0;
          padding: 0;
        }

        .plan__features {
          color: var(--cc-color-text-weak, #333);
          display: flex;
          flex-wrap: wrap;
          font-size: 0.9em;
          gap: 0 0.5em;
          grid-area: plan-features;
          line-height: 1.5;
          margin-top: 1em;
        }

        .plan__features__feature {
          display: flex;
          gap: 0.2em;
        }

        .plan__features__feature dt {
          font-weight: 600;
        }

        .plan__features__feature:not(:last-child) dd::after {
          content: ',';
        }

        .plan__price {
          align-items: center;
          color: var(--cc-color-text-default, #000);
          display: grid;
          gap: 0.5em 0.2em;
          grid-area: plan-price;
          grid-template-columns: 1fr auto 1fr;
          justify-content: space-between;
          margin-top: 1em;
        }

        .plan__price__quantity {
          align-items: center;
          display: flex;
          gap: 0.1em;
        }

        .plan__price__quantity__counter {
          font-weight: bold;
          min-width: 2em;
          text-align: center;
        }

        .plan__price__quantity button {
          background-color: var(--cc-color-bg-default, #000);
          border: 1px solid var(--cc-color-border-neutral-strong);
          color: var(--cc-color-text-default, #000);
          display: grid;
          font-size: 1em;
          height: 1.3em;
          padding: 0;
          place-content: center;
          width: 1.3em;
        }

        .plan__price__quantity button:hover {
          --cc-icon-color: var(--cc-pricing-hovered-color);

          border-color: var(--cc-color-border-hovered);
          cursor: pointer;
        }

        .plan__price__total {
          font-weight: bold;
          justify-self: flex-end;
        }

        /* endregion */

        /* region content total */

        .content__total {
          text-align: right;
        }

        .content__total__price.skeleton {
          display: inline-block;
        }

        .content__total strong {
          color: var(--cc-color-text-default, #000);
          font-size: 1.3em;
          font-weight: 600;
        }

        .content__total__estimated {
          color: var(--cc-color-text-weak, #333);
          display: block;
        }

        /* endregion */

        /* endregion */

        /* region select form */

        .form {
          display: flex;
          flex-wrap: wrap;
          gap: 1em;
        }

        /* region cc-pricing-header styles */

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

          animation: none;
          flex: 1 1 10.5em;
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
          height: 0.7em;
          margin-right: 0.5em;
          width: 0.7em;
        }

        /* endregion */

        /* endregion */
      `,
    ];
  }
}

window.customElements.define('cc-pricing-estimation', CcPricingEstimation);
