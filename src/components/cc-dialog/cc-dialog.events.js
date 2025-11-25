import { CcEvent } from '../../lib/events.js';

/**
 * Dispatched when the dialog is closed.
 *
 * @extends {CcEvent}
 */
export class CcDialogCloseEvent extends CcEvent {
  static TYPE = 'cc-dialog-close';

  constructor() {
    super(CcDialogCloseEvent.TYPE);
  }
}

/**
 * Dispatched when the focus is lost.
 *
 * @extends {CcEvent}
 */
export class CcLostFocusEvent extends CcEvent {
  static TYPE = 'cc-lost-focus';

  constructor() {
    super(CcLostFocusEvent.TYPE);
  }
}
