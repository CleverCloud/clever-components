import { dispatchCustomEvent } from '../../../lib/events.js';

export class ValidationController {
  constructor (host, errorMessageProp) {
    host.addController(this);
    this._host = host;
    this._errorMessageProp = errorMessageProp;
  }

  _setErrorMessage (errorMessage) {
    if (errorMessage !== this._host[this._errorMessageProp]) {
      this._host[this._errorMessageProp] = errorMessage;
      dispatchCustomEvent(this._host, 'error-message-change', errorMessage);
    }
  }

  _getErrorMessage (validator, code, customErrorMessagesFn) {
    return customErrorMessagesFn?.(code) ?? validator.getErrorMessage(code);
  }

  validate (validator, value, report, customErrorMessagesFn) {
    const validationResult = validator.validate(value);

    if (report) {
      const errorMessage = validationResult.valid
        ? null
        : this._getErrorMessage(validator, validationResult.code, customErrorMessagesFn);

      this._setErrorMessage(errorMessage);
    }

    return validationResult;
  }
}
