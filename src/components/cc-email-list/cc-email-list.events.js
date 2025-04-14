import { CcEvent } from '../../lib/events.js';

/**
 * Dispatched when an email address addition is requested.
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
 * Dispatched when an email address deletion is requested.
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
 * Dispatched when a primary email address change is requested.
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
 * Dispatched when a confirmation email send is requested.
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
