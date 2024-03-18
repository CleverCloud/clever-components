import { css, html, LitElement } from 'lit';
import '../../cc-button/cc-button.js';
import '../../cc-input-text/cc-input-text.js';
import { formSubmit } from '../../../lib/form/form.js';
import { invalid, VALID } from '../../../lib/validation/validation.js';

const caseSelectOptions = [
  {
    label: 'UPPERCASE',
    value: 'uppercase',
  },
  {
    label: 'lowercase',
    value: 'lowercase',
  },
];

export class CcFtDemoWithCoupledInputs extends LitElement {
  static get properties () {
    return {
    };
  }

  render () {
    const customValidator = {
      getErrorMessage (code) {
        if (code === 'not-uppercase') {
          return 'should be uppercase';
        }
        if (code === 'not-lowercase') {
          return 'should be lowercase';
        }
      },
      validate (value, formData) {
        if (formData.case === 'uppercase') {
          return value.toUpperCase() === value ? VALID : invalid('not-uppercase');
        }
        if (formData.case === 'lowercase') {
          return value.toLowerCase() === value ? VALID : invalid('not-lowercase');
        }
        return VALID;
      },
    };

    return html`
      <form ${formSubmit(this)}>
        <cc-select label="Case" .options=${caseSelectOptions} name="case" required></cc-select>
        <cc-input-text label="Value" name="val" required .customValidator=${customValidator}></cc-input-text>

        <cc-button primary type="submit" required>Submit</cc-button>
      </form>
    `;
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          display: flex;
          flex-direction: column;
          gap: 1em;
        }

        form {
          display: flex;
          flex-direction: column;
          padding: 0.5em;
          border: 1px solid #111;
          gap: 0.5em;
        }
      `,
    ];
  }
}

window.customElements.define('cc-ft-demo-with-coupled-inputs', CcFtDemoWithCoupledInputs);
