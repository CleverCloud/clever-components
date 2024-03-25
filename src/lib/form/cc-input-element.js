import { LitElement } from 'lit';
import { dispatchCustomEvent } from '../events.js';
import { isStringEmpty } from '../utils.js';
import { convertErrorMessageToString, getFormData } from './form-utils.js';
import { CompositeValidator } from './validation.js';

/**
 * @typedef {import('./validation.types.js').ErrorMessage} ErrorMessage
 * @typedef {import('./validation.types.js').ErrorMessageMap} ErrorMessageMap
 * @typedef {import('./validation.types.js').Validator} Validator
 * @typedef {import('../form/form.types.js').InputData} InputData
 * @typedef {import('./cc-input-element.types.js').InputElementSettings} InputElementSettings
 * @typedef {import('./cc-input-element.types.js').ValidationSettings} ValidationSettings
 * @typedef {import('lit').PropertyValues<CcInputElement>} InputElementPropertyValues
 */

/**
 * This is a base class that can be inherited from to make a custom element a <form> input element.
 * This is done by implementing the [ElementInternals](https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals) API.
 * Inherited class must implement the `getInputSettings()` method.
 */
export class CcInputElement extends LitElement {
  /**
   * @return {boolean}
   * @protected
   */
  static get formAssociated () {
    return true;
  }

  static get properties () {
    return {
      customErrorMessages: { type: Object, attribute: false },
      customValidator: { type: Object, attribute: false },
      errorMessage: { type: Object, attribute: 'error-message' },
      name: { type: String, reflect: true },
    };
  }

  constructor () {
    super();

    this._formHelper = new FormHelper(this, this.getInputSettings());

    /** @type {ErrorMessageMap} Sets the mapping between error codes and error messages. */
    this.customErrorMessages = null;

    /** @type {Validator} Sets the custom validator. */
    this.customValidator = null;

    /** @type {ErrorMessage} Sets the error message. */
    this.errorMessage = null;

    /** @type {string|null} The name of the input. */
    this.name = null;
  }

  /**
   * @return {InputElementSettings}
   * @protected
   */
  getInputSettings () {
    throw new Error('You must implement getInputSettings() method!');
  }

  /**
   * This callback will be called when the form associated to the element is reset.
   */
  formResetCallback () {
    this._formHelper.resetValue();
    // we really need to reset the error message because, even if input becomes invalid after reset,
    // the form reset must also reset the error message.
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
    const validationSettings = this._formHelper.getValidationSettings();

    /** @type {ErrorMessageMap} */
    const errorMessages = {
      ...validationSettings.errorMessages,
      ...(this.customErrorMessages ?? {}),
    };

    const validator = CompositeValidator.builder()
      .add(validationSettings.validator)
      .add(this.customValidator)
      .build();

    const validation = validator.validate(
      this._formHelper.getValueProperty(),
      this._formHelper.internals.form != null ? getFormData(this._formHelper.internals.form) : {},
    );

    const errorMessage = validation.valid === true
      ? null
      : this._formHelper.resolveErrorMessage(validation.code, errorMessages);

    if (validation.valid) {
      this._formHelper.setValidValidity();
    }
    else {
      this._formHelper.setInvalidValidity(convertErrorMessageToString(errorMessage));
    }

    if (report) {
      if (errorMessage !== this.errorMessage) {
        this.errorMessage = errorMessage;
        dispatchCustomEvent(this, 'error-message-change', errorMessage);
      }
    }

    return validation;
  }

  /* region mimic the native validation API */

  /**
   * Returns whether an element will successfully validate based on forms validation rules and constraints.
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals/willValidate}
   *
   * @return {boolean}
   */
  get willValidate () {
    return this._formHelper.internals.willValidate;
  }

  /**
   * Mimics the native HTMLInputElement API.
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/checkValidity}
   *
   * @return {boolean}
   */
  checkValidity () {
    return this._formHelper.internals.checkValidity();
  }

  /**
   * Mimics the native HTMLInputElement API.
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/reportValidity}
   *
   * @return {HTMLInputElement}
   */
  reportValidity () {
    return this._formHelper.internals.reportValidity();
  }

  /**
   * Returns a `ValidityState` object that represents the validity states of an element.
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals/validity}
   *
   * @return {ValidityState}
   */
  get validity () {
    return this._formHelper.internals.validity;
  }

  /**
   * Returns the error message that would be displayed if the user submits the form, or an empty string if no error message.
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals/validationMessage}
   *
   * @return {string}
   */
  get validationMessage () {
    return this._formHelper.internals.validationMessage;
  }

  /**
   * Mimics the native HTMLInputElement API.
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/setCustomValidity}
   *
   * @param {string} message
   */
  setCustomValidity (message) {
    if (isStringEmpty(message)) {
      this._formHelper.setValidValidity();
    }
    else {
      this._formHelper.setInvalidValidity(message);
    }
  }

  /* endregion */

  /**
   * @param {InputElementPropertyValues} changedProperties
   */
  updated (changedProperties) {
    let shouldValidate = false;
    const errorMessageChanged = changedProperties.has('errorMessage');
    const isErrorMessageEmpty = this.errorMessage == null || (typeof this.errorMessage === 'string' && this.errorMessage.length === 0);

    // Sync form values with our state
    if (changedProperties.has(this._formHelper.settings.valuePropertyName)) {
      this._formHelper.internals.setFormValue(this._formHelper.getInputData());
      shouldValidate = true;
    }

    // if one of the properties that should trigger a new validation have changed
    if ((this._formHelper.settings.reactiveValidationProperties ?? []).some((prop) => changedProperties.has(prop))) {
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
    // and we don't want to execute the classic validation
    if (errorMessageChanged && !isErrorMessageEmpty) {
      let message;
      if (typeof this.errorMessage === 'string') {
        message = this.errorMessage;
      }
      else {
        message = this._formHelper.getErrorElement().innerText;
      }

      this._formHelper.setInvalidValidity(message);
      shouldValidate = false;
    }

    if (shouldValidate) {
      this.validate(false);
    }
  }
}

/**
 * Every private methods are moved to a helper so that we don't pollute the child class (not thank you, JS, for not having proper private scope)
 */
class FormHelper {
  /**
   *
   * @param {CcInputElement} host
   * @param {InputElementSettings} settings
   */
  constructor (host, settings) {
    this._host = host;
    this.settings = settings;
    this.internals = host.attachInternals();
  }

  resetValue () {
    if (this.getResetValueProperty() != null) {
      this.setValueProperty(this.getResetValueProperty());
    }
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
   * @return {ErrorMessage}
   */
  resolveErrorMessage (code, errorMessages) {
    function resolve () {
      if (errorMessages != null && Object.prototype.hasOwnProperty.call(errorMessages, code)) {
        const errorMessage = errorMessages[code];

        if (typeof errorMessage === 'function') {
          return errorMessage();
        }

        return errorMessage;
      }
      return null;
    }

    const resolvedMessage = resolve();
    if (resolvedMessage != null) {
      return resolvedMessage;
    }

    return code;
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
