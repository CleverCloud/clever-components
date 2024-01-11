import { css, html, LitElement } from 'lit';
import { formSubmit, formSubmitHandler } from '../form/form.js';

/**
 * @param {String[]} selectedCheckboxes - names of the selected checkboxes
 * @returns {String|undefined} returns the error message to display or undefined if no error
 */
const validateCheckboxGroup = function (selectedCheckboxes) {
  if (selectedCheckboxes == null || selectedCheckboxes.length === 0) {
    return 'Please select at least one option';
  }
  // TODO: We have to return `null` or undefined (but this makes eslint unhappy) because `formSubmitHandler` expects valid result to be `null` / `undefined`
  return null;
};

export class CcFtDemoWithNativeInputs extends LitElement {
  static get properties () {
    return {
      _checkboxError: { type: String, state: true },
    };
  }

  constructor () {
    super();

    /** @type {string|null} the error message for the checkbox group */
    this._checkboxError = null;
  }

  _onInvalid ({ detail }) {
    const invalidTest = detail.find((d) => d.name === 'checkbox' && d.validationResult.valid === false);
    this._checkboxError = invalidTest != null
      ? invalidTest.validationResult.code
      : null;
  }

  render () {
    return html`
      <form ${formSubmit(formSubmitHandler(this, { checkbox: validateCheckboxGroup }))}>
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
            ? this._checkboxError
            : ''
          }
          <!-- 
            we cannot rely on HTML only for checkboxes because it cannot handle this case: the group is required but not each one of the options.
            setting required on each checkbox makes the form invalid until all three checkboxes have been checked...
            This is the native behavior (can be checkbed by using checkValidity() on the form without our directive).
            Thankfully, our directive provides a way to pass a custom function to validate a group of fields so this is easily solved.
          -->
          <div>
            <input type="checkbox" name="checkbox" value="option1" id="checkbox-option1"/><label for="checkbox-option1">Option1</label>
          </div>
          <div>
            <input type="checkbox" name="checkbox" value="option2" id="checkbox-option2"/><label for="checkbox-option2">Option2</label>
          </div>
          <div>
            <input type="checkbox" name="checkbox" value="option3" id="checkbox-option3"/><label for="checkbox-option3">Option3</label>
          </div>
          <!-- TODO: error message inline -->
        </fieldset>

        <fieldset class="group" tabindex="-1">
          <legend>test 2 (Required)</legend>
          <div>
            <input type="radio" name="radio" value="option1" id="radio-option1" required /><label for="radio-option1">Option1</label>
          </div>
          <div>
            <input type="radio" name="radio" value="option2" id="radio-option2" required /><label for="radio-option2">Option2</label>
          </div>
          <div>
            <input type="radio" name="radio" value="option3" id="radio-option3" required /><label for="radio-option3">Option3</label>
          </div>
          <!-- TODO: error message inline -->
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
      `,
    ];
  }
}

window.customElements.define('cc-ft-demo-with-native-inputs', CcFtDemoWithNativeInputs);
