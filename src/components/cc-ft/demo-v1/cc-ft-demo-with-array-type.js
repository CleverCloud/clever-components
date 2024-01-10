import { css, html, LitElement } from 'lit';
import '../../cc-button/cc-button.js';
import '../../cc-input-text/cc-input-text.js';
import '../../cc-toggle/cc-toggle.js';
import { FormController, formInput, formSubmitV1 } from '../form-v1/form.js';

const foodToggleOptions = [
  {
    label: '🍕',
    value: '🍕',
  },
  {
    label: '🥕',
    value: '🥕',
  },
  {
    label: '🥝',
    value: '🥝',
  },
  {
    label: '🥐',
    value: '🥐',
  },
];

export class CcFtDemoWithArrayType extends LitElement {
  static get properties () {
    return {
    };
  }

  constructor () {
    super();

    const fields = [
      {
        name: 'tags',
        type: 'string',
        required: true,
        reset: [],
      },
      {
        name: 'foods',
        type: 'string',
        required: false,
        reset: ['🍕'],
      },
    ];
    this._formController = new FormController(this, fields);
  }

  render () {
    return html`
      <form name="my-form">
        <cc-input-text label="Tags" ${formInput(this._formController, 'tags', { valueProperty: 'tags' })}></cc-input-text>
        <cc-toggle legend="Favorite foods" .choices=${foodToggleOptions}
                   ${formInput(this._formController, 'foods', { valueProperty: 'multipleValues' })}>
        </cc-toggle>
        
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

window.customElements.define('cc-ft-demo-with-array-type', CcFtDemoWithArrayType);
