import { css, html, LitElement } from 'lit';
import '../../cc-button/cc-button.js';
import '../../cc-input-text/cc-input-text.js';
import { formSubmit, formSubmitHandler } from '../form/form.js';

export class CcFtDemoFocusOrder extends LitElement {
  static get properties () {
    return {
    };
  }

  render () {
    return html`
      <form name="my-form" ${formSubmit(formSubmitHandler(this))}>
        <cc-input-text type="name" label="Name" name="name" required></cc-input-text>
        <cc-input-text type="surname" label="Surname" name="surname" required></cc-input-text>
        <cc-input-text type="email" label="Email" name="email" required></cc-input-text>

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

window.customElements.define('cc-ft-demo-focus-order', CcFtDemoFocusOrder);
