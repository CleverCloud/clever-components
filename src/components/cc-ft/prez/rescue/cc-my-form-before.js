import './cc-simple-input-text.js';
import '../../cc-button/cc-button.js';
import { css, html, LitElement } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { defineSmartComponent } from '../../../lib/define-smart-component.js';
import { dispatchCustomEvent } from '../../../lib/events.js';
import { notifySuccess } from '../../../lib/notifications.js';

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

  _onSubmit () {
    const name = this._refs.name.value.value.trim();
    const email = this._refs.email.value.value.trim();

    this.state = {
      type: 'idle',
      name: {
        value: name,
        error: validateName(name),
      },
      email: {
        value: name,
        error: validateEmailAddress(email),
      },
    };

    const hasError = this.state.name.error != null || this.state.email.error != null;

    if (!hasError) {
      dispatchCustomEvent(this, 'submit', { name, email });
    }
    else {
      if (this.state.name.error != null) {
        this._refs.name.value.focus();
      }
      else {
        this._refs.email.value.focus();
      }
    }
  }

  render () {
    const isSubmitting = this.state.type === 'submitting';

    return html`
      <cc-simple-input-text
        ${ref(this._refs.name)}
        label="Name"
        value=${this.state.name.value}
        required
        ?disabled=${isSubmitting}
      >
        ${this.state.name.error != null ? html`
          <span slot="error">${this._getErrorLabel(this.state.name.error)}</span>
        ` : ''}
      </cc-simple-input-text>
      
      <cc-simple-input-text
        ${ref(this._refs.email)}
        label="Email address"
        value=${this.state.email.value}
        required
        ?disabled=${isSubmitting}
      >
        ${this.state.email.error != null ? html`
          <span slot="error">${this._getErrorLabel(this.state.email.error)}</span>
        ` : ''}
      </cc-simple-input-text>
      
      <div>
        <cc-button @cc-button:click=${this._onSubmit} ?waiting=${isSubmitting}>Submit</cc-button>  
      </div>
    `;
  }

  static get styles () {
    return css`
      :host {
        display: flex;
        flex-direction: column;
        gap: 1em;
      }
    `;
  }
}

window.customElements.define('cc-my-form', CcMyForm);

// -- VALIDATION ---

function validateName (string) {
  return string == null || string.length === 0 ? 'empty' : null;
}

function validateEmailAddress (address) {
  if (address == null || address === '') {
    return 'empty';
  }
  if (!address.match(/^\S+@\S+\.\S+$/gm)) {
    return 'invalid-email';
  }

  return null;
}

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
