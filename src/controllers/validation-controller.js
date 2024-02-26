import { dispatchCustomEvent } from '../lib/events.js';

/**
 * @typedef {import('../lib/validation/validation.types.js').Validation} Validation
 * @typedef {import('../lib/validation/validation.types.js').Validator} Validator
 * @typedef {import('../lib/validation/validation.types.js').ErrorMessageMap} ErrorMessageMap
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
   * @param {ErrorMessageMap} errorMessages
   * @return {Validation}
   */
  validate (validator, value, report, errorMessages) {
    const validationResult = validator.validate(value);

    const errorMessage = validationResult.valid
      ? null
      : this._getErrorMessage(validator, validationResult.code, errorMessages);

    if (validationResult.valid) {
      this._host._internals.setValidity({});
    }
    else {
      this._host._internals.setValidity(
        { customError: true },
        this._errorMessageToString(errorMessage),
        this._host._inputRef.value,
      );
    }

    if (report) {
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
   * @param {ErrorMessageMap} customErrorMessages
   * @return {ErrorMessage}
   */
  _getErrorMessage (validator, code, customErrorMessages) {
    if (customErrorMessages != null && Object.hasOwn(customErrorMessages, code)) {
      return customErrorMessages[code];
    }

    if (validator.getErrorMessage != null && typeof validator.getErrorMessage === 'function') {
      return validator.getErrorMessage(code);
    }

    return code;
  }

  /**
   *
   * @param {ErrorMessage} message
   * @return {string}
   */
  _errorMessageToString (message) {
    if (message == null) {
      return '';
    }

    if (typeof message === 'string') {
      return message;
    }

    if (message instanceof Node) {
      // todo: this is the proper way to get the best text corresponding to the string error message (it handles <br> => \n)
      const div = document.createElement('div');
      div.style.width = '0';
      div.style.height = '0';
      div.appendChild(message.cloneNode(true));
      document.body.appendChild(div);
      const result = div.innerText;
      div.remove();
      return result;

      // this is the simplest way, but we don't get the <br> replaced by \n
      // return message.textContent;
    }

    return message.toString();
  }
}
