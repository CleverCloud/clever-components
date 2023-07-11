import { css, html, LitElement } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import '../cc-button/cc-button.js';
import '../cc-input-text/cc-input-text.js';
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

  _onSubmit () {
    dispatchCustomEvent(this, 'submit', {
      email: this._formRef.email.value,
      name: this._formRef.name.value,
    });
  }

  resetFormState () {
    this.formState = {
      ...this.formState,
      state: 'idle',
    };

    this._formRef.name.value.value = '';
    this._formRef.email.value.value = '';
  }

  render () {
    const isSubmitting = this.formState.state === 'submitting';
    console.log('render', this.formState);
    return html`
      <form>
        <cc-input-text
          label="Name"
          ?disabled=${isSubmitting}
          required
          .value=${this.formState.name.value}
          @cc-input-text:requestimplicitsubmit=${this._onSubmit}
          ${ref(this._formRef.name)}
        >
          ${this.formState.name.error != null ? html`<p slot="error">${this.formState.name.error}</p>` : ''}
        </cc-input-text>

        <cc-input-text
          label="Email"
          ?disabled=${isSubmitting}
          required
          .value=${this.formState.email.value}
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
