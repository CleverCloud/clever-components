import { CcEvent } from '../../lib/events.js';

/**
 * Dispatched when a notice has been dismissed.
 * @extends {CcEvent}
 */
export class CcNoticeDismissEvent extends CcEvent {
  static TYPE = 'cc-notice-dismiss';

  constructor() {
    super(CcNoticeDismissEvent.TYPE);
  }
}
