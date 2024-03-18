import { dispatchCustomEvent } from '../lib/events.js';
import { getFormData } from '../lib/form/form-utils.js';
import { isStringEmpty } from '../lib/utils.js';

/**
 * @typedef {new (...args: any[]) => HTMLElement} Constructor
 * @typedef {import('../lib/validation/validation.types.js').ErrorMessage} ErrorMessage
 * @typedef {import('../lib/validation/validation.types.js').ErrorMessageMap} ErrorMessageMap
 * @typedef {import('../lib/validation/validation.types.js').Validator} Validator
 * @typedef {import('./with-element-internals.types.js').WithElementInternalsSettings} WithElementInternalsSettings
 * @typedef {import('./with-element-internals.types.js').ValidationSettings} ValidationSettings
 * @typedef {import('lit').LitElement} LitElement
 *
 */

/**
 * @template {!Constructor} T
 * @param {T} superClass - The LitElement class to extend
 */
export const WithElementInternals = (superClass) =>
  /**
   * @extends HTMLElement
   */
  class Mixin extends superClass {
    static get formAssociated () {
      return true;
    }

    static get properties () {
      return {
        errorMessage: { type: Object, attribute: 'error-message' },
        customValidator: { type: Object, attribute: false },
        customErrorMessages: { type: Object, attribute: false },
      };
    }

    constructor () {
      super();

      this._helper = new Helper(this, this.getElementInternalsSettings());

      /** @type {ErrorMessage} Sets the error message. */
      this.errorMessage = null;

      /** @type {Validator} Sets the custom validator. */
      this.customValidator = null;

      /** @type {ErrorMessageMap} */
      this.customErrorMessages = null;
    }

    /**
     * @return {WithElementInternalsSettings}
     * @protected
     */
    getElementInternalsSettings () {
      throw new Error('You must implement getElementInternalsSettings() method!');
    }

    /**
     * This callback will be called when the form associated to the element is reset.
     */
    formResetCallback () {
      this._helper.resetValue();
      this.validate(false);
      if (this.errorMessage != null) {
        this.errorMessage = null;
        dispatchCustomEvent(this, 'error-message-change', null);
      }
    }

    /**
     * @param {boolean} report - whether to display error message or not
     */
    validate (report) {
      const validationSettings = this._helper.getValidationSettings();

      if (validationSettings == null) {
        // todo: is this a good idea?
        //       should we do nothing instead?
        this._helper.setValidValidity();
        return;
      }

      /** @type {ErrorMessageMap} */
      const errorMessages = {
        ...validationSettings.errorMessages,
        ...(this.customErrorMessages || {}),
      };

      const validator = validationSettings.validator;

      const validationResult = validator.validate(
        this._helper.getValueProperty(),
        this._helper.internals.form != null ? getFormData(this._helper.internals.form) : {},
      );

      const errorMessage = validationResult.valid
        ? null
        : this._helper.resolveErrorMessage(validationResult.code, errorMessages, validator);

      if (validationResult.valid) {
        this._helper.setValidValidity();
      }
      else {
        this._helper.setInvalidValidity(this._helper.convertErrorMessageToString(errorMessage));
      }

      if (report) {
        if (errorMessage !== this.errorMessage) {
          this.errorMessage = errorMessage;
          dispatchCustomEvent(this, 'error-message-change', errorMessage);
        }
      }

      return validationResult;
    }

    /* region mimic the native validation API */

    /**
     * @return {boolean}
     */
    checkValidity () {
      return this._helper.internals.checkValidity();
    }

    /**
     * @return {boolean}
     */
    reportValidity () {
      return this._helper.internals.reportValidity();
    }

    /**
     * @return {ValidityState}
     */
    get validity () {
      return this._helper.internals.validity;
    }

    /**
     * @return {string}
     */
    get validationMessage () {
      return this._helper.internals.validationMessage;
    }

    /**
     * @param {string} message
     */
    setCustomValidity (message) {
      if (isStringEmpty(message)) {
        this._helper.setValidValidity();
      }
      else {
        this._helper.setInvalidValidity(message);
      }
    }

    /* endregion */

    /**
      * @param {import('lit').PropertyValues<T>} changedProperties
     */
    updated (changedProperties) {
      let shouldValidate = false;
      const errorMessageChanged = changedProperties.has('errorMessage');
      const isErrorMessageEmpty = this.errorMessage == null || (typeof this.errorMessage === 'string' && this.errorMessage.length === 0);

      // Sync form values with our state
      if (changedProperties.has(this._helper.settings.valuePropertyName)) {
        this._helper.internals.setFormValue(this._helper.getInputData());
        shouldValidate = true;
      }

      // if one of the properties that should trigger a new validation have changed
      if ((this._helper.settings.reactiveValidationProperties ?? []).some((prop) => changedProperties.has(prop))) {
        shouldValidate = true;
      }

      // if errorMessage is set to null / empty, we want the field to be revalidated based on its validators
      // we want it to be revalidated only if it's not already valid
      // if it's already valid, it means the value has changed and has already been revalidated
      if (errorMessageChanged && isErrorMessageEmpty) {
        shouldValidate = true;
      }

      if (changedProperties.has('customValidator') || changedProperties.has('customErrorMessages')) {
        shouldValidate = true;
      }

      // if errorMessage has changed and errorMessage is set (not null & not empty), we want the component validity to reflect that,
      // and we don't want the execute the classic validation
      if (errorMessageChanged && !isErrorMessageEmpty) {
        let message;
        if (typeof this.errorMessage === 'string') {
          message = this.errorMessage;
        }
        else {
          message = this._helper.getErrorElement().innerText;
        }

        this._helper.setInvalidValidity(message);
        shouldValidate = false;
      }

      if (shouldValidate) {
        this.validate(false);
      }
    }
  };

/**
 * Every private methods are moved to a helper so that we don't pollute the child class (not thank you, JS, for not having proper private scope)
 */
class Helper {
  /**
   *
   * @param {LitElement} host
   * @param {WithElementInternalsSettings} settings
   */
  constructor (host, settings) {
    this._host = host;
    this.settings = settings;
    this.internals = host.attachInternals();
  }

  resetValue () {
    this.setValueProperty(this.getResetValueProperty());
  }

  /**
   * @return {any}
   */
  getValueProperty () {
    return this._host[this.settings.valuePropertyName];
  }

  /**
   * @param {any} value
   */
  setValueProperty (value) {
    this._host[this.settings.valuePropertyName] = value;
  }

  /**
   * @return {any}
   */
  getResetValueProperty () {
    return this._host[this.settings.resetValuePropertyName];
  }

  /**
   * @return {ValidationSettings | undefined}
   */
  getValidationSettings () {
    return this.settings.validationSettingsProvider?.();
  }

  /**
   *
   * @return {InputData}
   */
  getInputData () {
    if (this.settings.inputDataProvider != null) {
      return this.settings.inputDataProvider();
    }

    const valueProperty = this.getValueProperty();

    if (valueProperty == null || typeof valueProperty === 'string' || valueProperty instanceof File || valueProperty instanceof FormData) {
      return valueProperty;
    }

    console.warn('The value to set to form data should be of type `null|File|string|FormData`. You\'ve got ', valueProperty);

    return valueProperty.toString();
  }

  /**
   * @return {HTMLElement}
   */
  getInputElement () {
    return this._host.shadowRoot.querySelector(this.settings.inputSelector);
  }

  /**
   * @return {HTMLElement}
   */
  getErrorElement () {
    return this._host.shadowRoot.querySelector(this.settings.errorSelector);
  }

  /**
   * @param {string} code
   * @param {ErrorMessageMap} errorMessages
   * @param {Validator} validator
   * @return {ErrorMessage}
   */
  resolveErrorMessage (code, errorMessages, validator) {
    if (errorMessages != null && Object.hasOwn(errorMessages, code)) {
      const errorMessage = errorMessages[code];

      if (typeof errorMessage === 'function') {
        return errorMessage();
      }

      return errorMessage;
    }

    if (validator.getErrorMessage != null && typeof validator.getErrorMessage === 'function') {
      return validator.getErrorMessage(code);
    }

    return code;
  }

  /**
   * @param {ErrorMessage} message
   * @return {string}
   */
  convertErrorMessageToString (message) {
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

  setValidValidity () {
    this.internals.setValidity({});
  }

  /**
   * @param {string} message
   */
  setInvalidValidity (message) {
    this.internals.setValidity({ customError: true }, message, this.getInputElement());
  }
}
