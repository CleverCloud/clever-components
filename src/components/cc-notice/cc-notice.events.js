import { CcEvent } from '../../lib/events.js';

/**
 * Fires when the notice is dismissed.
 * @extends {CcEvent<undefined>}
 */
export class CcNoticeDismissEvent extends CcEvent {
  static TYPE = 'cc-notice-dismiss';

  constructor() {
    super(CcNoticeDismissEvent.TYPE, undefined);
  }
}
