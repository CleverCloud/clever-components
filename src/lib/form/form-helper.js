import { isStringEmpty } from '../utils.js';
import { invalid } from '../validation/validation.js';
import {
  convertErrorMessageToString, getFormElements,
  isCcInputElement,
  isNativeInputElement,
} from './form-utils.js';

/**
 *
 * @typedef {import('../validation/validation.types.js').ErrorMessageMap} ErrorMessageMap
 * @typedef {import('../validation/validation.types.js').ErrorMessage} ErrorMessage
 * @typedef {import('../validation/validation.types.js').Validation} Validation
 * @typedef {import('./form.types.js').FormValidation} FormValidation
 */

/**
 * @template {string} I
 * @template {string} E
 * @template {any} S
 */
export class FormHelper {
  /**
   * @typedef {import('./form.types.js').FormTransaction<I, E, S>} FormTransaction
   * @typedef {Map<I, {elements: Array<Element>, error: E}>} ErrorsMap
   */

  /**
   *
   * @param {HTMLFormElement} formElement
   * @param {ErrorMessageMap} errorsMap
   * @param {(formValidation: FormValidation) => Promise<void>} onErrorReported
   * @param {(newState: S, oldState: S) => Promise<void>} onStateChange
   */
  constructor (formElement, errorsMap, onErrorReported, onStateChange) {
    this._formElement = formElement;
    /** @type {ErrorMessageMap} */
    this._errorsMap = errorsMap;
    this._onErrorReported = onErrorReported;
    this._onStateChange = onStateChange;
    /** @type {S} */
    this._state = null;
  }

  reset () {
    this._formElement.reset();
    return this;
  }

  /**
   * @return {S}
   */
  get state () {
    return this._state;
  }

  /**
   * @param {S} state
   * @return {Promise<void>}
   */
  async setState (state) {
    await this.beginTransaction().setState(state).commit();
  }

  /**
   * @return {FormTransaction}
   */
  beginTransaction () {
    /** @type {ErrorsMap} */
    const errorsMap = new Map();
    let newState = this._state;

    /** @type {FormTransaction} */
    const transaction = {
      /**
       * @param {S} state
       * @return {FormTransaction}
       */
      setState: (state) => {
        newState = state;
        return transaction;
      },
      /**
       * @param {I} inputName
       * @param {E} error
       * @return {FormTransaction}
       */
      addError: (inputName, error) => {
        this._addError(errorsMap, inputName, error);
        return transaction;
      },
      /**
       * @return {Promise<void>}
       */
      commit: async () => {
        await this._commit(newState, errorsMap);
      },
    };
    return transaction;
  }

  /**
   * @param {ErrorsMap} errorsMap
   * @param {I} inputName
   * @param {E} error
   */
  _addError (errorsMap, inputName, error) {
    if (isStringEmpty(inputName)) {
      return;
    }
    if (isStringEmpty(error)) {
      return;
    }

    // find all elements corresponding to this input name
    /** @type {Array<Element>} */
    const elements = getFormElements(this._formElement, inputName);
    if (elements.length === 0) {
      return;
    }

    errorsMap.set(inputName, { elements, error });
  }

  /**
   *
   * @param {S} newState
   * @param {ErrorsMap} errorsMap
   * @return {Promise<void>}
   */
  async _commit (newState, errorsMap) {
    if (this._state !== newState) {
      const oldState = this._state;
      this._state = newState;
      await this._onStateChange(this._state, oldState);
    }

    if (errorsMap.size > 0) {
      const formValidation = Array.from(errorsMap.entries())
        .map(([inputName, { elements, error }]) => {
          const err = this._resolveError(error);

          elements.forEach((element) => {
            // cc input
            if (isCcInputElement(element) && element.willValidate) {
              element.errorMessage = err.message;
            }
            // native input
            else if (isNativeInputElement(element) && element.willValidate) {
              element.setCustomValidity?.(err.code);
            }
          });

          return {
            name: inputName,
            validation: invalid(err.code),
          };
        });

      errorsMap.clear();

      await this._onErrorReported(formValidation);
    }
  }

  /**
   *
   * @param {ErrorMessage} error
   * @return {{code: string, message: ErrorMessage}}
   */
  _resolveError (error) {
    if (typeof error === 'string') {
      return {
        code: error,
        message: this._getErrorMessage(error),
      };
    }

    return {
      code: convertErrorMessageToString(error),
      message: error,
    };
  }

  /**
   *
   * @param {string} code
   * @return {ErrorMessage}
   */
  _getErrorMessage (code) {
    if (this._errorsMap != null && Object.prototype.hasOwnProperty.call(this._errorsMap, code)) {
      const errorMessage = this._errorsMap[code];

      if (typeof errorMessage === 'function') {
        return errorMessage();
      }

      return errorMessage;
    }

    return code;
  }
}
