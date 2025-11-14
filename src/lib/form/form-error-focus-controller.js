import { focusFirstFormControlWithError } from './form-utils.js';

/**
 * @import { LitElement } from 'lit'
 * @import { Ref } from 'lit/directives/ref.js'
 */

/**
 * This reactive controller handles the focus after a form submission.
 * When there is an error, it waits for the next render and then focus the first form control with error.
 */
export class FormErrorFocusController {
  /**
   *
   * @param {LitElement} host
   * @param {Ref<HTMLFormElement>} formRef
   * @param {() => Object} getErrors
   */
  constructor(host, formRef, getErrors) {
    this._host = host;
    this._host.addController(this);
    this._formRef = formRef;
    this._getErrors = getErrors;
  }

  hostUpdated() {
    const errors = this._getErrors();
    if (errors != null && Object.values(errors).some((value) => value != null)) {
      this._host.updateComplete.then(() => {
        focusFirstFormControlWithError(this._formRef.value);
      });
    }
  }
}
