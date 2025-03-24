import { CcEvent } from '../../lib/events.js';

/**
 * Fires whenever the add button is clicked. If the validation doesn't succeed, the event is not fired.
 * @extends {CcEvent<string>}
 */
export class CcEmailAddEvent extends CcEvent {
  static TYPE = 'cc-email-add';

  /**
   * @param {string} detail
   */
  constructor(detail) {
    super(CcEmailAddEvent.TYPE, detail);
  }
}

/**
 * Fires whenever the delete button is clicked.
 * @extends {CcEvent<string>}
 */
export class CcEmailDeleteEvent extends CcEvent {
  static TYPE = 'cc-email-delete';

  /**
   * @param {string} detail
   */
  constructor(detail) {
    super(CcEmailDeleteEvent.TYPE, detail);
  }
}

/**
 * Fires whenever the 'mark as primary' button is clicked.
 * @extends {CcEvent<string>}
 */
export class CcEmailMarkAsPrimaryEvent extends CcEvent {
  static TYPE = 'cc-email-mark-as-primary';

  /**
   * @param {string} detail
   */
  constructor(detail) {
    super(CcEmailMarkAsPrimaryEvent.TYPE, detail);
  }
}

/**
 * Fires whenever the send confirmation email link is clicked.
 * @extends {CcEvent<string>}
 */
export class CcEmailSendConfirmationEvent extends CcEvent {
  static TYPE = 'cc-email-send-confirmation';

  /**
   * @param {string} detail
   */
  constructor(detail) {
    super(CcEmailSendConfirmationEvent.TYPE, detail);
  }
}
