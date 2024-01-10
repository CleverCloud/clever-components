import { css, html, LitElement } from 'lit';
import '../../cc-button/cc-button.js';
import '../../cc-input-text/cc-input-text.js';
import { FormController, formInput, formSubmitV1 } from '../form-v1/form.js';

export class CcFtDemoNotInSameForm extends LitElement {
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
      },
      {
        name: 'surname',
        type: 'string',
        required: true,
        reset: '',
      },
    ];
    this._formController = new FormController(this, fields);
  }

  render () {
    return html`
      <form name="my-form-1">
        <cc-input-text label="Name" ${formInput(this._formController, 'name')}></cc-input-text>
      </form>
      
      <form name="my-form-2">
        <cc-input-text label="Name" ${formInput(this._formController, 'surname')}></cc-input-text>
        
        <cc-button primary ${formSubmitV1(this._formController)}>Submit</cc-button>
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
          padding: 0.5em;
          border: 1px solid #111;
          gap: 0.5em;
        }
      `,
    ];
  }
}

window.customElements.define('cc-ft-demo-not-in-same-form', CcFtDemoNotInSameForm);
