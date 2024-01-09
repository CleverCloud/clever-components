import { css, html, LitElement } from 'lit';
import '../../cc-button/cc-button.js';
import '../../cc-input-text/cc-input-text.js';
import '../../cc-select/cc-select.js';
import '../../cc-toggle/cc-toggle.js';
import { FormController, formInput, formReset, formSubmit } from '../form-v1/form.js';

const colorsSelectOptions = [
  {
    label: 'red',
    value: 'red',
  },
  {
    label: 'yellow',
    value: 'yellow',
  },
  {
    label: 'green',
    value: 'green',
  },
];

const petToggleOptions = [
  {
    label: '🐶',
    value: '🐶',
  },
  {
    label: '🐱',
    value: '🐱',
  },
  {
    label: '🐸',
    value: '🐸',
  },
];

export class CcFtDemoReset extends LitElement {
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
        required: false,
        reset: '',
      },
      {
        name: 'country',
        type: 'string',
        required: true,
        reset: 'France',
      },
      {
        name: 'color',
        type: 'string',
        required: false,
        reset: 'red',
      },
      {
        name: 'pet',
        type: 'string',
        required: false,
        reset: '🐸',
      },
    ];
    this._formController = new FormController(this, fields);
  }

  render () {
    return html`
      <form name="my-form">
        <cc-input-text label="Name" ${formInput(this._formController, 'name')}></cc-input-text>
        <cc-input-text label="Surname" ${formInput(this._formController, 'surname')}></cc-input-text>
        <cc-input-text label="Country" ${formInput(this._formController, 'country')}></cc-input-text>
        <cc-select label="Favorite color" .options=${colorsSelectOptions} ${formInput(this._formController, 'color')}></cc-select>
        <cc-toggle legend="Pet" .choices=${petToggleOptions} ${formInput(this._formController, 'pet')}></cc-toggle>
        
        <div class="buttons-bar">
          <cc-button ${formReset(this._formController)}>Reset</cc-button>
          <cc-button primary ${formSubmit(this._formController)}>Submit</cc-button>
        </div>
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
        
        .buttons-bar {
          display: flex;
          align-items: end;
          gap: 1em;
        }
      `,
    ];
  }
}

window.customElements.define('cc-ft-demo-reset', CcFtDemoReset);
