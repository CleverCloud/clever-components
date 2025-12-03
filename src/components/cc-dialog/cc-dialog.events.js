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
 * Dispatched when you need to request the `cc-dialog` to close itself.
 * For instance, when the user clicks the cancel button.
 *
 * @extends {CcEvent}
 */
export class CcDialogCloseRequestEvent extends CcEvent {
  static TYPE = 'cc-dialog-close-request';

  constructor() {
    super(CcDialogCloseRequestEvent.TYPE);
  }
}

/**
 * Dispatched when the focus is lost.
 *
 * @extends {CcEvent<Element>}
 */
export class CcDialogFocusRestorationFail extends CcEvent {
  static TYPE = 'cc-dialog-focus-restoration-fail';

  /** @param {Element} element - the element that it tried to restore focus on */
  constructor(element) {
    super(CcDialogFocusRestorationFail.TYPE, element);
  }
}
