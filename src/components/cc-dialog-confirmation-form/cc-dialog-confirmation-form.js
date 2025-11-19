import { LitElement, css, html } from 'lit';
import { formSubmit } from '../../lib/form/form-submit-directive.js';
import { Validation } from '../../lib/form/validation.js';
import { isStringEmpty } from '../../lib/utils.js';
import { i18n } from '../../translations/translation.js';
import '../cc-button/cc-button.js';
import { CcDialogConfirmEvent } from '../cc-dialog/cc-dialog.events.js';
import '../cc-input-text/cc-input-text.js';

/**
 * @typedef {import('../../lib/form/validation.types.js').Validator} Validator
 */

/**
 * A form component to be used inside a `<cc-dialog>` for confirmation actions.
 *
 * The form has two possible modes:
 * - Simple confirmation with Cancel and Confirm buttons (when `confirmInputLabel` and `confirmTextToInput` are both nullish),
 * - Confirmation with an additional text input that requires the user to type a specific text to enable the Confirm button (when both `confirmInputLabel` and `confirmTextToInput` are provided).
 *
 * @cssdisplay block
 */
export class CcDialogConfirmationForm extends LitElement {
  static get properties() {
    return {
      autofocusInput: { type: Boolean, attribute: 'autofocus-input' },
      cancelLabel: { type: String, attribute: 'cancel-label' },
      confirmInputLabel: { type: String, attribute: 'confirm-input-label' },
      confirmTextToInput: { type: String, attribute: 'confirm-text-to-input' },
      submitIntent: { type: String, attribute: 'submit-intent' },
      submitLabel: { type: String, attribute: 'submit-label' },
      waiting: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super();

    /** @type {boolean} Automatically focuses the input when the dialog is opened */
    this.autofocusInput = false;

    /** @type {string|null} Sets Text that needs to be matched by the user, also visible in the help text below the input. Note: You must provide a value if you want the confirm input to be displayed. */
    this.confirmTextToInput = null;

    /** @type {string|null} Sets the label for the confirm text input. Note: You must provide a value if you want the confirm input to be displayed. */
    this.confirmInputLabel = null;

    /** @type {string|null} Sets the label for the cancel button. Optional, only provide a value if you want to override the default label of the cancel button. */
    this.cancelLabel = null;

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
      'no-match': () => i18n('cc-addon-admin.delete.dialog.error', { name: this.confirmTextToInput }),
    };
  }

  _onCancel() {
    // TODO: check that it works because it doesn't bubble by default I believe
    this.dispatchEvent(new Event('cancel'));
  }

  _onConfirm() {
    this.dispatchEvent(new CcDialogConfirmEvent());
  }

  render() {
    if (isStringEmpty(this.confirmTextToInput) || isStringEmpty(this.confirmInputLabel)) {
      return this._renderDialogActions();
    }

    return html`
      <form ${formSubmit(this._onConfirm.bind(this))}>
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
          ${this._renderDialogActions()}
        </div>
      </form>
    `;
  }

  _renderDialogActions() {
    // TODO: check that `_onConfirm` is not called twice when used inside a form with formSubmit directive
    return html`
      <div class="dialog-actions">
        <cc-button outlined @click="${this._onCancel}" ?disabled="${this.waiting}">
          ${!isStringEmpty(this.cancelLabel) ? this.cancelLabel : i18n('cc-dialog.cancel')}
        </cc-button>
        <cc-button
          ?primary="${this.submitIntent === 'primary'}"
          ?danger="${this.submitIntent === 'danger'}"
          type="submit"
          ?waiting="${this.waiting}"
          @cc-click="${this._onConfirm}"
        >
          ${this.submitLabel}
        </cc-button>
      </div>
    `;
  }

  static get styles() {
    return [
      css`
        :host {
          container: host / inline-size;
          display: block;
        }

        cc-input-text {
          width: 100%;
        }

        .dialog-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 1em;
          justify-content: end;
          margin-top: 2.75em;
        }

        @container host (max-width: 27em) {
          .dialog-actions {
            display: grid;
            justify-content: stretch;
            margin-top: 2em;
          }
        }
      `,
    ];
  }
}

customElements.define('cc-dialog-confirmation-form', CcDialogConfirmationForm);
