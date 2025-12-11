import { CcEvent } from '../../lib/events.js';

/**
 * Dispatched when the user confirms using the enter key from the input field or by clicking the confirm button.
 *
 * @extends {CcEvent}
 */
export class CcDialogConfirmEvent extends CcEvent {
  static TYPE = 'cc-dialog-confirm';

  constructor() {
    super(CcDialogConfirmEvent.TYPE);
  }
}
