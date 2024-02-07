import { css, html, LitElement } from 'lit';
import '../../cc-button/cc-button.js';
import '../../cc-input-text/cc-input-text.js';
import { formSubmit, formSubmitHandler } from '../form/form.js';
import { invalid, VALID } from '../validation/validation.js';

class CustomValidator {
  getErrorMessage (code) {
    if (code === 'not-maj') {
      return 'En majuscule s\'il te plait';
    }
  }

  validate (value) {
    return value.toUpperCase() !== value ? invalid('not-maj') : VALID;
  }
}

/**
 * @param {string|null} value - the input value to be validated
 * @returns {string|undefined} returns the error message to display or undefined if no error
 */
function customValidationForNativeInput (value) {
  if (value == null || value.length === 0) {
    return 'Please enter a value';
  }

  if (value.toUpperCase() !== value) {
    return 'En majuscules s\'il te plaît';
  }
}

export class CcFtDemoWithCustomValidation extends LitElement {
  static get properties () {
    return {
      _surnameError: { type: String, state: true },
    };
  }

  constructor () {
    super();

    this._customValidator = new CustomValidator();

    /** @type {string|null} Sets the error messages displayed below the surname field */
    this._surnameError = null;
  }

  _onInvalid ({ detail }) {
    const invalidSurname = detail.find((d) => d.name === 'surname' && d.validationResult.valid === false);
    this._surnameError = invalidSurname != null
      ? invalidSurname.validationResult.code
      : null;
  }

  _onValid () {
    this._surnameError = null;
  }

  render () {
    return html`
      <form name="my-form" ${formSubmit(formSubmitHandler(this, { surname: customValidationForNativeInput }))} @form:invalid=${this._onInvalid} @form:valid=${this._onValid}>
        <cc-input-text label="Name" required name="name" .customValidator=${this._customValidator}></cc-input-text>
        <label for="input">Surname (native input)</label>
        <input type="text" required name="surname" aria-describedby="error-surname" />
        ${this._surnameError != null && this._surnameError.length > 0
          ? html`<p id="error-surname">${this._surnameError}</p>`
          : ''
        }
        <cc-button primary type="submit">Submit</cc-button>
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

        p {
          margin: 0;
          color: red;
        }
      `,
    ];
  }
}

window.customElements.define('cc-ft-demo-with-custom-validation', CcFtDemoWithCustomValidation);
