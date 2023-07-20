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

    this._form = [
      {
        name: 'name',
        type: 'string',
        initialValue: '',
      },
      {
        name: 'email',
        type: 'email',
        initialValue: '',
      },
    ];

    /** @type {FtFormState} */
    this.formState = {
      state: 'idle',
      ...Object.fromEntries(this._form.map((e) => [e.name, {
        value: e.initialValue,
      }])),
    };
  }

  _onInput (event) {
    const field = event.target.name;
    this.formState = {
      ...this.formState,
      [field]: {
        ...this.formState[field],
        value: event.detail,
      },
    };
  }

  _validateField (value, type) {
    if (type === 'email') {
      return validateEmailAddress(value);
    }
    if (type === 'string') {
      return value?.length === 0 ? 'empty' : null;
    }
  }

  _onSubmit () {
    const validation = Object.fromEntries(this._form.map((e) => {
      return [
        e.name,
        {
          value: this.formState[e.name].value,
          error: this._validateField(this.formState[e.name].value, e.type),
        },
      ];
    }));

    const isValid = Object.values(validation).every((e) => e.error == null);
    if (isValid) {
      dispatchCustomEvent(this, 'submit',
        Object.fromEntries(this._form.map((e) => [
          e.name,
          this.formState[e.name].value,
        ])),
      );
    }
    else {
      this.formState = {
        ...this.formState,
        ...validation,
      };
      const firstFailed = Object.entries(validation).find(([_, e]) => e.error != null);
      this.focusFormItem(firstFailed[0]);
    }
  }

  resetFormState () {
    this.formState = {
      state: 'idle',
      ...Object.fromEntries(this._form.map((e) => [e.name, {
        value: e.initialValue,
      }])),
    };
  }

  focusFormItem (formItem) {
    // We need this so that the focus is done after the render in case of an error coming from the API
    this.updateComplete.then(() => this.shadowRoot.querySelector(`[name=${formItem}]`)?.focus());
  }

  render () {
    const isSubmitting = this.formState.state === 'submitting';

    return html`
      <form>
        <cc-input-text
          name="name"
          label="Name"
          ?disabled=${isSubmitting}
          required
          .value=${this.formState.name.value}
          @cc-input-text:input=${this._onInput}
          @cc-input-text:requestimplicitsubmit=${this._onSubmit}
        >
          ${this.formState.name.error != null ? html`<p slot="error">${this.formState.name.error}</p>` : ''}
        </cc-input-text>

        <cc-input-text
          name="email"
          label="Email"
          ?disabled=${isSubmitting}
          required
          .value=${this.formState.email.value}
          @cc-input-text:input=${this._onInput}
          @cc-input-text:requestimplicitsubmit=${this._onSubmit}
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
