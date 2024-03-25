import { css, html, LitElement } from 'lit';
import '../../cc-button/cc-button.js';
import '../../cc-input-text/cc-input-text.js';
import '../../cc-smart-container/cc-smart-container.js';
import { defineSmartComponent } from '../../../lib/define-smart-component.js';
import { dispatchCustomEvent } from '../../../lib/events.js';
import { FormController } from '../../../lib/form/form-controller.js';
import { updateRootContext } from '../../../lib/smart-manager.js';

/**
 * @typedef {{type: 'idle', values?: {name: string, email: string}}|{type: 'submitting'}} State3
 * @typedef {import('lit/directives/ref.js').Ref<HTMLFormElement>} HTMLFormElementRef
 * @typedef {import('../../cc-input-text/cc-input-text.js').CcInputText} CcInputText
 */

export class CcFtDemoWithSmartComponent extends LitElement {
  static get properties () {
    return {
      form4Values: { type: Object },

    };
  }

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
  }

  getFormManager () {
    return {
      /**
       * @param {{name: string, email: string}} values
       * @return {Promise<void>}
       */
      initValues: async (values) => {
        // ensure form element is registered
        await this._formCtrl.formElementRegistered;

        const formElement = this._formCtrl.formElement;
        /** @type {{name: CcInputText, email: CcInputText}} */
        // @ts-ignore
        const elements = formElement.elements;
        elements.name.value = values.name;
        elements.email.value = values.email;
      },
      /**
       * @param {'idle'|'submitting'} state
       */
      setState: (state) => {
        this._formCtrl.state = state;
      },
      /**
       * @param {'email-used'} [emailErrorCode]
       */
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

  _onFormSubmit ({ detail }) {
    console.log('submit!!');
    dispatchCustomEvent(this, 'submit-form', detail);
  }

  connectedCallback () {
    super.connectedCallback();
    updateRootContext({});
  }

  render () {
    const isFormSubmitting = this._formCtrl.state === 'submitting';

    return html`
      <cc-smart-container>
        <form name="form1" ${this._formCtrl.handleSubmit()}>
          <cc-input-text
            label="Name"
            name="name"
            reset-value=""
            required
            ?disabled=${isFormSubmitting}
          ></cc-input-text>
          <cc-input-text
            type="email"
            label="Email"
            name="email"
            reset-value=""
            required
            ?disabled=${isFormSubmitting}
          ></cc-input-text>

          <cc-button primary type="submit" ?waiting=${isFormSubmitting}>Submit</cc-button>
        </form>  
      </cc-smart-container>
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
          margin-bottom: 2em;
          gap: 0.5em;
        }
      `,
    ];
  }
}

window.customElements.define('cc-ft-demo-with-smart-component', CcFtDemoWithSmartComponent);

// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------

defineSmartComponent({
  selector: 'cc-ft-demo-with-smart-component',
  params: {
    fake: { type: String, optional: true },
  },
  /**
   *
   * @param {Object} args
   * @param {CcFtDemoWithSmartComponent} args.component
   * @param {any} args.onEvent
   */
  async onContextUpdate ({ component, onEvent }) {
    // setting form value from smart
    const formManager = component.getFormManager();

    formManager.initValues({
      name: 'initial name',
      email: 'initial-email@example.com',
    });

    onEvent('cc-ft-demo-with-smart-component:submit-form',
      /**
       * @param {{name: string, email: string}} data
       */
      (data) => {
        console.log('submitting form 4', data);
        formManager.setState('submitting');

        submitForm(data)
          .then(() => {
            formManager.onSubmitSuccess();
          })
          .catch((error) => {
            if (error.message === 'email-used') {
              formManager.onSubmitFailure('email-used');
            }
            else {
              formManager.onSubmitFailure();
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
    }, 500);
  });
}
