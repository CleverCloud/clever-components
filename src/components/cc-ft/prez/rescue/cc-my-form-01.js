import './cc-simple-input-text.js';
import './cc-simple-button.js';
import { css, html, LitElement } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { defineSmartComponent } from '../../../../lib/define-smart-component.js';
import { notifySuccess } from '../../../../lib/notifications.js';
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
      name: { value: '', error: null },
      email: { value: '', error: null },
    };

    this._refs = {
      name: createRef(),
      email: createRef(),
    };
  }

  _getErrorLabel (code) {
    if (code === 'empty') {
      return 'Please enter a value.';
    }
    if (code === 'invalid-email') {
      return 'Please enter a valide email address.';
    }
    if (code === 'email-used') {
      return 'This address is already used. Please change it.';
    }
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
  onContextUpdate ({ onEvent, updateComponent }) {

    onEvent('cc-my-form:submit', ({ name, email }) => {
      updateComponent('state', {
        type: 'submitting',
        name: { value: name },
        email: { value: email },
      });

      submit({ name, email })
        .then(() => {
          updateComponent('state', {
            type: 'idle',
            name: { value: '' },
            email: { value: '' },
          });
          notifySuccess('Record added');
        })
        .catch((error) => {
          if (error.message === 'email-used') {
            updateComponent('state', {
              type: 'idle',
              name: { value: name },
              email: { value: email, error: 'email-used' },
            });
          }
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
