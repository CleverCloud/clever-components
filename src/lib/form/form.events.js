import { CcEvent } from '../events.js';

/**
 * @typedef {import('./form.types.js').FormValidity} FormValidity
 * @typedef {import('./form.types.js').FormDataMap} FormSubmittedData
 * @typedef {import('./validation.types.js').ErrorMessage} ErrorMessage
 */

/**
 * Dispatched when a form is submitted with invalid state.
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
 * Dispatched when a form is submitted with valid state.
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
