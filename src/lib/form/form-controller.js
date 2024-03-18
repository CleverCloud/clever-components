import { EventHandler } from '../events.js';
import { FormHelper } from './form-helper.js';
import { controlledFormSubmit } from './form-submit-directive.js';
import { focusInputAfterError } from './form-utils.js';

export class FormController {
  /**
   *
   * @param host
   * @param onStateChange
   * @param onSubmit
   * @param {ErrorMessageMap} errorsMap
   */
  constructor (host, { onStateChange, onSubmit, errorsMap }) {
    this._host = host;
    this._onStateChange = onStateChange;
    this._onSubmit = onSubmit ?? (() => {});
    this._errorsMap = errorsMap;

    this._host.addController(this);

    /** @type {EventHandler} */
    this._submitEventHandler = null;
  }

  register (formElement) {
    this._submitEventHandler?.disconnect();
    this._submitEventHandler = new EventHandler(formElement, 'form:submit', this._onSubmit);
    this._submitEventHandler.connect();

    const onStateChanged = async (newState, oldState) => {
      await this._onStateChange?.(newState, oldState);
      this._host.requestUpdate();
      await this._host.updateComplete;
    };
    const onErrorReported = async () => {
      await focusInputAfterError(formElement);
    };

    this._formHelper = new FormHelper(formElement, this._errorsMap, onErrorReported, onStateChanged);
    this._formHelperResolver?.();
  }

  hostDisconnected () {
    this._submitEventHandler?.disconnect();
  }

  get formHelper () {
    return this._formHelper;
  }

  /**
   * @return {Promise<IFormHelper<I, E, S>>}
   * @template I
   * @template E
   * @template S
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

  handleSubmit (customValidation) {
    return controlledFormSubmit(this, customValidation);
  }
}
