import { css, html, LitElement } from 'lit';
import '../../cc-button/cc-button.js';
import '../../cc-input-text/cc-input-text.js';
import '../../cc-select/cc-select.js';
import '../../cc-toggle/cc-toggle.js';
import { FormController, formInput, formSubmitV1 } from '../form-v1/form.js';

export class CcFtDemoDynamicForm extends LitElement {
  static get properties () {
    return {
      _proMode: { type: Boolean, state: true },
    };
  }

  constructor () {
    super();

    this._proMode = false;

    const fields = [
      {
        name: 'name',
        type: 'string',
        required: true,
        reset: '',
      },
    ];
    this._formController = new FormController(this, fields);
  }

  _onProModeChange (e) {
    this._proMode = e.target.checked;

    if (this._proMode) {
      this._formController.addFieldDefinition({
        name: 'company',
        type: 'string',
        required: true,
        reset: '',
      },
      'resetIfEmpty',
      );
    }
    else {
      this._formController.removeFieldDefinition('company', false);
    }
  }

  render () {
    return html`
      <form name="my-form">
        <cc-input-text label="Name" ${formInput(this._formController, 'name')}></cc-input-text>

        <label>
          <input type="checkbox"
                 .checked=${this._proMode}
                 @change=${this._onProModeChange}
          /> Pro mode
        </label>
        

        ${this._proMode ? html`
          <cc-input-text label="Company" ${formInput(this._formController, 'company')}></cc-input-text>
        ` : ''}

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
          gap: 0.5em;
        }
      `,
    ];
  }
}

window.customElements.define('cc-ft-demo-dynamic-form', CcFtDemoDynamicForm);
