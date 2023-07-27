import { html } from 'lit';
import { AsyncDirective, directive } from 'lit/async-directive.js';

class FormErrorDirective extends AsyncDirective {

  constructor (partInfo) {
    super(partInfo);
    console.log(partInfo);
  }

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
   */
  update (part, [formController, field]) {
    const useSlot = part.parentNode?.tagName?.toLowerCase() === 'cc-input-text';

    return this.render([formController.isFieldInvalid(field), formController.getFieldError(field), useSlot]);
  }
}

export const formError = directive(FormErrorDirective);
