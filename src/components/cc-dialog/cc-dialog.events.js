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
    super(CcDialogCloseEvent.TYPE);
  }
}

/**
 * Dispatched when the user confirms using the submit button
 *
 * @extends {CcEvent}
 */
export class CcDialogConfirmEvent extends CcEvent {
  static TYPE = 'cc-dialog-confirm';

  constructor() {
    super(CcDialogConfirmEvent.TYPE);
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
