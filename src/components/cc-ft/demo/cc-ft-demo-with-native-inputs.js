import { css, html, LitElement } from 'lit';
import { formSubmit, formSubmitHandler } from '../form/form.js';

/**
 * @param {string[]} selectedCheckboxes - names of the selected checkboxes
 * @returns {string|undefined} returns the error message to display or undefined if no error
 */
const validateCheckboxGroup = function (selectedCheckboxes) {
  if (selectedCheckboxes == null || selectedCheckboxes.length === 0) {
    return 'Please select at least one option';
  }
};

export class CcFtDemoWithNativeInputs extends LitElement {
  static get properties () {
    return {
      _checkboxError: { type: String, state: true },
      _radioError: { type: String, state: true },
    };
  }

  constructor () {
    super();

    /** @type {string|null} the error message for the checkbox group */
    this._checkboxError = null;

    /** @type {string|null} the error message for the radio group */
    this._radioError = null;
  }

  _onInvalid ({ detail }) {
    const invalidCheckboxes = detail.find((d) => d.name === 'checkbox' && d.validationResult.valid === false);
    const invalidRadios = detail.find((d) => d.name === 'radio' && d.validationResult.valid === false);
    this._checkboxError = invalidCheckboxes != null
      ? invalidCheckboxes.validationResult.code
      : null;

    this._radioError = invalidRadios != null
      ? 'Please select one of the available options'
      : null;
  }

  // TODO: we only provide an invalid event and no valid event so right now the only way to remove error messages if everything went well is to use the submit event
  // TODO: tackle this by dispatching a `valid` event
  _onSubmit (e) {
    e.preventDefault();
    this._checkboxError = null;
    this._radioError = null;
  }

  render () {
    return html`
      <form ${formSubmit(formSubmitHandler(this, { checkbox: validateCheckboxGroup }))} @form:invalid=${this._onInvalid} @submit=${this._onSubmit}>
        <label for="name">Name:</label><input id="name" type="text" required name="name" />
        
        <label for="color">Favorite Color:</label> <select required name="color" >
          <option value="">--Please choose an option--</option>
          <option value="red">Red</option>
          <option value="blue">Blue</option>
          <option value="Yellow">Yellow</option>
        </select>
        
        <div>
          <input type="checkbox" id="hero" required name="hero" />
          <label for="hero">Super-hero ?</label>
        </div>

        <fieldset class="group" tabindex="-1">
          <legend>test (Required)</legend>
          ${this._checkboxError != null && this._checkboxError.length > 0
            ? html`<p id="checkboxes-error">${this._checkboxError}</p>`
            : ''
          }
          <!-- 
            we cannot rely on HTML only for checkboxes because it cannot handle this case: the group is required but not each one of the options.
            setting required on each checkbox makes the form invalid until all three checkboxes have been checked...
            This is the native behavior (can be checkbed by using checkValidity() on the form without our directive).
            Thankfully, our directive provides a way to pass a custom function to validate a group of fields so this is easily solved.
          -->
          <div>
            <input type="checkbox" name="checkbox" value="option1" id="checkbox-option1" aria-describedby="checkboxes-error" /><label for="checkbox-option1">Option1</label>
          </div>
          <div>
            <input type="checkbox" name="checkbox" value="option2" id="checkbox-option2" aria-describedby="checkboxes-error" /><label for="checkbox-option2">Option2</label>
          </div>
          <div>
            <input type="checkbox" name="checkbox" value="option3" id="checkbox-option3" aria-describedby="checkboxes-error" /><label for="checkbox-option3">Option3</label>
          </div>
        </fieldset>

        <fieldset class="group" tabindex="-1">
          <legend>test 2 (Required)</legend>
          ${this._radioError != null && this._radioError.length > 0
            ? html`<p id="radio-error">${this._radioError}</p>`
            : ''
          }
          <div>
            <input type="radio" name="radio" value="option1" id="radio-option1" required aria-describedby="radio-error" /><label for="radio-option1">Option1</label>
          </div>
          <div>
            <input type="radio" name="radio" value="option2" id="radio-option2" required aria-describedby="radio-error" /><label for="radio-option2">Option2</label>
          </div>
          <div>
            <input type="radio" name="radio" value="option3" id="radio-option3" required aria-describedby="radio-error" /><label for="radio-option3">Option3</label>
          </div>
        </fieldset>

        <button type="submit">Submit</button>
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

        *:focus {
          outline: solid 2px black;
        }

        /* TODO: this shows why the :invalid pseudo-class is not great for styling error states */
        *:invalid:focus {
          outline: solid 2px red;
        }

        p {
          margin: 0.5em;
          color: red;
        }
      `,
    ];
  }
}

window.customElements.define('cc-ft-demo-with-native-inputs', CcFtDemoWithNativeInputs);
