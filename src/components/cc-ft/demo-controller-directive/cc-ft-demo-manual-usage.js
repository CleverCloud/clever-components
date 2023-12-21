import { css, html, LitElement } from 'lit';
import '../../cc-button/cc-button.js';
import { FormController, formSubmit } from '../form/form.js';

export class CcFtDemoManualUsage extends LitElement {
  static get properties () {
    return {
    };
  }

  constructor () {
    super();

    const fields = [
      {
        name: 'checkbox',
        type: 'string',
        required: true,
        reset: [],
      },
      {
        name: 'radio',
        type: 'string',
        required: true,
        reset: '',
      },
    ];
    this._formController = new FormController(this, fields);

    this.addEventListener('cc-ft-demo-manual-usage:formInvalid', ({ detail }) => {
      const [fieldName] = Object.entries(detail.validation.fields).find(([_, validation]) => !validation.valid);
      this.shadowRoot.querySelector(`[data-field=${fieldName}]`)?.focus();
    });
  }

  _onCheckboxChange (e) {
    if (e.target.checked) {
      this._formController.setFieldValue('checkbox', [
        ...this._formController.getFieldValue('checkbox'),
        e.target.value,
      ]);
    }
    else {
      this._formController.setFieldValue('checkbox', this._formController.getFieldValue('checkbox').filter((v) => v !== e.target.value));
    }
  }

  _onRadioChange (e) {
    this._formController.setFieldValue('radio', e.target.value);
  }

  render () {
    return html`
      <form name="my-form">
        <div class="group" style="${this._formController.isFieldInvalid('checkbox') ? 'border: 1px solid red' : ''}" data-field="checkbox" tabindex="-1">
          <div>
            <input type="checkbox" name="checkbox" value="option1" id="checkbox-option1"
                   .checked=${this._formController.getFieldValue('checkbox').includes('option1')}
                   @change=${this._onCheckboxChange}
            /><label for="checkbox-option1">Option1</label>
          </div>
          <div>
            <input type="checkbox" name="checkbox" value="option2" id="checkbox-option2"
                   .checked=${this._formController.getFieldValue('checkbox').includes('option2')}
                   @change=${this._onCheckboxChange}
            /><label for="checkbox-option2">Option2</label>
          </div>
          <div>
            <input type="checkbox" name="checkbox" value="option3" id="checkbox-option3"
                   .checked=${this._formController.getFieldValue('checkbox').includes('option3')}
                   @change=${this._onCheckboxChange}
            /><label for="checkbox-option3">Option3</label>
          </div>
          ${this._formController.getFieldError('checkbox') != null ? html`
            <div class="error">${this._formController.getFieldError('checkbox')}</div>
          ` : ''}
        </div>

        <div class="group" style="${this._formController.isFieldInvalid('radio') ? 'border: 1px solid red' : ''}" data-field="radio" tabindex="-1">
          <div>
            <input type="radio" name="radio" value="option1" id="radio-option1"
                   .checked=${this._formController.getFieldValue('radio') === 'option1'}
                   @change=${this._onRadioChange}
            /><label for="radio-option1">Option1</label>
          </div>
          <div>
            <input type="radio" name="radio" value="option2" id="radio-option2"
                   .checked=${this._formController.getFieldValue('radio') === 'option2'}
                   @change=${this._onRadioChange}
            /><label for="radio-option2">Option2</label>
          </div>
          <div>
            <input type="radio" name="radio" value="option3" id="radio-option3"
                   .checked=${this._formController.getFieldValue('radio') === 'option3'}
                   @change=${this._onRadioChange}
            /><label for="radio-option3">Option3</label>
          </div>
          ${this._formController.getFieldError('radio') != null ? html`
            <div class="error">${this._formController.getFieldError('radio')}</div>
          ` : ''}
        </div>

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
        
        .group {
          display: flex;
          flex-direction: column;
          gap: 0.3em;
          padding: 0.3em;
        }
        
        .error {
          color: red;
        }
        
        .group:focus {
          outline: var(--cc-focus-outline, #000 solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }
      `,
    ];
  }
}

window.customElements.define('cc-ft-demo-manual-usage', CcFtDemoManualUsage);
