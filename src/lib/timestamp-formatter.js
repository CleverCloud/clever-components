import { MemoryCache } from './memory-cache.js';

/**
 * @typedef {import('./timestamp-formatter.types.js').TimestampFormattedPart} TimestampFormattedPart
 * @typedef {import('./timestamp-formatter.types.js').TimestampDisplay} TimestampDisplay
 * @typedef {import('.lib/timestamp-formatter.types.js').Timezone} Timezone
 */

/** @type {Array<TimestampFormattedPart>} */
export const TIMESTAMP_FORMATTED_PARTS = ['date', 'separator', 'time', 'milliseconds', 'timezone'];

/** @type {Array<TimestampDisplay>} */
export const TIMESTAMP_DISPLAYS = ['none', 'datetime-iso', 'time-iso', 'datetime-short', 'time-short'];

/** @type {Array<Timezone>} */
export const TIMEZONES = ['local', 'UTC'];

export class TimestampFormatter {
  /**
   * @param {TimestampDisplay} timestampDisplay
   * @param {Timezone} timezone
   */
  constructor (timestampDisplay, timezone) {
    /** @type {TimestampDisplay} */
    this.display = timestampDisplay;
    /** @type {Timezone} */
    this.timezone = timezone;

    this.isIso = this.display === 'datetime-iso' || this.display === 'time-iso';

    this.isDateIncluded = this.display === 'datetime-iso' || this.display === 'datetime-short';
    this.isMillisIncluded = this.isIso;
    this.isZoneOffsetIncluded = this.isIso;

    /** @type {MemoryCache<Timezone, DateTimeFormat>} */
    this._dateTimeFormatCache = new MemoryCache((timezone) => this._getDateTimeFormat(timezone));
    /** @type {MemoryCache<number, {[p: TimestampFormattedPart]: string}>} */
    this._cache = new MemoryCache((timestamp) => this._getFormatToParts(timestamp), 1000);
  }

  /**
   * @param {number} timestamp - The timestamp to format
   * @return {string} - The timestamp formatted according to the format specified in constructor.
   */
  format (timestamp) {
    if (this.display === 'none') {
      return '';
    }

    const parts = this.formatToParts(timestamp);

    return TIMESTAMP_FORMATTED_PARTS
      .map((part) => parts[part])
      .filter((partValue) => partValue != null)
      .join('');
  }

  /**
   * @param {number} timestamp - The timestamp to format
   * @param {(part: TimestampFormattedPart, partValue: string) => *} mapper - The function to apply to each part
   * @return {Array} - The array resulting of the transformation of the given `mapper` on each part
   */
  formatAndMapParts (timestamp, mapper) {
    if (this.display === 'none') {
      return [];
    }

    const parts = this.formatToParts(timestamp);

    return TIMESTAMP_FORMATTED_PARTS
      .map((part) => [part, parts[part]])
      .filter(([_, partValue]) => partValue != null)
      .map(([part, partValue]) => mapper(part, partValue));
  }

  /**
   * @param {number} timestamp - The timestamp to format
   * @return {{[p: TimestampFormattedPart]: string}}
   */
  formatToParts (timestamp) {
    if (this.display === 'none') {
      return {};
    }

    return this._cache.get(timestamp);
  }

  /**
   * @param {number} timestamp - The timestamp to format
   * @return {{[p: TimestampFormattedPart]: string}}
   */
  _getFormatToParts (timestamp) {
    const dtf = this._dateTimeFormatCache.get(this.timezone);

    const datePartsArray = dtf.formatToParts(new Date(timestamp));
    const dateParts = Object.fromEntries(datePartsArray.map(({ type, value }) => [type, value]));

    const result = {
      time: `${dateParts.hour}:${dateParts.minute}:${dateParts.second}`,
    };

    if (this.isMillisIncluded) {
      result.milliseconds = `.${dateParts.fractionalSecond}`;
    }

    if (this.isZoneOffsetIncluded) {
      result.timezone = (dateParts.timeZoneName === 'GMT') ? 'Z' : dateParts.timeZoneName.slice(3);
    }

    if (!this.isDateIncluded) {
      return result;
    }

    result.separator = this.isIso ? 'T' : ' ';
    result.date = `${dateParts.year}-${dateParts.month}-${dateParts.day}`;

    return result;
  }

  /**
   * @param {Timezone} timezone
   * @return {Intl.DateTimeFormat}
   */
  _getDateTimeFormat (timezone) {
    return new Intl.DateTimeFormat('en', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3,
      timeZoneName: 'longOffset',
      timeZone: (timezone === 'local') ? undefined : timezone,
    });
  }
}
