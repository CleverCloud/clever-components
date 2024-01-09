import { css, html, LitElement } from 'lit';
import '../../cc-button/cc-button.js';
import '../../cc-input-text/cc-input-text.js';
import { FormController, formInput, formSubmit } from '../form-v1/form.js';

export class CcFtDemoWithCustomError extends LitElement {
  static get properties () {
    return {
    };
  }

  constructor () {
    super();

    const fields = [
      {
        name: 'email',
        type: 'email',
        required: true,
        reset: '',
      },
      {
        name: 'email-custom',
        type: 'email',
        required: true,
        reset: '',
        customErrorMessages (code) {
          if (code === 'empty') {
            return 'Entre un email !';
          }
          if (code === 'badEmail') {
            return 'Entre un email valide !';
          }
        },
      },
    ];
    this._formController = new FormController(this, fields);
  }

  render () {
    return html`
      <form name="my-form">
        <cc-input-text type="email" label="Email" ${formInput(this._formController, 'email')}></cc-input-text>
        <cc-input-text type="email" label="Email custom" ${formInput(this._formController, 'email-custom')}></cc-input-text>
        
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

window.customElements.define('cc-ft-demo-with-custom-error', CcFtDemoWithCustomError);
