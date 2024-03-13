import { css, html, LitElement } from 'lit';
import '../../cc-button/cc-button.js';
import '../../cc-input-text/cc-input-text.js';
import { formSubmit } from '../../../lib/form/form.js';

export class CcFtDemoNotInForm extends LitElement {
  static get properties () {
    return {
    };
  }

  render () {
    return html`
      <div class="form" ${formSubmit(this)}>
        <cc-input-text label="Name" name="name" required></cc-input-text>
        <cc-button primary type="submit">Submit</cc-button>
      </div>
    `;
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          display: block;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 0.5em;
        }
      `,
    ];
  }
}

window.customElements.define('cc-ft-demo-not-in-form', CcFtDemoNotInForm);
