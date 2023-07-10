import { getCurrentTimezone, isDateValid } from './date-utils.js';

/**
 * @typedef {import('./timestamp-formatter.types.js').Timezone} Timezone
 */

let CURRENT_ZONE;
function getCurrentZone () {
  if (CURRENT_ZONE == null) {
    CURRENT_ZONE = getCurrentTimezone();
  }
  return CURRENT_ZONE;
}

export class SimpleDateParser {
  /**
   * @param {Timezone} timezone
   */
  constructor (timezone) {
    /** @type {Timezone} */
    this.timezone = timezone;
  }

  /**
   * @param {string} string - The string to parse
   * @return {Date} - The date.
   */
  parse (string) {
    const regex = /[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}/g;

    if (regex.test(string)) {
      const zone = this.timezone === 'UTC' ? 'Z' : getCurrentZone();

      const date = new Date(`${string}${zone}`);
      if (isDateValid(date)) {
        return date;
      }
    }
    throw new Error(`Invalid date "${string}"`);
  }
}
