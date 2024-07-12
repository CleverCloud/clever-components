/**
 * @typedef {import('./cc-logs-application-view.types.js').DateRange} DateRange
 * @typedef {import('./cc-logs-application-view.types.js').DateRangeSelection} DateRangeSelection
 */

import { getRangeToNow, lastXDays, today, yesterday } from './date-range.js';

/**
 * @param {DateRangeSelection} dateRangeSelection
 * @return {DateRange}
 */
export function dateRangeSelectionToDateRange(dateRangeSelection) {
  switch (dateRangeSelection.type) {
    case 'custom':
      return {
        since: dateRangeSelection.since,
        until: dateRangeSelection.until,
      };
    case 'live':
      return {
        since: getRangeToNow(1000 * 60 * 10).since,
      };
    case 'predefined':
      switch (dateRangeSelection.def) {
        case 'lastHour':
          return getRangeToNow(1000 * 60 * 60);
        case 'last4Hours':
          return getRangeToNow(1000 * 60 * 60 * 4);
        case 'last7Days':
          return lastXDays(7);
        case 'today':
          return today();
        case 'yesterday':
          return yesterday();
      }
  }
}
