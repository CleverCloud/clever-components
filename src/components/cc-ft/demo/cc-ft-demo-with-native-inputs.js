import { css, html, LitElement } from 'lit';
import { FormController, formInput, formSubmit } from '../form-v1/form.js';

export class CcFtDemoWithNativeInputs extends LitElement {
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
        name: 'color',
        type: 'string',
        required: false,
        reset: 'blue',
      },
      {
        name: 'hero',
        type: 'boolean',
        required: true,
        reset: false,
      },
    ];
    this._formController = new FormController(this, fields);
  }

  render () {
    return html`
      <form name="my-form">
        Name: <input type="text" ${formInput(this._formController, 'name')} />
        
        Favorite Color: <select ${formInput(this._formController, 'color')}>
          <option value="">--Please choose an option--</option>
          <option value="red">Red</option>
          <option value="blue">Blue</option>
          <option value="Yellow">Yellow</option>
        </select>
        
        <div>
          <input type="checkbox" id="hero" ${formInput(this._formController, 'hero')}>
          <label for="hero">Super-hero ?</label>
        </div>

        <button type="button" ${formSubmit(this._formController)}>Submit</button>
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

window.customElements.define('cc-ft-demo-with-native-inputs', CcFtDemoWithNativeInputs);
