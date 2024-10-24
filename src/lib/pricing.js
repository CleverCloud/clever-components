/**
 * @typedef {import('./pricing.types.js').PricingSimulatorState} PricingSimulatorState
 * @typedef {import('../components/common.types.js').PricingSection} PricingSection
 * @typedef {import('../components/common.types.js').SectionType} SectionType
 * @typedef {import('../components/common.types.js').PricingInterval} PricingInterval
 */

/**
 * A pricing simulator for products with consumption based pricings.
 *
 * * Interval prices are defined in "euros / [unit]".
 * * Interval ranges are defined in [unit].
 * * Quantity is in [unit].
 *
 * ## Progressive pricing system
 *
 * There are two solutions to apply a consumption pricing system based on intervals.
 *
 * * Solution 1: apply the price of the interval matching the total quantity to the total quantity.
 * * Solution 2: apply the price of each interval to the quantity that fits in each respective interval.
 *
 * * Solution 2 is what we call progressive.
 * * Solution 2 is used by most cloud providers for consumption based pricing.
 * * Solution 2 is what most income tax systems use.
 *
 * ## Secability
 *
 * If you need to apply your prices on batches/groups, something like "€2 per 100 users":
 *
 * * you need to set the secability to the size of your batch/group `secability: 100` in the section
 * * the interval prices are still per 1 so you will need to set `price: 0.02` in your intervals
 *
 * ## Type definitions
 *
 * ```js
 * interface Section {
 *   type: string,
 *   progressive?: boolean, // defaults to false
 *   secability?: number, // defaults to 1
 *   intervals?: Interval[],
 * }
 * ```
 *
 * ```js
 * interface Interval {
 *   maxRange: number, // [unit]
 *   minRange: number, // [unit]
 *   price: number,    // "euros / [unit]"
 * }
 * ```
 */
export class PricingConsumptionSimulator {
  /** @param {Array<PricingSection>} sections */
  constructor(sections = []) {
    /** @type {PricingSimulatorState}*/
    this._state = {};
    sections.forEach(({ type, intervals, service, progressive = false, secability = 1, quantity = 0 }) => {
      this._state[type] = {
        intervals,
        service,
        progressive,
        secability,
        quantity,
      };
    });
  }

  /**
   * Get the quantity for a given section.
   * @param {SectionType} type
   * @returns {number} - How many [unit]
   */
  getQuantity(type) {
    return this._state[type].quantity;
  }

  /**
   * Set the quantity for a given section.
   * @param {SectionType} type - The section type
   * @param {number} quantity - How many [unit]
   */
  setQuantity(type, quantity) {
    if (!isNaN(quantity)) {
      this._state[type].quantity = quantity;
    }
  }

  /**
   * Get the maximum interval (the one matching the quantity) for a given section.
   * @param {SectionType} type - The section type
   * @returns {PricingInterval} - Interval matching the quantity or null
   */
  getMaxInterval(type) {
    const { intervals, quantity } = this._state[type];
    return (
      intervals?.find(({ minRange, maxRange }) => {
        return quantity >= minRange && quantity < (maxRange ?? Infinity);
      }) ?? null
    );
  }

  /**
   * Get the estimated price for a given interval.
   * @param {SectionType} type - The section type
   * @param {number} intervalIndex - The index of the interval
   * @returns {number} - Estimated price for a given interval.
   */
  getIntervalPrice(type, intervalIndex) {
    const interval = this._state[type].intervals?.[intervalIndex] ?? null;

    if (interval == null) {
      return 0;
    }

    const isProgressive = this._state[type].progressive;
    const secability = this._state[type].secability;
    const { price: unitPrice } = interval;
    const quantity = this._state[type].quantity;
    const totalQuantity = Math.ceil(quantity / secability) * secability;

    if (isProgressive) {
      const { minRange, maxRange } = interval;
      const intervalQuantity = getIntervalQuantity(minRange, totalQuantity, maxRange ?? Infinity);
      return unitPrice * intervalQuantity;
    } else {
      const maxInterval = this.getMaxInterval(type);
      return interval === maxInterval ? unitPrice * totalQuantity : 0;
    }
  }

  /**
   * Get the estimated price for all intervals of a given section.
   * @param {SectionType} type - The section type
   * @returns {number} - Estimated price for all intervals of a given section.
   */
  getSectionPrice(type) {
    const intervals = this._state[type].intervals ?? [];
    return intervals.map((_, intervalIndex) => this.getIntervalPrice(type, intervalIndex)).reduce((a, b) => a + b, 0);
  }

  /**
   * Get the estimated price for all sections.
   * @returns {number} - Estimated price for all intervals of a given section.
   */
  getTotalPrice() {
    return Object.keys(this._state)
      .map((type) => this.getSectionPrice(/** @type {SectionType} */ (type)))
      .reduce((a, b) => a + b, 0);
  }
}

/**
 * Return how many integers fit inside interval [min, max[
 * @param {number} min
 * @param {number} value
 * @param {number} max
 * @returns {number}
 */
export function getIntervalQuantity(min, value, max) {
  // Intervals starting at 0 are a special case
  const beforeMin = min === 0 ? 0 : min - 1;
  const intervalSize = min === 0 ? max - 1 : max - min;
  return Math.max(0, Math.min(value - beforeMin, intervalSize));
}
