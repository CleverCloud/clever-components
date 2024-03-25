import { isStringEmpty } from '../utils.js';
import {
  convertErrorMessageToString,
  focusInputAfterError,
  getFormInputElements,
} from './form-utils.js';

/**
 * @typedef {import('./validation.types.js').ErrorMessage} ErrorMessage
 * @typedef {import('./validation.types.js').ErrorMessageMap} ErrorMessageMap
 * @typedef {import('./form.types.js').DescribedInputElement} DescribedInputElement
 * @typedef {import('./form-controller.js').FormController} FormController
 *
 */

/**
 * This class helps in reporting errors on <form> inputs.
 * It has the ability to:
 *
 * * accumulate some errors to be reported
 * * report the accumulated errors
 * * focus the first input in error
 */
export class FormErrorReporter {

  /**
   * @param {FormController} formController
   * @param {ErrorMessageMap} errorsMessageMap
   */
  constructor (formController, errorsMessageMap) {
    this._formController = formController;
    this._errorsMessageMap = errorsMessageMap;

    /** @type {Map<string, {elements: Array<DescribedInputElement>, error: string}>} */
    this._errorsMap = new Map();
  }

  /**
   * Adds an error to be reported.
   *
   * Nothing happens if the input name or error are empty.
   * Nothing happens if no inputs with the given input name could be found.
   * Nothing happens if elements with this name are not considered input elements (see ${@link isCcInputElement}, ${@link isNativeInputElement}).
   *
   * @param {string} inputName the input name on which the error is attached
   * @param {string} error The error code
   * @return {FormErrorReporter} this error reporter so that you can chain calls
   */
  add (inputName, error) {
    if (isStringEmpty(inputName)) {
      return this;
    }
    if (isStringEmpty(error)) {
      return this;
    }

    // find all input elements related to this input name
    const elements = getFormInputElements(this._formController.formElement, inputName);
    if (elements.length === 0) {
      return this;
    }

    this._errorsMap.set(inputName, { elements, error });

    return this;
  }

  /**
   * @return {boolean} Whether some errors have been added
   */
  hasError () {
    return this._errorsMap.size > 0;
  }

  /**
   * Reports a single error.
   * This is a shortcut for `errorReporter.add(inputName, error).report();`
   *
   * @param {string} inputName
   * @param {string} error
   * @return {Promise<void>}
   */
  async reportError (inputName, error) {
    await this.add(inputName, error).report();
  }

  /**
   * Report all errors.
   *
   * @return {Promise<void>}
   */
  async report () {
    if (this.hasError()) {
      Array.from(this._errorsMap.values())
        .forEach(({ elements, error }) => {
          elements.forEach((e) => {
            const errorMessage = this._resolveErrorMessage(error);

            if (e.native === true) {
              e.element.setCustomValidity?.(convertErrorMessageToString(errorMessage));
            }
            else {
              e.element.errorMessage = errorMessage;
            }
          });
        });

      this._errorsMap.clear();

      await this._formController._host.updateComplete;
      return focusInputAfterError(this._formController.formElement);
    }
  }

  /**
   * Report errors if any error was added. Otherwise, execute the given function
   *
   * @param {() => unknown} elseFunction The function to execute if there are no errors to report.
   * @return {Promise<void>}
   */
  async reportOrElse (elseFunction) {
    if (this.hasError()) {
      return this.report();
    }
    else {
      elseFunction();
    }
  }

  /**
   *
   * @param {string} code
   * @return {ErrorMessage}
   */
  _resolveErrorMessage (code) {
    if (this._errorsMessageMap != null && Object.prototype.hasOwnProperty.call(this._errorsMessageMap, code)) {
      const errorMessage = this._errorsMessageMap[code];

      if (typeof errorMessage === 'function') {
        return errorMessage();
      }

      return errorMessage;
    }

    return code;
  }
}
