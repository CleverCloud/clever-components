import { CcEvent } from './events.js';

/**
 * @typedef {import('../components/common.types.js').Notification} Notification
 */

/**
 * @extends {CcEvent<Notification>}
 */
export class CcNotifyEvent extends CcEvent {
  static TYPE = 'cc-notify';

  /**
   * @param {Notification} detail
   */
  constructor(detail) {
    super(CcNotifyEvent.TYPE, detail);
  }
}
