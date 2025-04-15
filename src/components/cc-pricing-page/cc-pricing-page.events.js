import { CcEvent } from '../../lib/events.js';

/**
 * @typedef {import('../cc-pricing-estimation/cc-pricing-estimation.types.js').CountablePlanWithQuantity} CountablePlanWithQuantity
 * @typedef {import('../cc-pricing-estimation/cc-pricing-estimation.types.js').RuntimePlanWithQuantity} RuntimePlanWithQuantity
 * @typedef {import('../common.types.js').Temporality} Temporality
 */

/**
 * Dispatched when the pricing plan quantity changes.
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
 * Dispatched when the pricing currency changes.
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
 * Dispatched when the pricing temporality changes.
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
 * Dispatched when a pricing plan has been deleted or when its quantity reached 0.
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
