import { EventHandler } from '../events.js';
import { FormErrorReporter } from './form-error-reporter.js';
import { controlledFormSubmit } from './form-submit-directive.js';

/**
 * @typedef {import('lit').LitElement} LitElement
 * @typedef {import('lit/async-directive.js').DirectiveResult<any>} FormSubmitDirective
 * @typedef {import('./validation.types.js').ErrorMessageMap} ErrorMessageMap
 * @typedef {import('./form.types.js').AggregatedFormData} AggregatedFormData
 */

/**
 * This is a reactive controller helping in handling form submission with validation and error reporting.
 *
 * It becomes useful when the `<form>` submission has to perform some asynchronous operations like calling a remote API.
 * If not, you only need to use the {@link formSubmit} directive.
 *
 * It gives the ability to:
 * * set a `state` that you may want to use to show the <form> as 'busy' (for instance, making the form submit button disabled during the HTTP call).
 * * add and report errors that the HTTP call may return.
 *
 * It provides the directive to be set on the `<form>` element.
 *
 * Usage:
 *
 * ```js
 * class MyComponent extends LitElement {
 *  constructor () {
 *    super();
 *
 *    this._formCtrl = new FormController(this, {
 *      initialState: 'idle',
 *      onSubmit: (formData) => {this._callHttpApi(formData)},
 *      errorMessageMap: {
 *        'email-used': () => 'Email already used',
 *      }
 *    });
 *  }
 *
 *  _callHttpApi(formData) {
 *    this._formCtrl.state = 'busy';
 *
 *    doHttpCall(formData)
 *      .then(() => {
 *        this._formCtrl.reset();
 *        notifySuccess();
 *      })
 *      .catch((e) => {
 *        if (e.error === 'email-used') {
 *          await this._formCtrl.reportError('email', 'email-used');
 *        }
 *        else {
 *          notifyUnknownError(e);
 *        }
 *      })
 *      .finally(() => {
 *        this._formCtrl.state = 'idle';
 *      });
 *  }
 *
 *  render () {
 *    const isBusy = this._formCtrl.state === 'busy';
 *    return html`
 *      <form ${this._formCtrl.handleSubmit()}>
 *        <cc-input-text name="email" type="email" required ?disabled=${isBusy}></cc-input-text>
 *        <cc-button type="submit" ?waiting=${isBusy}>Submit</cc-button>
 *      </form>
 *    `;
 *  }
 * }
 * ```
 */
export class FormController {
  /**
   * @param {LitElement} host The component
   * @param {Object} config
   * @param {string|null} [config.initialState = null] The initial state (or null if not specified)
   * @param {(formData: AggregatedFormData) => void} config.onSubmit The callback to call when form is submitted (when receiving event `form:submit` from the `<form>` element)
   * @param {ErrorMessageMap} [config.errorMessageMap] The optional mapping between error codes and error messages
   */
  constructor (host, { initialState = null, onSubmit, errorMessageMap }) {
    this._host = host;
    this._host.addController(this);

    /** @type {string} */
    this._state = initialState;
    this._onSubmit = onSubmit;
    this._errorMessageMap = errorMessageMap;

    /** @type {HTMLFormElement} */
    this._formElement = null;
    this._formElementPromise = new Promise((resolve) => {
      this._formHelperResolver = () => {
        resolve(this._formElement);
      };
    });

    /** @type {EventHandler<CustomEvent>} */
    this._submitEventHandler = null;
  }

  /**
   * Gets the associated `<form>` element.
   * To make sure this method doesn't return null, you can `await this.formElementRegistered` before.
   *
   * @return {HTMLFormElement|null} The registered `<form>` element. Or null if not registered yet.
   */
  get formElement () {
    return this._formElement;
  }

  /**
   * Await this promise to make sure the `<form>` element is registered and ready to be used.
   *
   * @return {Promise<unknown>}
   */
  get formElementRegistered () {
    return this._formElementPromise;
  }

  /**
   * @return {string} The form state
   */
  get state () {
    return this._state;
  }

  /**
   * Sets a new state. If state has changed, the host is requested to be updated.
   *
   * @param {string} state The form state to set
   */
  set state (state) {
    if (this._state !== state) {
      this._state = state;
      this._host.requestUpdate();
    }
  }

  /**
   * Call the reset method on the registered `<form>` element (if any)
   */
  reset () {
    this._formElement?.reset();
  }

  /**
   * @return {FormErrorReporter} A new `ErrorReporter` instance that can be used to report one or more errors.
   */
  errorReporter () {
    return new FormErrorReporter(this, this._errorMessageMap);
  }

  /**
   * Reports a single error.
   * This is a shortcut for `ctrl.errorReporter().add(inputName, error).report();`
   *
   * @param {string} inputName
   * @param {string} error
   * @return {Promise<void>}
   */
  async reportError (inputName, error) {
    await this.errorReporter().reportError(inputName, error);
  }

  /**
   * Registers the `<form>` element on which this controller is intended to work with.
   * You don't need to call this yourself. Instead, use the `this.handleSubmit()` directive that will do the
   * `<form>` element registration for you.
   *
   * @param {HTMLFormElement} formElement The `<form>` element
   */
  register (formElement) {
    this._submitEventHandler?.disconnect();

    this._formElement = formElement;

    this._submitEventHandler = new EventHandler(this._formElement, 'form:submit', (e) => this._onSubmit(e.detail));
    this._submitEventHandler.connect();

    this._formHelperResolver();
  }

  /**
   * @return {FormSubmitDirective} The directive that is to be installed on the `<form>` element.
   */
  handleSubmit () {
    return controlledFormSubmit(this);
  }

  hostDisconnected () {
    this._submitEventHandler?.disconnect();
  }
}
