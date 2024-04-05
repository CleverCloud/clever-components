import { css, html, LitElement } from 'lit';
import { defineSmartComponent } from '../../src/lib/define-smart-component.js';
import { dispatchCustomEvent } from '../../src/lib/events.js';
import { FormController } from '../../src/lib/form/form-controller.js';
import { updateRootContext } from '../../src/lib/smart-manager.js';
import '../../src/components/cc-button/cc-button.js';
import '../../src/components/cc-input-text/cc-input-text.js';
import '../../src/components/cc-notice/cc-notice.js';
import '../../src/components/cc-smart-container/cc-smart-container.js';

/**
 * @typedef {import('../../src/components/cc-input-text/cc-input-text.js').CcInputText} CcInputText
 * @typedef {import('../../src/lib/form/form.types.js').AggregatedFormData} AggregatedFormData
 * @typedef {import('../../src/lib/send-to-api.types.js').ApiConfig} ApiConfig
 */

export class FormDemoWithSmartComponent extends LitElement {
  constructor () {
    super();

    /** @type {FormController} */
    this._formCtrl = new FormController(this, {
      initialState: 'idle',
      onSubmit: this._onFormSubmit.bind(this),
      errorMessageMap: {
        'email-used': () => 'Email already used',
      },
    });

    this._formManager = {
      /**
       * @param {{name: string, email: string}} values
       * @return {Promise<void>}
       */
      initValues: async (values) => {
        // ensure form element is registered
        await this._formCtrl.formElementRegistered;

        const elements = this._getFormElements();
        elements.name.value = values.name;
        elements.email.value = values.email;
      },
      /** @param {'idle'|'submitting'} state */
      setState: (state) => {
        this._formCtrl.state = state;
      },
      /** @param {'email-used'} [emailErrorCode] */
      onSubmitFailure: async (emailErrorCode) => {
        this._formCtrl.state = 'idle';
        if (emailErrorCode != null) {
          await this._formCtrl.reportError('email', emailErrorCode);
        }
      },
      onSubmitSuccess: async () => {
        this._formCtrl.state = 'idle';
        this._formCtrl.reset();
      },
    };
  }

  get form () {
    return this._formManager;
  }

  /**
   * @param {AggregatedFormData} data
   */
  _onFormSubmit (data) {
    dispatchCustomEvent(this, 'submit-form', data);
  }

  connectedCallback () {
    super.connectedCallback();
    updateRootContext({});
  }

  render () {
    const isFormSubmitting = this._formCtrl.state === 'submitting';

    return html`
      <form ${this._formCtrl.handleSubmit()}>
        <cc-notice intent="info" message="Values are initialized asynchronously from smart component"></cc-notice>
        <cc-input-text label="Name" name="name" required ?disabled=${isFormSubmitting}></cc-input-text>
        <cc-input-text label="Email" name="email" type="email" required ?disabled=${isFormSubmitting}>
          <p slot="help">Try email address starting with <code>used@</code> to see asynchronous error</p>
        </cc-input-text>

        <cc-button primary type="submit" ?waiting=${isFormSubmitting}>Submit</cc-button>
      </form>  
    `;
  }

  /**
   * @return {{name: CcInputText, email: CcInputText}}
   */
  _getFormElements () {
    return {
      name: this.getInputElement('name'),
      email: this.getInputElement('email'),
    };
  }

  /**
   * @param {string} name
   * @return {T}
   * @template {HTMLElement} T
   */
  getInputElement (name) {
    return this._formCtrl.formElement[name];
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
          margin-bottom: 2em;
          gap: 0.5em;
        }
      `,
    ];
  }
}

window.customElements.define('form-demo-with-smart-component', FormDemoWithSmartComponent);

// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------

defineSmartComponent({
  selector: 'form-demo-with-smart-component',
  params: {
    fake: { type: String, optional: true },
  },
  /**
   * @param {Object} settings
   * @param {FormDemoWithSmartComponent} settings.component
   * @param {(type: string, listener: (detail: any) => void) => void} settings.onEvent
   */
  async onContextUpdate ({ component, onEvent }) {
    // setting form value from smart
    component.form.initValues({
      name: 'initial name',
      email: 'initial-email@example.com',
    });

    onEvent('form-demo-with-smart-component:submit-form',
      /**
       * @param {{name: string, email: string}} data
       */
      (data) => {
        component.form.setState('submitting');

        submitForm(data)
          .then(() => {
            component.form.onSubmitSuccess();
          })
          .catch((error) => {
            if (error.message === 'email-used') {
              component.form.onSubmitFailure('email-used');
            }
            else {
              component.form.onSubmitFailure();
            }
          });
      });
  },
});

// -- API calls
/**
 * @param {{name: string, email: string}} data
 * @return {Promise<unknown>}
 */
function submitForm (data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.email.startsWith('used')) {
        reject(new Error('email-used'));
      }
      else {
        resolve();
      }
    }, 1500);
  });
}
