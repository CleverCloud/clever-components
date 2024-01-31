// TODO variations

/**
 * @typedef {import('../components/cc-credit-consumption/cc-credit-consumption.types.js').OneDayOfConsumption} OneDayOfConsumption
 */

/**
 * Generates fake consumption data based on a given date and a total consumption
 */
export class ConsumptionFaker {
  /**
   * @param {Date} currentDay - The current day of the fake data. This determines the period (current month for the given date) and the last consumption day (day before the current day).
   * @param {number} totalConsumption - The total consumption for the period
   */
  constructor (currentDay, totalConsumption) {
    /** @type {number} The consumption month as a number */
    this.month = currentDay.getMonth();
    /** @type {number} The consumption year as a number */
    this.year = currentDay.getFullYear();

    /** @type {number} the last day of consumption as a number */
    this._lastConsumptionDayAsNumber = currentDay.getDate() - 1;

    /**  @type {number} the consumption total */
    this.totalConsumption = totalConsumption;

    /** @type {Date} The first day of the consumption month as a Date */
    this.firstDayOfTheMonth = new Date(this.year, this.month, 1);
    /** @type {Date} The last day of the consumption month as a Date */
    this.lastDayOfTheMonth = new Date(this.year, this.month + 1, 0);
    /**
     * @type {OneDayOfConsumption[]} the generated fake consumption
     */
    this.consumptions = this._generateConsumption();
  }

  /**
   * Generates fake consumption data from the beginning of the period to the `_lastConsumptionDayAsNumber` (`currentDay` - 1)
   * @returns {OneDayOfConsumption[]}
   */
  _generateConsumption () {
    const data = [];

    if (this._lastConsumptionDayAsNumber === 0) {
      return data;
    }

    for (let i = 1; i <= this._lastConsumptionDayAsNumber; i++) {
      const value = this.totalConsumption / this._lastConsumptionDayAsNumber;

      data.push({
        date: new Date(this.year, this.month, i),
        value,
      });
    }

    return data;
  }
}
