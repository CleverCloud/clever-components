import './cc-simple-input-text.js';
import './cc-simple-button.js';
import { css, html, LitElement } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { defineSmartComponent } from '../../../../lib/define-smart-component.js';
import { formHelper, formSubmitHandler } from '../../form/form.js';
import { EmailValidator } from '../../validation/validation.js';

// -- COMPONENT ---

export class CcMyForm extends LitElement {
  static get properties () {
    return {
      state: { type: String },
    };
  }

  constructor () {
    super();

    this.state = 'idle';

    this._refs = {
      name: createRef(),
      email: createRef(),
    };
  }

  render () {
    const isSubmitting = this.state === 'submitting';

    return html`
      <form novalidate @submit=${formSubmitHandler(this)}>
        <cc-simple-input-text
          ${ref(this._refs.name)}
          label="Name"
          name="name"
          value=""
          required
          ?disabled=${isSubmitting}
        >
        </cc-simple-input-text>

        <cc-simple-input-text
          ${ref(this._refs.email)}
          label="Email address"
          name="email"
          value=""
          .customValidator=${new EmailValidator()}
          required
          ?disabled=${isSubmitting}
        >
        </cc-simple-input-text>

        <div>
          <cc-simple-button type="submit" ?disabled=${isSubmitting}>Submit</cc-simple-button>
        </div>
      </form>
    `;
  }

  static get styles () {
    return css`
      :host, form {
        display: flex;
        flex-direction: column;
        gap: 1em;
      }
    `;
  }
}

window.customElements.define('cc-my-form', CcMyForm);

// -- SMART COMPONENT ---

defineSmartComponent({
  selector: 'cc-my-form',
  params: {
    fake: { type: String },
  },
  onContextUpdate ({ component, onEvent, updateComponent }) {

    onEvent('cc-my-form:formSubmit', ({ data }) => {
      component.state = 'submitting';
      const helper = formHelper(component);

      const formElement = component.shadowRoot.querySelector('form');

      submit({ name: data.name, email: data.email })
        .then(() => {
          component.state = 'idle';
          formElement.reset();
        })
        .catch((error) => {
          console.log(error);
          component.state = 'idle';

          if (error.message === 'email-used') {
            helper.error('email', 'This address is already used. Please change it.');
          }

          helper.reportErrors();
        });
    });
  },
});

function submit ({ name, email }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email.startsWith('used')) {
        reject(new Error('email-used'));
      }
      else {
        resolve();
      }
    }, 500);
  });
}
