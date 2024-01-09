import { css, html, LitElement } from 'lit';
import '../../cc-button/cc-button.js';
import '../../cc-input-text/cc-input-text.js';
import '../../cc-toggle/cc-toggle.js';
import { formSubmit, formSubmitHandler } from '../form/form.js';

const customValidation = (value) => {
  if (value == null || value.length === 0) {
    return 'C\'est vide mon ami !';
  }
  return value.toUpperCase() !== value ? 'En majuscule s\'il te plait' : null;
};

export class CcFtDemoWithArrayType extends LitElement {
  static get properties () {
    return {
      _testError: { type: String, state: true },
    };
  }

  constructor () {
    super();

    this._initialTags = [];

    this._testError = null;
  }

  _onFormInvalid ({ detail }) {
    console.log(detail);
    const invalidTest = detail.find((d) => d.name === 'test' && d.validationResult.valid === false);
    this._testError = invalidTest != null
      ? invalidTest.validationResult.code
      : null;
  }

  render () {
    return html`
      <form name="my-form" 
            novalidate
            ${formSubmit(formSubmitHandler(this, { test: customValidation }))}
            @form:invalid=${this._onFormInvalid}
      >
        <cc-input-text label="Name" name="name" required value="toto"></cc-input-text>
        <cc-input-text label="Tags" name="tags" required .tags=${[]}></cc-input-text>
        <label for="test">Test</label>
        
        <input id="test" required name="test" />
        ${this._testError != null ? html`<p class="error" id="test-error">${this._testError}</p>` : ''}
        
        <label for="test2">Test 2</label>
        <input id="test2" required name="test2" />
        
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
      `,
    ];
  }
}

window.customElements.define('cc-ft-demo-with-array-type', CcFtDemoWithArrayType);
