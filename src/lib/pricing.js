/**
 * A pricing simulator for products with consumption based pricings.
 *
 * * Interval prices are defined in "euros / [unit]".
 * * Interval ranges are defined in [unit].
 * * Quantity is in [unit].
 *
 * ## Type definitions
 *
 * ```js
 * interface Section {
 *   type: string,
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

  /**
   * @param {Section[]} sections
   */
  constructor (sections = []) {
    this._state = {};
    sections.forEach(({ type, intervals }) => {
      this._state[type] = {
        intervals,
        quantity: 0,
      };
    });
  }

  /**
   * Get the quantity for a given section.
   * @param {SectionType} type
   * @returns {Number} - How many [unit]
   */
  getQuantity (type) {
    return this._state[type].quantity;
  }

  /**
   * Set the quantity for a given section.
   * @param {SectionType} type - The section type
   * @param {Number} quantity - How many [unit]
   */
  setQuantity (type, quantity) {
    if (!isNaN(quantity)) {
      this._state[type].quantity = quantity;
    }
  }

  /**
   * Get the maximum interval (the one matching the quantity) for a given section.
   * @param {SectionType} type - The section type
   * @returns {Interval} - Interval matching the quantity or null
   */
  getMaxInterval (type) {
    const { intervals, quantity } = this._state[type];
    return intervals?.find((interval) => {
      return quantity >= interval.minRange && quantity < (interval.maxRange ?? Infinity);
    }) ?? null;
  }

  /**
   * Get the estimated price for a given interval.
   * @param {SectionType} type - The section type
   * @param {Number} intervalIndex - The index of the interval
   * @returns {number} - Estimated price for a given interval.
   */
  getIntervalPrice (type, intervalIndex) {
    const interval = this._state[type].intervals?.[intervalIndex] ?? null;
    const maxInterval = this.getMaxInterval(type);
    if (interval == null || interval !== maxInterval) {
      return 0;
    }
    const unitPrice = interval.price;
    const quantity = this._state[type].quantity;
    return unitPrice * quantity;
  }

  /**
   * Get the estimated price for all intervals of a given section.
   * @param {SectionType} type - The section type
   * @returns {number} - Estimated price for all intervals of a given section.
   */
  getSectionPrice (type) {
    const intervals = this._state[type].intervals ?? [];
    return intervals
      .map((interval, intervalIndex) => this.getIntervalPrice(type, intervalIndex))
      .reduce((a, b) => a + b, 0);
  }

  /**
   * Get the estimated price for all sections.
   * @returns {Number} - Estimated price for all intervals of a given section.
   */
  getTotalPrice () {
    return Object.keys(this._state)
      .map((type) => this.getSectionPrice(type))
      .reduce((a, b) => a + b, 0);
  }
}
