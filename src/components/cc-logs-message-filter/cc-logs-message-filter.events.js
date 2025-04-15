import { CcEvent } from '../../lib/events.js';

/**
 * @typedef {import('./cc-logs-message-filter.types.js').LogsMessageFilterValue} LogsMessageFilterValue
 */

/**
 * Dispatched when the logs message filter changes.
 * @extends {CcEvent<LogsMessageFilterValue>}
 */
export class CcLogsMessageFilterChangeEvent extends CcEvent {
  static TYPE = 'cc-logs-message-filter-change';

  /**
   * @param {LogsMessageFilterValue} detail
   */
  constructor(detail) {
    super(CcLogsMessageFilterChangeEvent.TYPE, detail);
  }
}
