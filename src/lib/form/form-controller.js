import { EventHandler } from '../events.js';
import { FormHelper } from './form-helper.js';
import { controlledFormSubmit } from './form-submit-directive.js';
import { focusInputAfterError } from './form-utils.js';

/**
 * @typedef {import('lit').LitElement} LitElement
 * @typedef {import('lit/async-directive.js').DirectiveResult<any>} DirectiveResult
 * @typedef {import('../validation/validation.types.js').ErrorMessageMap} ErrorMessageMap
 */

/**
 * @template {string} I
 * @template {string} E
 * @template {any} S
 */
export class FormController {
  /**
   *
   * @param {LitElement} host
   * @param {Object} config
   * @param {(newState: S, oldState: S) => Promise<void>} [config.onStateChange]
   * @param {(event: CustomEvent) => void} config.onSubmit
   * @param {ErrorMessageMap} [config.errorsMap]
   */
  constructor (host, { onSubmit, errorsMap, onStateChange }) {
    this._host = host;
    this._onSubmit = onSubmit ?? (() => {});
    this._errorsMap = errorsMap;
    this._onStateChange = onStateChange;

    this._host.addController(this);

    /** @type {EventHandler<CustomEvent>} */
    this._submitEventHandler = null;
  }

  /**
   *
   * @param {HTMLFormElement} formElement
   */
  register (formElement) {
    this._submitEventHandler?.disconnect();
    this._submitEventHandler = new EventHandler(formElement, 'form:submit', this._onSubmit);
    this._submitEventHandler.connect();

    /**
     *
     * @param {S} newState
     * @param {S} oldState
     * @return {Promise<void>}
     */
    const onStateChanged = async (newState, oldState) => {
      await this._onStateChange?.(newState, oldState);
      this._host.requestUpdate();
      await this._host.updateComplete;
    };
    const onErrorReported = async () => {
      await this._host.updateComplete;
      console.log('focusing the right element');
      await focusInputAfterError(formElement);
    };

    /** @type {FormHelper<I, E, S>} */
    this._formHelper = new FormHelper(formElement, this._errorsMap, onErrorReported, onStateChanged);
    this._formHelperResolver?.();
  }

  hostDisconnected () {
    this._submitEventHandler?.disconnect();
  }

  /**
   * @return {FormHelper<I, E, S>}
   */
  get formHelper () {
    return this._formHelper;
  }

  /**
   * @return {Promise<FormHelper<I, E, S>>}
   */
  async getFormHelper () {
    if (this._formHelper != null) {
      return Promise.resolve(this._formHelper);
    }

    return new Promise((resolve) => {
      this._formHelperResolver = () => {
        resolve(this._formHelper);
      };
    });
  }

  /**
   * @return {DirectiveResult}
   */
  handleSubmit () {
    return controlledFormSubmit(this);
  }
}
