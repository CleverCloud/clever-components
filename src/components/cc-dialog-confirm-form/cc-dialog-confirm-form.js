import { LitElement, css, html } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { EventHandler } from '../../lib/events.js';
import { formSubmit } from '../../lib/form/form-submit-directive.js';
import { Validation } from '../../lib/form/validation.js';
import { i18n } from '../../translations/translation.js';
import { CcDialogConfirmEvent } from '../cc-dialog-confirm-actions/cc-dialog-confirm-actions.events.js';
import '../cc-dialog-confirm-actions/cc-dialog-confirm-actions.js';
import { CcDialog } from '../cc-dialog/cc-dialog.js';
import '../cc-input-text/cc-input-text.js';

/**
 * @typedef {import('../../lib/form/validation.types.js').Validator} Validator
 * @typedef {import('lit/directives/ref.js').Ref<HTMLFormElement>} HTMLFormElementRef
 */

/**
 * A form component to be used inside a `<cc-dialog>` for confirmation actions that require text input verification.
 *
 * This component displays a text input field where users must type a specific confirmation text (defined by `confirmTextToInput`)
 * to enable form submission. The form automatically resets when the parent `<cc-dialog>` closes.
 *
 * ## Features
 * - Required text input with custom validation
 * - Submit and cancel actions via `<cc-dialog-confirm-actions>`
 * - Automatic form reset on dialog close
 * - Waiting state that disables all inputs and shows loading indicator
 * - Customizable error messages and button labels
 *
 * @cssdisplay block
 */
export class CcDialogConfirmForm extends LitElement {
  static get properties() {
    return {
      autofocusInput: { type: Boolean, attribute: 'autofocus-input' },
      cancelLabel: { type: String, attribute: 'cancel-label' },
      confirmErrorMessage: { type: String, attribute: 'confirm-error-message' },
      confirmInputLabel: { type: String, attribute: 'confirm-input-label' },
      confirmTextToInput: { type: String, attribute: 'confirm-text-to-input' },
      submitIntent: { type: String, attribute: 'submit-intent' },
      submitLabel: { type: String, attribute: 'submit-label' },
      waiting: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super();

    /** @type {boolean} Automatically focuses the input when the dialog is opened.
     * Note:
     * - Only use this if there is no important content before the text input that users should read first.
     * - This component must be present in the DOM before opening the dialog. If you're creating the dialog
     *   on-demand (e.g., rendering it only when showing), autofocus may not work reliably.
     */
    this.autofocusInput = false;

    /** @type {string|null} Sets the text that needs to be matched by the user, also visible in the help text below the input. */
    this.confirmTextToInput = null;

    /** @type {string|null} Sets the label for the confirm text input. */
    this.confirmInputLabel = null;

    /** @type {string|null} Sets the label for the cancel button. Optional, only provide a value if you want to override the default label of the cancel button. */
    this.cancelLabel = null;

    /** @type {string|null} Sets the error message to display when the input doesn't match confirmTextToInput. Optional, defaults to a generic error message. */
    this.confirmErrorMessage = null;

    /** @type {string|null} Sets the label for the submit button */
    this.submitLabel = null;

    /** @type {'primary'|'danger'} Sets the color of the submit button */
    this.submitIntent = 'primary';

    /** @type {boolean} Disables the form inputs and buttons, and shows a loading indicator in the submit button */
    this.waiting = false;

    /** @type {Validator} */
    this._confirmValidator = {
      validate: (value) => {
        if (this.confirmTextToInput === value) {
          return Validation.VALID;
        }
        return Validation.invalid('no-match');
      },
    };

    this._customErrorMessages = {
      'no-match': () =>
        this.confirmErrorMessage ?? i18n('cc-dialog-confirm-form.error', { name: this.confirmTextToInput }),
    };

    /** @type {HTMLFormElementRef} */
    this._formRef = createRef();

    this._dialogCloseHandler = null;

    this._parentCcDialog = null;
  }

  connectedCallback() {
    this._parentCcDialog = this.closest('cc-dialog');
    if (this._parentCcDialog instanceof CcDialog) {
      this._dialogCloseHandler = new EventHandler(
        this._parentCcDialog,
        'cc-dialog-close',
        this._onParentDialogClose.bind(this),
      );
      this._dialogCloseHandler.connect();
    }
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._dialogCloseHandler?.disconnect();
  }

  _onConfirm() {
    this.dispatchEvent(new CcDialogConfirmEvent());
  }

  /** @param {Event} event */
  _onParentDialogClose(event) {
    // Only reset if event comes from closest ancestor cc-dialog
    const closestDialog = this.closest('cc-dialog');
    if (event.target === closestDialog) {
      this.resetForm();
    }
  }

  /** @param {CcDialogConfirmEvent} e */
  _onRequestSubmit(e) {
    e.stopPropagation();
    this._formRef.value?.requestSubmit();
  }

  resetForm() {
    this._formRef.value?.reset();
  }

  render() {
    return html`
      <form ${formSubmit(this._onConfirm.bind(this))} ${ref(this._formRef)}>
        <div class="dialog-content">
          <cc-input-text
            label="${this.confirmInputLabel}"
            name="confirmation-input"
            required
            .customValidator="${this._confirmValidator}"
            .customErrorMessages="${this._customErrorMessages}"
            ?autofocus="${this.autofocusInput}"
            ?readonly="${this.waiting}"
          >
            <p slot="help">${this.confirmTextToInput}</p>
          </cc-input-text>
          <cc-dialog-confirm-actions
            .cancelLabel="${this.cancelLabel}"
            .submitLabel="${this.submitLabel}"
            .submitIntent="${this.submitIntent}"
            ?waiting="${this.waiting}"
            @cc-dialog-confirm="${this._onRequestSubmit}"
          ></cc-dialog-confirm-actions>
        </div>
      </form>
    `;
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
        }

        cc-input-text {
          width: 100%;
        }
      `,
    ];
  }
}

customElements.define('cc-dialog-confirm-form', CcDialogConfirmForm);
