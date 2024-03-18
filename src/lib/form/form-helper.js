import { isStringEmpty } from '../utils.js';
import { invalid } from '../validation/validation.js';
import { setCustomValidityOnElement } from './form-utils.js';

/**
 * @implements IFormHelper<I, E, S>
 * @template I
 * @template E
 * @template S
 */
export class FormHelper {
  /**
   *
   * @param formElement
   * @param {ErrorMessageMap} errorsMaps
   * @param onErrorReported
   * @param onStateChange
   */
  constructor (formElement, errorsMaps, onErrorReported, onStateChange) {
    this._formElement = formElement;
    this._errorsMaps = errorsMaps;
    this._onErrorReported = onErrorReported;
    this._onStateChange = onStateChange;

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

  beginTransaction () {
    const errorsMap = new Map();
    let newState = this._state;

    const transaction = {
      setState: (state) => {
        newState = state;
        return transaction;
      },
      addError: (inputName, error) => {
        this._addError(errorsMap, inputName, error);
        return transaction;
      },
      commit: async () => {
        await this._commit(newState, errorsMap);
      },
    };
    return transaction;
  }

  _addError (errorsMap, inputName, error) {
    if (isStringEmpty(inputName)) {
      return;
    }
    if (isStringEmpty(error)) {
      return;
    }
    // check if input exists in form
    const element = this._formElement.elements[inputName];
    if (element == null) {
      return;
    }

    errorsMap.set(inputName, { element, error });
  }

  async _commit (newState, errorsMap) {
    if (this._state !== newState) {
      const oldState = this._state;
      this._state = newState;
      await this._onStateChange(this._state, oldState);
    }

    if (errorsMap.size > 0) {
      const formValidationResult = Array.from(errorsMap.entries())
        .map(([inputName, { element, error }]) => {
          let errorMessage = this._errorsMaps[error] ?? error;
          if (typeof errorMessage === 'function') {
            errorMessage = errorMessage();
          }
          const validationResult = invalid(errorMessage);

          setCustomValidityOnElement(element, validationResult);

          return {
            name: inputName,
            validationResult,
          };
        });

      errorsMap.clear();

      await this._onErrorReported(formValidationResult);
    }
  }
}
