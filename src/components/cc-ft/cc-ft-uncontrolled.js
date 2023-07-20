import { css, html, LitElement } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import '../cc-button/cc-button.js';
import '../cc-input-text/cc-input-text.js';
import { validateEmailAddress } from '../../lib/email.js';
import { dispatchCustomEvent } from '../../lib/events.js';

/**
 * @typedef {import('./cc-ft.types.js').FtFormState} FtFormState
 */

export class CcFtUncontrolled extends LitElement {
  static get properties () {
    return {
      myProp: {
        type: String,
        attribute: 'my-prop',
      },
      formState: {
        type: Object,
        attribute: 'form-state',
      },
    };
  }

  constructor () {
    super();
    this.myProp = 'hello';

    /** @type {FtFormState} */
    this.formState = {
      state: 'idle',
      name: {
        value: '',
      },
      email: {
        value: '',
      },
    };

    this._formRef = {
      email: createRef(),
      name: createRef(),
    };
  }

  _onNameInput ({ detail: value }) {
    this.formState = {
      ...this.formState,
      name: {
        ...this.formState.name,
        value,
      },
    };
  }

  _onEmailInput ({ detail: value }) {
    this.formState = {
      ...this.formState,
      email: {
        ...this.formState.email,
        value,
      },
    };
  }

  _onSubmit () {
    const emailValue = this.formState.email.value;
    const nameValue = this.formState.name.value;

    const emailValid = validateEmailAddress(emailValue);
    const nameValid = nameValue?.length === 0 ? 'empty' : null;

    if (emailValid != null || nameValid != null) {
      this.formState = {
        ...this.formState,
        email: {
          value: emailValue,
          error: emailValid,
        },
        name: {
          value: nameValue,
          error: nameValid,
        },
      };
    }
    else {
      dispatchCustomEvent(this, 'submit', {
        email: emailValue,
        name: nameValue,
      });
    }
  }

  resetFormState () {
    this.formState = {
      state: 'idle',
      name: {
        value: '',
      },
      email: {
        value: '',
      },
    };
  }

  async updated (_changedProperties) {
    if (_changedProperties.has('formState')) {
      if (this.formState.name.error != null) {
        await this.updateComplete;
        this._formRef.name.value.focus();
      }
      else if (this.formState.email.error != null) {
        await this.updateComplete;
        this._formRef.email.value.focus();
      }
    }
  }

  render () {
    const isSubmitting = this.formState.state === 'submitting';

    return html`
      <form>
        <cc-input-text
          label="Name"
          ?disabled=${isSubmitting}
          required
          .value=${this.formState.name.value}
          @cc-input-text:input=${this._onNameInput}
          @cc-input-text:requestimplicitsubmit=${this._onSubmit}
          ${ref(this._formRef.name)}
        >
          ${this.formState.name.error != null ? html`<p slot="error">${this.formState.name.error}</p>` : ''}
        </cc-input-text>

        <cc-input-text
          id="email"
          label="Email"
          ?disabled=${isSubmitting}
          required
          .value=${this.formState.email.value}
          @cc-input-text:input=${this._onEmailInput}
          @cc-input-text:requestimplicitsubmit=${this._onSubmit}
          ${ref(this._formRef.email)}
        >
          ${this.formState.email.error != null ? html`<p slot="error">${this.formState.email.error}</p>` : ''}
        </cc-input-text>

        <cc-button
          primary
          ?waiting=${isSubmitting}
          @cc-button:click=${this._onSubmit}
        >
          Submit
        </cc-button>
      </form>
    `;
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          display: block;
          width: 10em;
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

window.customElements.define('cc-ft-uncontrolled', CcFtUncontrolled);
