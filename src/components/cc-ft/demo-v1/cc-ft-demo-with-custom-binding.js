import '@shoelace-style/shoelace/dist/components/option/option.js';
import '@shoelace-style/shoelace/dist/components/select/select.js';
import { css, html, LitElement } from 'lit';
import { iconRemixArrowDownSLine as iconArrowDown } from '../../../assets/cc-remix.icons.js';
import '../../cc-button/cc-button.js';
import { FormController, formInput, formSubmitV1 } from '../form-v1/form.js';

export class CcFtDemoWithCustomBinding extends LitElement {
  static get properties () {
    return {
    };
  }

  constructor () {
    super();

    const fields = [
      {
        name: 'option',
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
        <sl-select label="Option"
                   ${formInput(this._formController, 'option', { valueProperty: 'value', bindEventName: 'sl-change' })}
        >
          <sl-option value="option1">option1</sl-option>
          <sl-option value="option2">option2</sl-option>
          <sl-option value="option3">option3</sl-option>
          <cc-icon slot="expand-icon" .icon=${iconArrowDown}></cc-icon>
        </sl-select>

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

window.customElements.define('cc-ft-demo-with-custom-binding', CcFtDemoWithCustomBinding);
