import { css, html, LitElement } from 'lit';
import '../../cc-button/cc-button.js';
import '../../cc-input-text/cc-input-text.js';
import '../../cc-select/cc-select.js';
import '../../cc-toggle/cc-toggle.js';
import { FormController, formInput, formSubmitV1 } from '../form-v1/form.js';

export class CcFtDemoMultipleForms extends LitElement {
  static get properties () {
    return {
      _proMode: { type: Boolean, state: true },
    };
  }

  constructor () {
    super();

    this._proMode = false;

    const fieldsForm1 = [
      {
        name: 'name',
        type: 'string',
        required: true,
        reset: '',
      },
    ];
    this._form1Controller = new FormController(this, fieldsForm1);

    const fieldsForm2 = [
      {
        name: 'name',
        type: 'string',
        required: true,
        reset: '',
      },
    ];
    this._form2Controller = new FormController(this, fieldsForm2);
  }

  render () {
    return html`
      <form name="my-form-1">
        <cc-input-text label="Name" ${formInput(this._form1Controller, 'name')}></cc-input-text>

        <cc-button primary ${formSubmitV1(this._form1Controller)}>Submit</cc-button>
      </form>
      
      <form name="my-form-2">
        <cc-input-text label="Name" ${formInput(this._form2Controller, 'name')}></cc-input-text>

        <cc-button primary ${formSubmitV1(this._form2Controller)}>Submit</cc-button>
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

window.customElements.define('cc-ft-demo-multiple-forms', CcFtDemoMultipleForms);
