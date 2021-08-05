const ONE_GIGABYTE = 1e9;

/**
 * A pricing simulator for products with consumption based pricings.
 *
 * * Interval prices are defined in "euros / gigabyte".
 * * Interval ranges are defined in bytes.
 * * Quantity is in bytes.
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
 *   maxRange: number, // byte
 *   minRange: number, // byte
 *   price: number,    // "euros / gigabyte / 30 days" or just "euros / gigabyte" for timeless sections like traffic
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
   * @param {SectionType} type
   * @returns {Number} - Number of bytes
   */
  getQuantity (type) {
    return this._state[type].quantity;
  }

  /**
   * @param {SectionType} type
   * @param {Number} quantity - Number of bytes
   */
  setQuantity (type, quantity) {
    if (!isNaN(quantity)) {
      this._state[type].quantity = quantity;
    }
  }

  /**
   * @param {SectionType} type
   * @returns {Interval} - Interval matching the current quantity or null
   */
  getCurrentInterval (type) {
    const { intervals, quantity } = this._state[type];
    return intervals?.find((interval) => {
      return quantity >= interval.minRange && quantity < (interval?.maxRange ?? Infinity);
    }) ?? null;
  }

  /**
   * @param {SectionType} type
   * @returns {Number} - Estimated price for a section
   */
  getEstimatedPrice (type) {
    const interval = this.getCurrentInterval(type);
    if (interval == null) {
      return 0;
    }
    const pricePerGigabyte = interval.price;
    const quantityInBytes = this._state[type].quantity;
    const quantityInGigabytes = quantityInBytes / ONE_GIGABYTE;
    return pricePerGigabyte * quantityInGigabytes;
  }

  /**
   * @returns {Number} - Sum of estimated price for all the sections
   */
  getTotalPrice () {
    return Object.keys(this._state)
      .map((type) => this.getEstimatedPrice(type))
      .reduce((a, b) => a + b, 0);
  }
}
