import { dispatchCustomEvent } from '../../../lib/events.js';

/**
 * @typedef {import('./validation.types.js').Validation} Validation
 * @typedef {import('./validation.types.js').Validator} Validator
 */

export class ValidationController {
  /**
   * @param host
   * @param {string} errorMessageProp
   */
  constructor (host, errorMessageProp) {
    this._host = host;
    host.addController(this);
    /** @type {string} */
    this._errorMessageProp = errorMessageProp;
  }

  /**
   * @param {Validator} validator
   * @param {any} value
   * @param {boolean} report
   * @param {(code: string) => string} customErrorMessagesProvider
   * @return {Validation}
   */
  validate (validator, value, report, customErrorMessagesProvider) {
    const validationResult = validator.validate(value);

    if (report) {
      const errorMessage = validationResult.valid
        ? null
        : this._getErrorMessage(validator, validationResult.code, customErrorMessagesProvider);

      if (errorMessage !== this._host[this._errorMessageProp]) {
        this._host[this._errorMessageProp] = errorMessage;
        dispatchCustomEvent(this._host, 'error-message-change', errorMessage);
      }
    }

    return validationResult;
  }

  /**
   * @param {Validator} validator
   * @param {string} code
   * @param {(code: string) => string} customErrorMessagesProvider
   * @return {string}
   */
  _getErrorMessage (validator, code, customErrorMessagesProvider) {
    return customErrorMessagesProvider?.(code) ?? validator.getErrorMessage(code);
  }
}
