import { CcEvent } from '../../lib/events.js';

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
