import { css, html, LitElement } from 'lit';
import '../../cc-button/cc-button.js';
import '../../cc-input-text/cc-input-text.js';
import { formSubmitHandler } from '../form/form-submit-handler.js';
import { invalid, VALID } from '../validation/validation.js';

class CustomValidator {
  getErrorMessage (code) {
    if (code === 'not-maj') {
      return 'En majuscule s\'il te plait';
    }
  }

  validate (value) {
    return value.toUpperCase() !== value ? invalid('not-maj') : VALID;
  }
}

export class CcFtDemoWithCustomValidation extends LitElement {
  static get properties () {
    return {
    };
  }

  constructor () {
    super();

    this._customValidator = new CustomValidator();
  }

  render () {
    return html`
      <form name="my-form" novalidate @submit=${formSubmitHandler}>
        <cc-input-text label="Name" required name="name" .customValidator=${this._customValidator}></cc-input-text>
        
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

window.customElements.define('cc-ft-demo-with-custom-validation', CcFtDemoWithCustomValidation);
