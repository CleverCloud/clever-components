import { css, html, LitElement } from 'lit';
import '../cc-button/cc-button.js';
import '../cc-input-text/cc-input-text.js';
import { FormController } from './form-controller.js';

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

    const formSpec = {
      name: 'main',
      property: 'formState',
      fields: [
        {
          name: 'name',
          type: 'string',
          reset: '',
        },
        {
          name: 'email',
          type: 'email',
          reset: '',
        },
      ],
    };
    this._formController = new FormController(this, formSpec);
  }

  _onInput (event) {
    this._formController.setFieldValue(event.target.name, event.detail);
  }

  _onSubmit () {
    this._formController.submit();
  }

  get formController () {
    return this._formController;
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
          .value=${this._formController.getFieldValue('name')}
          @cc-input-text:input=${this._onInput}
          @cc-input-text:requestimplicitsubmit=${this._onSubmit}
        >
          ${this._formController.isFieldInvalid('name') ? html`<p slot="error">
            ${this._formController.getFieldError('name')}</p>` : ''}
        </cc-input-text>

        <cc-input-text
          name="email"
          label="Email"
          ?disabled=${isSubmitting}
          required
          .value=${this._formController.getFieldValue('email')}
          @cc-input-text:input=${this._onInput}
          @cc-input-text:requestimplicitsubmit=${this._onSubmit}
        >
          ${this._formController.isFieldInvalid('email') ? html`<p slot="error">
            ${this._formController.getFieldError('email')}</p>` : ''}
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
