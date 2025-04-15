import { CcEvent } from '../../lib/events.js';

/**
 * @typedef {import('./cc-logs-control.types.js').LogsOptionsChangeEventData} LogsOptionsChangeEventData
 */

/**
 * Dispatched when the logs options have changed.
 * @extends {CcEvent<LogsOptionsChangeEventData>}
 */
export class CcLogsOptionsChangeEvent extends CcEvent {
  static TYPE = 'cc-logs-options-change';

  /**
   * @param {LogsOptionsChangeEventData} detail
   */
  constructor(detail) {
    super(CcLogsOptionsChangeEvent.TYPE, detail);
  }
}
