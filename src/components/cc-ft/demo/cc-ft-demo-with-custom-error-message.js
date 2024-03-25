import { css, html, LitElement } from 'lit';
import '../../cc-button/cc-button.js';
import '../../cc-input-text/cc-input-text.js';
import { formSubmit } from '../../../lib/form/form-submit-directive.js';

function CUSTOM_ERROR_MESSAGES (code) {
  if (code === 'empty') {
    return 'Entre un email !';
  }
  if (code === 'badEmail') {
    return 'Entre un email valide !';
  }
};

export class CcFtDemoWithCustomError extends LitElement {
  static get properties () {
    return {
    };
  }

  render () {
    return html`
      <form name="my-form" ${formSubmit(this)}>
        <cc-input-text type="email" label="Email" required name="email"></cc-input-text>
        <cc-input-text type="email" label="Email custom" required name="email-custom" .customErrorMessages=${CUSTOM_ERROR_MESSAGES}></cc-input-text>
        
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

window.customElements.define('cc-ft-demo-with-custom-error-message', CcFtDemoWithCustomError);
