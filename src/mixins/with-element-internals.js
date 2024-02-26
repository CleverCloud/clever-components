import { dispatchCustomEvent } from '../lib/events.js';

/** @typedef {new (...args: any[]) => HTMLElement} Constructor */

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
        errorMessage: { type: Object, attribute: false },
      };
    }

    constructor () {
      super();

      this._helper = new Helper(this, this.getElementInternalsSettings());

      /** @type {ErrorMessage} Sets the error message. */
      this.errorMessage = null;

      /** @type {Validator} Sets the custom validator. */
      this._customValidator = null;

      /** @type {ErrorMessageMap} */
      this._customErrorMessages = null;
    }

    /**
     * @return {WithElementInternalsSettings}
     * @protected
     */
    getElementInternalsSettings () {
      throw new Error('You must implement getElementInternalsSettings() method!');
    }

    // todo: make that a reactive property
    set customValidator (customValidator) {
      this._customValidator = customValidator;
      this.validate(false);
    }

    // todo: make that a reactive property
    /**
     * @param {ErrorMessageMap} customErrorMessages
     */
    set customErrorMessages (customErrorMessages) {
      this._customErrorMessages = customErrorMessages;
      this.validate(false);
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

      // todo: is this a good idea?
      //         should we do nothing instead?
      if (validationSettings == null) {
        this._helper.setValidValidity();
        return;
      }

      /** @type {ErrorMessageMap} */
      const errorMessages = {
        ...validationSettings.errorMessages,
        ...(this._customErrorMessages || {}),
      };

      const validator = validationSettings.validator;

      const validationResult = validator.validate(this._helper.getValueProperty());

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
      if (message == null || message.length === 0) {
        this._helper.setValidValidity();
      }
      else {
        this._helper.setInvalidValidity(message);
      }
    }

    /* endregion */

    updated (changedProperties) {
      let shouldValidate = false;
      const hasErrorMessage = changedProperties.has('errorMessage');
      const isErrorMessageEmpty = this.errorMessage == null || this.errorMessage.length === 0;

      // Sync form values with our state
      if (changedProperties.has(this._helper.settings.valuePropertyName)) {
        this._helper.internals.setFormValue(this._helper.getFormData());
        shouldValidate = true;
      }

      if ((this._helper.settings.reactiveValidationProperties ?? []).some((prop) => changedProperties.has(prop))) {
        shouldValidate = true;
      }

      // if errorMessage is set to null / empty, we want the field to be revalidated based on its validators
      // we want it to be revalidated only if it's not already valid
      // if it's already valid, it means the value has changed and has already been revalidated
      if (hasErrorMessage && isErrorMessageEmpty) {
        shouldValidate = true;
      }

      // if errorMessage is set (not null & not empty), we want the component validity to reflect that
      if (hasErrorMessage && !isErrorMessageEmpty) {
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
   * @param {HTMLElement} host
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
   * @return {null|File|string|FormData}
   */
  getFormData () {
    if (this.settings.formDataProvider != null) {
      return this.settings.formDataProvider();
    }

    const valueProperty = this.getValueProperty();

    if (valueProperty == null || typeof valueProperty === 'string') {
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