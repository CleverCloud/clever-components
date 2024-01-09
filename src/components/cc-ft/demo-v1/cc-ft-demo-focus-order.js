import { css, html, LitElement } from 'lit';
import '../../cc-button/cc-button.js';
import '../../cc-input-text/cc-input-text.js';
import { FormController, formInput, formSubmit } from '../form-v1/form.js';

export class CcFtDemoFocusOrder extends LitElement {
  static get properties () {
    return {
    };
  }

  constructor () {
    super();

    const fields = [
      {
        name: 'surname',
        type: 'string',
        required: true,
        reset: '',
      },
      {
        name: 'email',
        type: 'email',
        required: true,
        reset: '',
      },
      {
        name: 'name',
        type: 'string',
        required: true,
        reset: '',
      },
    ];
    this._formController = new FormController(this, fields);
  }

  render () {
    return html`
      <form name="my-form">
        <cc-input-text type="name" label="Name" ${formInput(this._formController, 'name')}></cc-input-text>
        <cc-input-text type="surname" label="Surname" ${formInput(this._formController, 'surname')}></cc-input-text>
        <cc-input-text type="email" label="Email" ${formInput(this._formController, 'email')}></cc-input-text>

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

window.customElements.define('cc-ft-demo-focus-order', CcFtDemoFocusOrder);
