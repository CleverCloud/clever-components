import { css, html, LitElement } from 'lit';
import '../../cc-button/cc-button.js';
import '../../cc-input-text/cc-input-text.js';
import { formSubmit } from '../../../lib/form/form-submit-directive.js';

export class CcFtDemoNotInSameForm extends LitElement {
  static get properties () {
    return {
    };
  }

  render () {
    // TODO: discuss if this example is still necessary
    return html`
      <form name="my-form-1" ${formSubmit(this)}>
        <cc-input-text label="Name" required></cc-input-text>
      </form>
      
      <form name="my-form-2">
        <cc-input-text label="Surname" name="surname"></cc-input-text>
        
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
          padding: 0.5em;
          border: 1px solid #111;
          gap: 0.5em;
        }
      `,
    ];
  }
}

window.customElements.define('cc-ft-demo-not-in-same-form', CcFtDemoNotInSameForm);
