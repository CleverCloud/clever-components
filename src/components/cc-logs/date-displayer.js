import { DateFormatter } from '../../lib/date/date-formatter.js';
import { MemoryCache } from '../../lib/memory-cache.js';

/**
 * @typedef {import('./date-display.types.js').DateDisplay} DateDisplay
 * @typedef {import('../../lib/date-tmp/date.types.js').DateFormattedPart} DateFormattedPart
 * @typedef {import('../../lib/date-tmp/date.types.js').DateFormattedParts} DateFormattedParts
 * @typedef {import('../../lib/date-tmp/date.types.js').Timezone} Timezone
 */

/** @type {Array<DateFormattedPart>} */
const DATE_FORMATTED_PARTS = ['date', 'separator', 'time', 'millisecond', 'timezone'];

/** @type {Array<DateDisplay>} */
export const DATE_DISPLAYS = ['none', 'datetime-iso', 'time-iso', 'datetime-short', 'time-short'];

/** @type {Array<Timezone>} */
export const TIMEZONES = ['local', 'UTC'];

/**
 * A date displayer using DateFormatter internally.
 */
export class DateDisplayer {
  /**
   * @param {DateDisplay} display
   * @param {Timezone} timezone
   */
  constructor (display, timezone) {
    /** @type {DateDisplay} */
    this._display = display;

    /** @type {Timezone} */
    this._timezone = timezone;

    /** @type {boolean} */
    this._isDateIncluded = this.display === 'datetime-iso' || this.display === 'datetime-short';

    const isIso = this.display === 'datetime-iso' || this.display === 'time-iso';
    const dateFormat = isIso ? 'datetime-iso' : 'datetime-short';
    this._dateFormatter = new DateFormatter(dateFormat, this.timezone);

    /** @type {MemoryCache<Date, DateFormattedParts>} */
    this._cache = new MemoryCache((date) => this._getFormatToParts(date), 1000, (date) => date.getTime());
  }

  /**
   * @return {DateDisplay}
   */
  get display () {
    return this._display;
  }

  /**
   * @return {Timezone}
   */
  get timezone () {
    return this._timezone;
  }

  /**
   * @param {Date} date - The date to format
   * @return {string} - The date formatted according to the format specified in constructor.
   */
  format (date) {
    if (this.display === 'none') {
      return '';
    }

    const parts = this.formatToParts(date);

    return DATE_FORMATTED_PARTS
      .map((part) => parts[part])
      .filter((partValue) => partValue != null)
      .join('');
  }

  /**
   * @param {Date} date - The date to format
   * @param {(part: DateFormattedPart, partValue: string) => *} mapper - The function to apply to each part
   * @return {Array} - The array resulting of the transformation of the given `mapper` on each part
   */
  formatAndMapParts (date, mapper) {
    if (this.display === 'none') {
      return [];
    }

    const parts = this.formatToParts(date);

    return DATE_FORMATTED_PARTS
      .map((part) => [part, parts[part]])
      .filter(([_, partValue]) => partValue != null)
      .map(([part, partValue]) => mapper(part, partValue));
  }

  /**
   * @param {Date} date - The date to format
   * @return {DateFormattedParts|{}}
   */
  formatToParts (date) {
    if (this._display === 'none') {
      return {};
    }

    return this._cache.get(date);
  }

  /**
   * @param {Date} date - The date to format
   * @return {DateFormattedParts}
   */
  _getFormatToParts (date) {
    const dateFormattedParts = this._dateFormatter.formatToParts(date);

    if (!this._isDateIncluded) {
      delete dateFormattedParts.date;
      delete dateFormattedParts.separator;
    }

    return dateFormattedParts;
  }
}
