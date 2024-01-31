/**
 * @typedef {import('./cc-logs-application-view.types.js').DateRange} DateRange
 */

/**
 * @typedef {Object} RawDateRange
 * @property {Date} since
 * @property {Date} [until]
 */

import { shiftDateField } from '../../lib/date/date-utils.js';

/**
 * @param {number} duration
 * @return {DateRange}
 */
export function getRangeToNow (duration) {
  const now = new Date();
  return toDateRange({
    since: new Date(now.getTime() - duration),
    until: now,
  });
}

/**
 *
 * @param {DateRange|RawDateRange} dateRange
 */
export function isLive (dateRange) {
  return dateRange.until == null;
}

/**
 * @return {DateRange}
 */
export function today () {
  const start = new Date();
  start.setUTCHours(0);
  start.setUTCMinutes(0);
  start.setUTCSeconds(0);
  start.setUTCMilliseconds(0);
  return {
    since: start.toISOString(),
    until: new Date().toISOString(),
  };
}

/**
 * @return {DateRange}
 */
export function yesterday () {
  const todayStart = new Date();
  todayStart.setUTCHours(0);
  todayStart.setUTCMinutes(0);
  todayStart.setUTCSeconds(0);
  todayStart.setUTCMilliseconds(0);
  const yesterdayStart = new Date(todayStart.getTime() - 86_400_000);
  const yesterdayEnd = new Date(todayStart.getTime() - 1);

  return {
    since: yesterdayStart.toISOString(),
    until: yesterdayEnd.toISOString(),
  };
}

/**
 * @param {number} numberOfDays
 * @return {DateRange}
 */
export function lastXDays (numberOfDays) {
  const start = shiftDateField(new Date(), 'D', -numberOfDays);
  start.setUTCHours(0);
  start.setUTCMinutes(0);
  start.setUTCSeconds(0);
  start.setUTCMilliseconds(0);
  return {
    since: start.toISOString(),
    until: new Date().toISOString(),
  };
}

/**
 *
 * @param {DateRange} dateRange
 * @param {'left'|'right'} direction
 * @return {DateRange}
 */
export function shiftDateRange (dateRange, direction) {
  if (isLive(dateRange)) {
    throw new Error('Cannot shift an unbounded date range');
  }

  return toDateRange(shiftRawDateRange(toRawDateRange(dateRange), direction));
}

/**
 *
 * @param {DateRange} dateRange
 * @return {boolean}
 */
export function isRightDateRangeAfterNow (dateRange) {
  const rightDateRange = shiftRawDateRange(toRawDateRange(dateRange), 'right');
  return rightDateRange.until.getTime() > new Date().getTime();
}

/**
 *
 * @param {RawDateRange} dateRange
 * @param {'left'|'right'} direction
 * @return {RawDateRange}
 */
function shiftRawDateRange (dateRange, direction) {
  if (isLive(dateRange)) {
    throw new Error('Cannot shift an unbounded date range');
  }

  const start = dateRange.since.getTime();
  const end = dateRange.until.getTime();
  const duration = end - start;

  switch (direction) {
    case 'left':
      return {
        since: new Date(start - duration),
        until: dateRange.since,
      };
    case 'right':
      return {
        since: dateRange.until,
        until: new Date(end + duration),
      };
  }
}

/**
 * @param {DateRange} dateRange
 * @return {RawDateRange}
 */
function toRawDateRange (dateRange) {
  return {
    since: new Date(dateRange.since),
    until: dateRange.until == null ? null : new Date(dateRange.until),
  };
}

/**
 * @param {RawDateRange} dateRange
 * @return {DateRange}
 */
function toDateRange (dateRange) {
  return {
    since: dateRange.since.toISOString(),
    until: dateRange.until == null ? null : dateRange.until.toISOString(),
  };
}
