import { css, html, LitElement } from 'lit';
import '../../cc-button/cc-button.js';
import '../../cc-input-text/cc-input-text.js';
import { FormController, formInput, formSubmit } from '../form-v1/form.js';
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

    const fields = [
      {
        name: 'name',
        type: 'string',
        required: true,
        reset: '',
        validator: new CustomValidator(),
      },
    ];
    this._formController = new FormController(this, fields);
  }

  render () {
    return html`
      <form name="my-form">
        <cc-input-text label="Name" ${formInput(this._formController, 'name')}></cc-input-text>
        
        <cc-button primary ${formSubmit(this._formController)}>Submit</cc-button>
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
