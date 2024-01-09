import { html } from 'lit';
import { AsyncDirective, directive } from 'lit/async-directive.js';

const SLOT_ERROR_TAGS = [
  'cc-input-text',
  'cc-input-number',
  'cc-select',
  'cc-toggle',
];

class FormErrorDirective extends AsyncDirective {

  render ([invalid, error, useSlot]) {
    if (!invalid) {
      return '';
    }

    if (useSlot) {
      return html`<p slot="error">${error}</p>`;
    }
    return error;
  }

  /**
   *
   * @param {ChildPart} part
   * @param {FormController} formController
   * @param {string} field
   * @param {Object} errors
   */
  update (part, [formController, field, errors]) {
    const useSlot = SLOT_ERROR_TAGS.includes(part.parentNode?.tagName?.toLowerCase());
    const isValid = formController.isFieldValid(field);

    if (isValid) {
      return this.render([false, null, null]);
    }

    const error = formController.getFieldError(field);
    const errorLabel = errors?.[error]?.();

    return this.render([formController.isFieldInvalid(field), errorLabel ?? error, useSlot]);
  }
}

export const formError = directive(FormErrorDirective);
