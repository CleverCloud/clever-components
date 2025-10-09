import { html } from 'lit';
import '../../components/cc-button/cc-button.js';
import '../../components/cc-input-text/cc-input-text.js';
import { formSubmit } from '../../lib/form/form-submit-directive.js';
import { Validation } from '../../lib/form/validation.js';
import { i18n } from '../../translations/translation.js';

/**
 * @param {object} params
 * @param {string} params.confirmText Text to confirm
 * @param {string} params.inputLabel Label for the input field
 * @param {string} params.confirmLabel Label for the confirm button
 * @param {string} params.cancelLabel Label for the cancel button
 * @param {() => void} params.onCancel Callback when cancelling
 * @param {(formData: FormData) => void} params.onConfirm Callback when confirming
 * @return {import('lit').TemplateResult}
 */
export const ccDialogConfirmForm = ({ confirmText, inputLabel, confirmLabel, cancelLabel, onCancel, onConfirm }) => {
  const confirmValidator = {
    /**
     * @param {string} value
     * @return {Validation}
     */
    validate: (value) => {
      if (confirmText === value) {
        return Validation.VALID;
      }

      return Validation.invalid('no-match');
    },
  };

  const customErrorMessages = { 'no-match': i18n('cc-addon-admin.delete.dialog.error', { name: confirmText }) };

  return html`
    <form ${formSubmit(onConfirm)} slot="form">
      <div slot="form-content">
        <cc-input-text
          label="${inputLabel}"
          name="confirmation-input"
          required
          .customValidator="${confirmValidator}"
          .customErrorMessages="${customErrorMessages}"
        ></cc-input-text>
      </div>
      <div slot="form-actions">
        <cc-button outlined>${cancelLabel}</cc-button>
        <cc-button type="submit">${confirmLabel}</cc-button>
      </div>
    </form>
  `;
};
