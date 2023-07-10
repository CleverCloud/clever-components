import { bindNumber } from '../utils.js';

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
export function cloneDate (date) {
  return new Date(date.getTime());
}

/**
 * Checks whether the given object is a valid Date.
 *
 * @param {any} object
 * @return {boolean}
 */
export function isDateValid (object) {
  return object instanceof Date && !isNaN(object);
}

/**
 * Return the date bounded into the given min and max bounds.
 * @param {Date} date
 * @param {Date|null|undefined} [min]
 * @param {Date|null|undefined} [max]
 * @return {Date}
 */
export function bindDate (date, min, max) {
  return new Date(bindNumber(date.getTime(), min?.getTime(), max?.getTime()));
}

/**
 * @param {number} year
 * @param {number} month
 * @return {number}
 */
export function getNumberOfDaysInMonth (year, month) {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Shifts a date field by the given amount.
 * The given date is not mutated.
 *
 * @param {Date} date
 * @param {'Y'|'M'|'D'|'H'|'m'|'s'|'S'} field the date field to shift
 * @param {number} offset the shifting offset
 * @return {Date}
 */
export function shiftDateField (date, field, offset) {
  const shift = DateShifter[field];
  if (shift == null) {
    throw new Error(`Cannot shift field "${field}".`);
  }
  return shift(date, offset);
}

const DATETIME_FORMAT_FOR_CURRENT_TIMEZONE = new Intl.DateTimeFormat('en', { timeZoneName: 'longOffset' });

export function getCurrentTimezone () {
  const datePartsArray = DATETIME_FORMAT_FOR_CURRENT_TIMEZONE.formatToParts(new Date());
  const dateParts = Object.fromEntries(datePartsArray.map(({ type, value }) => [type, value]));
  return (dateParts.timeZoneName === 'GMT') ? 'Z' : dateParts.timeZoneName.slice(3);
}

class DateShifter {
  static Y (date, offset) {
    const d = cloneDate(date);
    const nextYear = date.getUTCFullYear() + offset;
    let nextDay = date.getUTCDate();

    if (nextDay > 28) {
      nextDay = Math.min(nextDay, getNumberOfDaysInMonth(nextYear, date.getUTCMonth()));
      d.setUTCDate(nextDay);
    }
    d.setUTCFullYear(nextYear);

    return d;
  }

  static M (date, offset) {
    const d = cloneDate(date);

    const yearsOffset = Math.floor(offset / 12);
    const monthsOffset = offset - (yearsOffset * 12);

    const nextYear = date.getUTCFullYear() + yearsOffset;
    const nextMonth = date.getUTCMonth() + monthsOffset;
    let nextDay = date.getUTCDate();

    if (nextDay > 28) {
      nextDay = Math.min(nextDay, getNumberOfDaysInMonth(nextYear, nextMonth));
      d.setUTCDate(nextDay);
    }

    d.setUTCFullYear(nextYear);
    d.setUTCMonth(nextMonth);

    return d;
  }

  static D (date, offset) {
    return DateShifter._shift(date, offset * DAY);
  }

  static H (date, offset) {
    return DateShifter._shift(date, offset * HOUR);
  }

  static m (date, offset) {
    return DateShifter._shift(date, offset * MINUTE);
  }

  static s (date, offset) {
    return DateShifter._shift(date, offset * SECOND);
  }

  static S (date, offset) {
    return DateShifter._shift(date, offset);
  }

  static _shift (date, offset) {
    return new Date(date.getTime() + offset);
  }
}
