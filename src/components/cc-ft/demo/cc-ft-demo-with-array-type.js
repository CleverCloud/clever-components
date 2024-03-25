import { css, html, LitElement } from 'lit';
import '../../cc-button/cc-button.js';
import '../../cc-input-text/cc-input-text.js';
import '../../cc-toggle/cc-toggle.js';
import { formSubmit } from '../../../lib/form/form-submit-directive.js';

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

  render () {
    return html`
      <form name="my-form" 
            ${formSubmit(this)}
      >
        <cc-input-text label="Name" name="name" required></cc-input-text>
        <cc-input-text label="Name (same name)" name="name" required></cc-input-text>
        <cc-input-text label="Tags" name="tags" required .tags=${[]}></cc-input-text>
        
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
