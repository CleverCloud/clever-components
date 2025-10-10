import { LitElement, css, html } from 'lit';
import { formSubmit } from '../../lib/form/form-submit-directive.js';
import { Validation } from '../../lib/form/validation.js';
import { i18n } from '../../translations/translation.js';
import '../cc-button/cc-button.js';

import { dialogFormStyles } from '../../styles/dialog-form-actions.js';
import '../cc-input-text/cc-input-text.js';

/**
 * @typedef {import('../../lib/form/validation.types.js').Validator} Validator
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

    /** @type {string|null} Sets Text that needs to be matched by the user, also visible in the help text below the input */
    this.confirmTextToInput = null;

    /** @type {string|null} Sets the label for the confirm text input */
    this.confirmInputLabel = null;

    /** @type {string|null} Sets the label for the cancel button */
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
    this.dispatchEvent(new CustomEvent('cancel'));
  }

  render() {
    return html`
      <form ${formSubmit()}>
        <div class="dialog-content">
          <cc-input-text
            label="${this.confirmInputLabel}"
            name="confirmation-input"
            required
            .customValidator="${this._confirmValidator}"
            .customErrorMessages="${this._customErrorMessages}"
            ?autofocus="${this.autofocusInput}"
          >
            <p slot="help">${this.confirmTextToInput}</p>
          </cc-input-text>
        </div>
        <div class="dialog-actions">
          <cc-button outlined @click="${this._onCancel}" ?disabled="${this.waiting}">${this.cancelLabel}</cc-button>
          <cc-button
            ?primary="${this.submitIntent === 'primary'}"
            ?danger="${this.submitIntent === 'danger'}"
            type="submit"
            ?waiting="${this.waiting}"
          >
            ${this.submitLabel}
          </cc-button>
        </div>
      </form>
    `;
  }

  static get styles() {
    return [
      dialogFormStyles,
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

customElements.define('cc-dialog-confirmation-form', CcDialogConfirmationForm);
