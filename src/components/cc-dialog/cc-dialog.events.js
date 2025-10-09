import { CcEvent } from '../../lib/events.js';

/**
 * Dispatched when the dialog is opened.
 *
 * @extends {CcEvent}
 */
export class CcDialogOpenEvent extends CcEvent {
  static TYPE = 'cc-dialog-open';

  constructor() {
    super(CcDialogOpenEvent.TYPE);
  }
}

/**
 * Dispatched when the dialog is closed.
 *
 * @extends {CcEvent}
 */
export class CcDialogCloseEvent extends CcEvent {
  static TYPE = 'cc-dialog-close';

  constructor() {
    super(CcDialogOpenEvent.TYPE);
  }
}

export class CcLostFocusEvent extends CcEvent {
  static TYPE = 'cc-lost-focus';

  constructor() {
    super(CcLostFocusEvent.TYPE);
  }
}
