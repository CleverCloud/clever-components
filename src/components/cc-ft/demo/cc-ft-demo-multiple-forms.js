import { css, html, LitElement } from 'lit';
import '../../cc-button/cc-button.js';
import '../../cc-input-text/cc-input-text.js';
import { formSubmit } from '../../../lib/form/form.js';

export class CcFtDemoMultipleForms extends LitElement {
  static get properties () {
    return {
    };
  }

  render () {
    return html`
      <form name="my-form-1" ${formSubmit(this)}>
        <cc-input-text label="Name" name="name" required></cc-input-text>

        <cc-button primary type="submit" required>Submit</cc-button>
      </form>
      
      <form name="my-form-2" ${formSubmit(this)}>
        <cc-input-text label="Name" name="name" required></cc-input-text>

        <cc-button primary type="submit">Submit</cc-button>
      </form>
    `;
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          display: flex;
          flex-direction: column;
          gap: 1em;
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

window.customElements.define('cc-ft-demo-multiple-forms', CcFtDemoMultipleForms);
