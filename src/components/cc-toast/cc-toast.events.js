import { CcEvent } from '../../lib/events.js';

/**
 * Dispatched when a toast is dismissed.
 * @extends {CcEvent<void>}
 */
export class CcToastDismissEvent extends CcEvent {
  static TYPE = 'cc-toast-dismiss';

  constructor() {
    super(CcToastDismissEvent.TYPE);
  }
}
