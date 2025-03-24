import { CcEvent } from '../../lib/events.js';

/**
 * Fires when the date range selection changes.
 * @extends {CcEvent<import('./cc-logs-date-range-selector.types.js').LogsDateRangeSelectionChangeEventData>}
 */
export class CcLogsDateRangeSelectionChangeEvent extends CcEvent {
  static TYPE = 'cc-logs-date-range-selection-change';

  /**
   * @param {import('./cc-logs-date-range-selector.types.js').LogsDateRangeSelectionChangeEventData} detail
   */
  constructor(detail) {
    super(CcLogsDateRangeSelectionChangeEvent.TYPE, detail);
  }
}
