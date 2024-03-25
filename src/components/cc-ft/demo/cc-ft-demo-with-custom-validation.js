import { css, html, LitElement } from 'lit';
import '../../cc-button/cc-button.js';
import '../../cc-input-text/cc-input-text.js';
import { formSubmit } from '../../../lib/form/form-submit-directive.js';
import { invalid, VALID } from '../../../lib/form/validation.js';
import { isStringEmpty } from '../../../lib/utils.js';

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
  if (isStringEmpty(value)) {
    return 'Une valeur stp';
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
    const invalidSurname = detail.find((d) => d.name === 'surname' && d.validation.valid === false);
    this._surnameError = invalidSurname != null
      ? invalidSurname.validation.code
      : null;
  }

  _onValid () {
    this._surnameError = null;
  }

  _onSurnameInput (e) {
    const value = e.target.value;

    const validation = customValidationForNativeInput(value);
    e.target.setCustomValidity?.(validation == null ? '' : validation);
  }

  render () {
    return html`
      <form name="my-form" 
            ${formSubmit(this)}
            @form:invalid=${this._onInvalid} 
            @form:valid=${this._onValid}
      >
        <cc-input-text label="Name" required name="name" .customValidator=${this._customValidator}></cc-input-text>
        <label for="input">Surname (native input)</label>
        <input type="text" required name="surname" aria-describedby="error-surname" @input=${this._onSurnameInput} />
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
