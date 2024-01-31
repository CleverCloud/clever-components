/**
 * @typedef {import('../components/cc-credit-consumption/cc-credit-consumption.types.js').OneDayOfConsumption} OneDayOfConsumption
 * @typedef {import('../components/cc-credit-consumption/cc-credit-consumption.types.js').Coupon} Coupon
 * @typedef {import('../components/cc-credit-consumption/cc-credit-consumption.types.js').PrepaidCredits} PrepaidCredits
 */

export class ConsumptionCalculator {
  /**
   * @param  {Object} data
   * @param  {number} data.discount
   * @param  {number} data.priceFactor
   * @param  {OneDayOfConsumption[]} data.consumptions
   * @param  {Coupon[]} data.coupons
   * @param  {PrepaidCredits} data.prepaidCredits
   */
  constructor ({ discount, priceFactor, consumptions, coupons, prepaidCredits }) {

    /**
     * @type {import('../components/cc-credit-consumption/cc-credit-consumption.types.js').OneDayOfConsumption[]}
     * Consumptions computed with the price factor and discount
     */
    this.computedConsumptions = this._getComputedConsumptions(consumptions, discount, priceFactor);

    /** @type {number} Total consumption computed with price factor and discount */
    this.computedConsumption = this.computedConsumptions.reduce((total, oneDayOfConsumption) => total + oneDayOfConsumption.value, 0);

    /** @type {number} Total free credits based on the coupons available */
    this.totalFreeCredits = coupons.reduce((total, coupon) => total + coupon.amount, 0);

    /** @type {number} Remaining free credits (total free credits minus computed consumption) */
    this.remainingFreeCredits = Math.max(0, this.totalFreeCredits - this.computedConsumption);

    /** @type {number} Total prepaid credits (0 if prepaid credits are disabled) */
    this.totalPrepaidCredits = prepaidCredits.enabled ? prepaidCredits.total : 0;

    /** @type {number} Computed consumption minus the total free credits */
    this._consumptionMinusFreeCredits = Math.max(0, this.computedConsumption - this.totalFreeCredits);

    /** @type {number} Remaining Prepaid Credits (total prepaid credits minus computed consumption minus total free credits) */
    this.remainingPrepaidCredits = Math.max(0, this.totalPrepaidCredits - this._consumptionMinusFreeCredits);

    /** @type {number} Total credits (total free credits + total prepaid credits) */
    this.totalCredits = this.totalFreeCredits + this.totalPrepaidCredits;

    /** @type {number} Remaining Credits (total credits minus computed consumption) */
    this.remainingCredits = Math.max(0, this.totalCredits - this.computedConsumption);
  }

  /**
   * Computes the consumption taking the discount and price factor into account
   *
   * @param {number} rawConsumption - the raw consumption figure
   * @param {number} discount - the discount percent
   * @param {number} priceFactor - the price factor
   * @return {number} the computed consumption
   */
  _getComputedConsumption (rawConsumption, discount, priceFactor) {
    let computedConsumption = rawConsumption;

    if (priceFactor != null && priceFactor > 0) {
      computedConsumption *= priceFactor;
    }

    if (discount != null && discount > 0) {
      computedConsumption = computedConsumption - (computedConsumption * (discount / 100));
    }

    return computedConsumption;
  }

  /**
   * Computes the consumptions taking the discount and price factor into account
   *
   * @param {OneDayOfConsumption[]} consumptions - the raw consumption figures
   * @param {number} discount - the discount percent
   * @param {number} priceFactor - the price factor
   * @return {OneDayOfConsumption[]} the computed consumption figures with discount and price factor applied
   */
  _getComputedConsumptions (consumptions, discount, priceFactor) {
    let computedConsumptions = consumptions;

    if (priceFactor != null && priceFactor > 0) {
      computedConsumptions = computedConsumptions.map(({ date, value }) => ({
        date,
        value: value * priceFactor,
      }));
    }

    if (discount != null && discount > 0) {
      computedConsumptions = computedConsumptions.map(({ date, value }) => ({
        date,
        value: value - (value * (discount / 100)),
      }));
    }

    return computedConsumptions;
  }
}
