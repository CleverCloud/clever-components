import { CcEvent } from '../../lib/events.js';

/**
 * @import { LogsOptionsChangeEventData } from './cc-logs-control.types.js'
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
