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

/**
 * Dispatched when clearing of the logs is requested.
 * @extends {CcEvent}
 */
export class CcLogsClearEvent extends CcEvent {
  static TYPE = 'cc-logs-clear';

  constructor() {
    super(CcLogsClearEvent.TYPE);
  }
}
