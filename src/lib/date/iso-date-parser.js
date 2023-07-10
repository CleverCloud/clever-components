import { isDateValid } from './date-utils.js';

export class IsoDateParser {
  /**
   * @param {string} string - The string to parse
   * @return {Date} - The date.
   */
  parse (string) {
    const regex = /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}(Z|[+-][0-9]{2}:[0-9]{2})/g;

    if (regex.test(string)) {
      const date = new Date(string);
      if (isDateValid(date)) {
        return date;
      }
    }
    throw new Error(`Invalid date "${string}"`);
  }
}
