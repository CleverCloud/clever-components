import { CcEvent } from '../../lib/events.js';

/**
 * Fires when the toast is dismissed.
 * @extends {CcEvent<undefined>}
 */
export class CcToastDismissEvent extends CcEvent {
  static TYPE = 'cc-toast-dismiss';

  constructor() {
    super(CcToastDismissEvent.TYPE, undefined);
  }
}
