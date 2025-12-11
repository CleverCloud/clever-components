import { CcEvent } from './events.js';

/**
 * @import { Notification } from '../components/common.types.js'
 */

/**
 * Dispatched when a notification message is raised.
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
