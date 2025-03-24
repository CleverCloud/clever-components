import { CcEvent } from '../../lib/events.js';

/**
 * @typedef {import('../cc-pricing-estimation/cc-pricing-estimation.types.js').RuntimePlanWithQuantity} RuntimePlanWithQuantity
 * @typedef {import('../cc-pricing-estimation/cc-pricing-estimation.types.js').CountablePlanWithQuantity} CountablePlanWithQuantity
 * @typedef {import('../common.types.js').Plan} Plan
 * @typedef {import('../common.types.js').ConsumptionPlan} ConsumptionPlan
 * @typedef {import('../common.types.js').Temporality} Temporality
 */

/**
 * Fired when the quantity of a plan changes.
 *
 * @extends {CcEvent<RuntimePlanWithQuantity|CountablePlanWithQuantity>}
 */
export class CcPricingQuantityChangeEvent extends CcEvent {
  static TYPE = 'cc-pricing-quantity-change';

  /**
   * @param {RuntimePlanWithQuantity|CountablePlanWithQuantity} detail
   */
  constructor(detail) {
    super(CcPricingQuantityChangeEvent.TYPE, detail);
  }
}

/**
 * Fired when the currency selection changes.
 *
 * @extends {CcEvent<string>}
 */
export class CcPricingCurrencyChangeEvent extends CcEvent {
  static TYPE = 'cc-pricing-currency-change';

  /**
   * @param {string} detail
   */
  constructor(detail) {
    super(CcPricingCurrencyChangeEvent.TYPE, detail);
  }
}

/**
 * Fired when the temporality selection changes.
 *
 * @extends {CcEvent<Temporality>}
 */
export class CcPricingTemporalityChangeEvent extends CcEvent {
  static TYPE = 'cc-pricing-temporality-change';

  /**
   * @param {Temporality} detail
   */
  constructor(detail) {
    super(CcPricingTemporalityChangeEvent.TYPE, detail);
  }
}

/**
 * Fired when a plan is deleted or when its quantity reaches 0.
 *
 * @extends {CcEvent<RuntimePlanWithQuantity|CountablePlanWithQuantity>}
 */
export class CcPricingPlanDeleteEvent extends CcEvent {
  static TYPE = 'cc-pricing-plan-delete';

  /**
   * @param {RuntimePlanWithQuantity|CountablePlanWithQuantity} detail
   */
  constructor(detail) {
    super(CcPricingPlanDeleteEvent.TYPE, detail);
  }
}

/**
 * Fired when the zone selection changes.
 *
 * @extends {CcEvent<string>}
 */
export class CcPricingZoneChangeEvent extends CcEvent {
  static TYPE = 'cc-pricing-zone-change';

  /**
   * @param {string} detail
   */
  constructor(detail) {
    super(CcPricingZoneChangeEvent.TYPE, detail);
  }
}

/**
 * Fired when the "add plan" button is clicked.
 *
 * @extends {CcEvent<Plan|ConsumptionPlan>}
 */
export class CcPricingPlanAddEvent extends CcEvent {
  static TYPE = 'cc-pricing-plan-add';

  /**
   * @param {Plan|ConsumptionPlan} detail
   */
  constructor(detail) {
    super(CcPricingPlanAddEvent.TYPE, detail);
  }
}
