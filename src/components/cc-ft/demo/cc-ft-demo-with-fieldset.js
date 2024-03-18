import { css, html, LitElement } from 'lit';
import '../../cc-button/cc-button.js';
import '../../cc-input-text/cc-input-text.js';
import '../../cc-toggle/cc-toggle.js';
import { focusInputAfterError } from '../../../lib/form/form-utils.js';
import { formSubmit } from '../../../lib/form/form.js';
import { invalid, VALID } from '../../../lib/validation/validation.js';

class UniqueValidator {
  validate (value, formData) {
    if (formData.items.filter((i) => i === value).length > 1) {
      return invalid('Must be unique');
    }
    return VALID;
  }
}

export class CcFtDemoWithFieldset extends LitElement {
  _onInvalid () {
    // console.log(this.shadowRoot.querySelector('fieldset').validity);
    // console.log(this.shadowRoot.querySelector('fieldset').validationMessage);
    this.shadowRoot.querySelector('fieldset').setCustomValidity('not valid list');
    this.shadowRoot.querySelector('fieldset').classList.add('error');

    focusInputAfterError(this.shadowRoot.querySelector('fieldset'));
  }

  _onValid () {
    console.log(this.shadowRoot.querySelector('fieldset').validity);
    console.log(this.shadowRoot.querySelector('fieldset').validationMessage);
    // this.shadowRoot.querySelector('fieldset').setCustomValidity('');
    this.shadowRoot.querySelector('fieldset').classList.remove('error');
  }

  render () {
    const uniqueValidator = new UniqueValidator();

    return html`
      <form name="my-form" ${formSubmit(this)} @form:invalid=${this._onInvalid} @form:valid=${this._onValid}>
        <fieldset tabindex="-1" >
          <legend>Unique items</legend>
          
          <cc-input-text label="Item 1" name="items" required .customValidator=${uniqueValidator}></cc-input-text>
          <cc-input-text label="Item 2" name="items" required .customValidator=${uniqueValidator}></cc-input-text>
          <cc-input-text label="Item 3" name="items" required .customValidator=${uniqueValidator}></cc-input-text>
        </fieldset>
        
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

        form,
        fieldset {
          display: flex;
          flex-direction: column;
          gap: 0.5em;
        }
        
        fieldset.error {
          border: 1px solid red;
        }
      `,
    ];
  }
}

window.customElements.define('cc-ft-demo-with-fieldset', CcFtDemoWithFieldset);
