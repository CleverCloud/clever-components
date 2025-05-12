import { CcEvent } from '../../lib/events.js';

/**
 * @typedef {import('./cc-logs-date-range-selector.types.js').LogsDateRangeSelectionChangeEventData} LogsDateRangeSelectionChangeEventData
 */

/**
 * Dispatched when the logs date range selection changes.
 * @extends {CcEvent<LogsDateRangeSelectionChangeEventData>}
 */
export class CcLogsDateRangeSelectionChangeEvent extends CcEvent {
  static TYPE = 'cc-logs-date-range-selection-change';

  /**
   * @param {LogsDateRangeSelectionChangeEventData} detail
   */
  constructor(detail) {
    super(CcLogsDateRangeSelectionChangeEvent.TYPE, detail);
  }
}
