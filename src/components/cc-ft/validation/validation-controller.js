import { dispatchCustomEvent } from '../../../lib/events.js';
import { i18n } from '../../../lib/i18n.js';

export class ValidationController {
  constructor (host, errorMessageProp) {
    host.addController(this);
    this._host = host;
    this._errorMessageProp = errorMessageProp;
  }

  _getErrorMessage (errorCode) {
    if (errorCode === 'empty') {
      return i18n('validation-controller.error.empty');
    }

    if (errorCode === 'badEmail') {
      return i18n('validation-controller.error.bad-email');
    }
  }

  _setErrorMessage (errorMessage) {
    if (errorMessage !== this._host[this._errorMessageProp]) {
      this._host[this._errorMessageProp] = errorMessage;
      dispatchCustomEvent(this._host, 'error-message-change', errorMessage);
    }
  }

  validate (validator, value, report) {
    const validationResult = validator.validate(value);

    if (report) {
      const errorMessage = validationResult.valid
        ? null
        : this._getErrorMessage(validationResult.code);

      this._setErrorMessage(errorMessage);
    }

    return validationResult;
  }
}
