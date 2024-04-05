import { css, html, LitElement } from 'lit';
import { formSubmit } from '../../src/lib/form/form-submit-directive.js';
import { invalid, VALID } from '../../src/lib/form/validation.js';
import { sanitize } from '../../src/lib/i18n-sanitize.js';
import '../../src/components/cc-button/cc-button.js';
import '../../src/components/cc-input-text/cc-input-text.js';

/**
 * @typedef {import('../../src/lib/form/validation.types.js').Validation} Validation
 */

const LOWER_CASE_VALIDATOR = {
  /**
   * @param {any} value
   * @return {Validation}
   */
  validate: (value) => {
    return value.toLowerCase() !== value ? invalid('notLowerCase') : VALID;
  },
};

const NAME_ERRORS_MAP = {
  empty: 'Please enter a name',
  notLowerCase: 'Name must be in lower case',
};

const EMAIL_VALIDATOR = {
  /**
   * @param {any} value
   * @return {Validation}
   */
  validate: (value) => {
    return !value.endsWith('@example.com') ? invalid('notOnExampleDomain') : VALID;
  },
};

const EMAIL_ERRORS_MAP = {
  badEmail: 'Please enter a valid email address!!!!',
  notOnExampleDomain: () => sanitize`Email address must be on <code>example.com</code> domain`,
};

export class FormDemoWithCustomValidation extends LitElement {
  render () {
    return html`
      <form ${formSubmit()}>
        <cc-input-text label="Name" name="name" required 
                       .customValidator=${LOWER_CASE_VALIDATOR}
                       .customErrorMessages=${NAME_ERRORS_MAP}
        ></cc-input-text>
        <cc-input-text label="Email" name="email" type="email" required
                       .customValidator=${EMAIL_VALIDATOR}
                       .customErrorMessages=${EMAIL_ERRORS_MAP}
        >
          <p slot="help">Must be on <code>example.com</code> domain</p>
        </cc-input-text>

        <cc-button primary type="submit">Submit</cc-button>
      </form>
    `;
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          display: block;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 0.5em;
        }
      `,
    ];
  }
}

window.customElements.define('form-demo-with-custom-validation', FormDemoWithCustomValidation);
