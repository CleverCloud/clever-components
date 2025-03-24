import { CcEvent } from '../events.js';

/**
 * @typedef {import('./form.types.js').FormValidity} FormValidity
 * @typedef {import('./form.types.js').FormDataMap} FormSubmittedData
 * @typedef {import('./validation.types.js').ErrorMessage} ErrorMessage
 */

/**
 * Fires when the form is valid
 * @extends {CcEvent<FormValidity>}
 */
export class CcFormInvalidEvent extends CcEvent {
  static TYPE = 'cc-form-invalid';

  /**
   * @param {FormValidity} detail
   */
  constructor(detail) {
    super(CcFormInvalidEvent.TYPE, detail);
  }
}

/**
 * Fires when the delete button is clicked.
 * @extends {CcEvent<FormSubmittedData>}
 */
export class CcFormValidEvent extends CcEvent {
  static TYPE = 'cc-form-valid';

  /**
   * @param {FormSubmittedData} detail
   */
  constructor(detail) {
    super(CcFormValidEvent.TYPE, detail);
  }
}

/**
 * Fires when the `errorMessage` property of a form control element changes
 * @extends {CcEvent<ErrorMessage|null>}
 */
export class CcErrorMessageChangeEvent extends CcEvent {
  static TYPE = 'cc-error-message-change';

  /**
   * @param {ErrorMessage|null} detail
   */
  constructor(detail) {
    super(CcErrorMessageChangeEvent.TYPE, detail);
  }
}
