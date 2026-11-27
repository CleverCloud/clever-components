/**
 * @import { LogsDateRangeSelection, LogsDateRangePresetType } from './cc-logs-date-range-selector.types.js'
 * @import { DateRange } from '../../lib/date/date-range.types.js'
 */

import { getRangeToNow, lastXDays, today, yesterday } from '../../lib/date/date-range-utils.js';
import { isDateValid } from '../../lib/date/date-utils.js';

/**
 * All the presets, in display order.
 * Must stay in sync with `LogsDateRangePresetType` and with `dateRangeSelectionToDateRange()`.
 *
 * @type {Array<LogsDateRangePresetType>}
 */
export const PRESETS = ['lastHour', 'last4Hours', 'today', 'yesterday', 'last7Days'];

/**
 * Tells whether the given value is a well-formed date range selection.
 *
 * Integrators usually restore the selection from a persisted setting, which may hold a malformed value
 * (e.g. `{ type: 'preset' }` without `preset`). Such a value cannot be turned into a date range.
 *
 * @param {any} dateRangeSelection
 * @return {dateRangeSelection is LogsDateRangeSelection}
 */
export function isDateRangeSelectionValid(dateRangeSelection) {
  switch (dateRangeSelection?.type) {
    case 'live':
      return true;
    case 'preset':
      return PRESETS.includes(dateRangeSelection.preset);
    case 'custom':
      return isDateStringValid(dateRangeSelection.since) && isDateStringValid(dateRangeSelection.until);
    default:
      return false;
  }
}

/**
 * Turns the given value into a well-formed date range selection.
 *
 * - a valid selection is returned as is,
 * - a `preset` selection with a missing or unknown preset falls back to the first preset,
 * - any other malformed value gives `null`, so that the caller applies its own default.
 *
 * A malformed (non-null) value is reported with a warning.
 *
 * @param {any} dateRangeSelection
 * @return {LogsDateRangeSelection|null}
 */
export function sanitizeDateRangeSelection(dateRangeSelection) {
  if (dateRangeSelection == null) {
    return null;
  }
  if (isDateRangeSelectionValid(dateRangeSelection)) {
    return dateRangeSelection;
  }

  warnInvalidDateRangeSelection(dateRangeSelection);

  if (dateRangeSelection.type === 'preset') {
    return { type: 'preset', preset: PRESETS[0] };
  }
  return null;
}

/**
 * @param {any} value
 * @return {boolean}
 */
function isDateStringValid(value) {
  return typeof value === 'string' && isDateValid(new Date(value));
}

/**
 * Warns that the given date range selection is malformed and has been ignored.
 *
 * @param {any} dateRangeSelection
 */
export function warnInvalidDateRangeSelection(dateRangeSelection) {
  console.warn("Ignoring malformed date range selection. You've got", dateRangeSelection);
}

/**
 * Returns the date range corresponding to the given selection.
 *
 * Note that a `live` selection gives à 10 minutes window until now.
 *
 * @param {LogsDateRangeSelection} dateRangeSelection
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
    case 'preset':
      switch (dateRangeSelection.preset) {
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
