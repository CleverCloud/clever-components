import './cc-simple-input-text.js';
import './cc-simple-button.js';
import { css, html, LitElement } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { defineSmartComponent } from '../../../../lib/define-smart-component.js';
import { formSubmitHandler } from '../../form/form.js';
import { EmailValidator } from '../../validation/validation.js';

// -- COMPONENT ---

export class CcMyForm extends LitElement {
  static get properties () {
    return {
      state: { type: Object },
    };
  }

  constructor () {
    super();

    this.state = {
      type: 'idle',
      name: { value: 'name', error: null },
      email: { value: 'used@dd.dd', error: null },
    };

    this._refs = {
      name: createRef(),
      email: createRef(),
    };
  }

  render () {
    const isSubmitting = this.state.type === 'submitting';

    return html`
      <form novalidate @submit=${formSubmitHandler(this)}>
        <cc-simple-input-text
          ${ref(this._refs.name)}
          label="Name"
          name="name"
          value=${this.state.name.value}
          required
          ?disabled=${isSubmitting}
        >
        </cc-simple-input-text>
  
        <cc-simple-input-text
          ${ref(this._refs.email)}
          label="Email address"
          name="email"
          value=${this.state.email.value}
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
      const formElement = component.shadowRoot.querySelector('form');

      submit({ name: data.name, email: data.email })
        .then(() => {
          formElement.reset();
        })
        .catch((error) => {
          console.log(error);
          if (error.message === 'email-used') {
            formElement.email.errorMessage = 'This address is already used. Please change it.';
          }

          component.updateComplete.then(() => formElement.querySelector(':invalid')?.focus());
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
