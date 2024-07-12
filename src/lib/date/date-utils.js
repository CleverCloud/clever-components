import { clampNumber } from '../utils.js';

/**
 * @typedef {import('./date.types.js').Timezone} Timezone
 */

export const SECOND = 1000;
export const MINUTE = 60_000;
export const HOUR = 3_600_000;
export const DAY = 86_400_000;

/**
 * Clones the given date
 *
 * @param {Date} date
 * @return {Date}
 */
export function cloneDate(date) {
  return new Date(date.getTime());
}

/**
 * Checks whether the given object is a valid Date.
 *
 * @param {any} object
 * @return {object is Date}
 */
export function isDateValid(object) {
  return object instanceof Date && !isNaN(object.getTime());
}

/**
 * Return the date bounded into the given min and max bounds.
 * @param {Date} date
 * @param {Date|null|undefined} [min]
 * @param {Date|null|undefined} [max]
 * @return {Date}
 */
export function clampDate(date, min, max) {
  return new Date(clampNumber(date.getTime(), min?.getTime(), max?.getTime()));
}

/**
 * @param {number} year
 * @param {number} month
 * @return {number}
 */
export function getNumberOfDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

// region Date shift
const DATE_SHIFTER = {
  Y: function (date, offset) {
    const d = cloneDate(date);
    const nextYear = date.getUTCFullYear() + offset;
    let nextDay = date.getUTCDate();

    // special case for february and leap years
    if (nextDay > 28) {
      nextDay = Math.min(nextDay, getNumberOfDaysInMonth(nextYear, date.getUTCMonth()));
      d.setUTCDate(nextDay);
    }
    d.setUTCFullYear(nextYear);

    return d;
  },
  M: function (date, offset) {
    const d = cloneDate(date);

    const yearsOffset = Math.floor(offset / 12);
    const monthsOffset = offset - yearsOffset * 12;

    const nextYear = date.getUTCFullYear() + yearsOffset;
    const nextMonth = date.getUTCMonth() + monthsOffset;
    let nextDay = date.getUTCDate();

    // special case for february and leap years
    if (nextDay > 28) {
      nextDay = Math.min(nextDay, getNumberOfDaysInMonth(nextYear, nextMonth));
      d.setUTCDate(nextDay);
    }

    d.setUTCFullYear(nextYear);
    d.setUTCMonth(nextMonth);

    return d;
  },

  D: function (date, offset) {
    return DATE_SHIFTER._shift(date, offset * DAY);
  },
  H: function (date, offset) {
    return DATE_SHIFTER._shift(date, offset * HOUR);
  },
  m: function (date, offset) {
    return DATE_SHIFTER._shift(date, offset * MINUTE);
  },
  s: function (date, offset) {
    return DATE_SHIFTER._shift(date, offset * SECOND);
  },
  S: function (date, offset) {
    return DATE_SHIFTER._shift(date, offset);
  },
  _shift: function (date, offset) {
    return new Date(date.getTime() + offset);
  },
};

/**
 * Shifts a date field by the given amount.
 * The given date is not mutated.
 *
 * @param {Date} date
 * @param {'Y'|'M'|'D'|'H'|'m'|'s'|'S'} field the date field to shift
 * @param {number} offset the shifting offset
 * @return {Date}
 */
export function shiftDateField(date, field, offset) {
  const shift = DATE_SHIFTER[field];
  if (shift == null) {
    throw new Error(`Cannot shift field "${field}".`);
  }
  return shift(date, offset);
}

// endregion

// region Date parse

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}(Z|[+-]\d{2}:\d{2})$/;

/**
 * Parses a string with the ISO date format: YYYY-MM-DDTHH:mm:SS.sssZ
 *
 * @param {string} string - The string to parse
 * @return {Date} - The date.
 * @throws {Error} Whenever the given string is not a valid ISO date.
 */
export function parseIsoDateString(string) {
  return parseDate(string, ISO_DATE_REGEX, () => new Date(string));
}

const SIMPLE_DATE_REGEX = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

/**
 * Parses a string with the simple date format: YYYY-MM-DD HH:mm:SS
 *
 * @param {string} string - The string to parse
 * @param {Timezone} timezone - The timezone
 * @return {Date} - The date.
 * @throws {Error} Whenever the given string is not a valid simple date.
 */
export function parseSimpleDateString(string, timezone) {
  return parseDate(string, SIMPLE_DATE_REGEX, () => new Date(`${string}${timezone === 'UTC' ? 'Z' : ''}`));
}

/**
 * Helper that parses the given string using the given RegExp.
 *
 * @param {string} string - The string to parse
 * @param {RegExp} regex - The regex to use
 * @param {() => Date} fn - A function that creates the Date object
 * @return {Date} - The date.
 * @throws {Error} Whenever the given string is not a valid date according to the given Regex.
 */
function parseDate(string, regex, fn) {
  if (string.match(regex)) {
    const date = fn();
    if (isDateValid(date)) {
      return date;
    }
  }
  throw new Error(`Invalid date "${string}"`);
}

// endregion
