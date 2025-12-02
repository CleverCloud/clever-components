import { CcEvent } from '../../lib/events.js';

/**
 * @import { LogsDateRangeSelectionChangeEventData } from './cc-logs-date-range-selector.types.js'
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
