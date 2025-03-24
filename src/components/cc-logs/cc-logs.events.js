import { CcEvent } from '../../lib/events.js';

/**
 * Fires whenever the follow changed because of a user interaction.
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
