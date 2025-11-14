import { CcEvent } from '../../lib/events.js';

/**
 * @import { Log } from './cc-logs.types.js'
 */

/**
 * Dispatched when the logs follow state changed after a user interaction.
 * @extends {CcEvent<boolean>}
 */
export class CcLogsFollowChangeEvent extends CcEvent {
  static TYPE = 'cc-logs-follow-change';

  /**
   * @param {boolean} detail
   */
  constructor(detail) {
    super(CcLogsFollowChangeEvent.TYPE, detail);
  }
}

/**
 * Dispatched when log inspect is requested
 * @extends {CcEvent<Log>}
 */
export class CcLogInspectEvent extends CcEvent {
  static TYPE = 'cc-log-inspect';

  /**
   * @param {Log} detail
   */
  constructor(detail) {
    super(CcLogInspectEvent.TYPE, detail);
  }
}
