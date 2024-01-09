import { css, html, LitElement } from 'lit';
import '../../cc-button/cc-button.js';
import '../../cc-input-text/cc-input-text.js';
import { defineSmartComponent } from '../../../lib/define-smart-component.js';
import { updateRootContext } from '../../../lib/smart-manager.js';
import { FormController, formInput, formSubmit } from '../form-v1/form.js';

export class CcFtDemoWithSmartComponent extends LitElement {
  static get properties () {
    return {
    };
  }

  constructor () {
    super();

    const fields = [
      {
        name: 'email',
        type: 'email',
        required: true,
        reset: '',
        customErrorMessages (code) {
          if (code === 'used') {
            return 'Email already used';
          }
        },
      },
    ];
    this._formController = new FormController(this, fields);
  }

  get formController () {
    return this._formController;
  }

  connectedCallback () {
    super.connectedCallback();
    updateRootContext({});
  }

  render () {
    return html`
        <form name="my-form">
          <cc-input-text type="email" label="Email" ${formInput(this._formController, 'email')}></cc-input-text>

          <cc-button primary ${formSubmit(this._formController)}>Submit</cc-button>
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
    fake: { type: String },
  },
  /**
   *
   * @param {CcFtDemoWithSmartComponent} component
   * @param context
   * @param onEvent
   * @param updateComponent
   * @param signal
   */
  onContextUpdate ({ component, context, onEvent, updateComponent, signal }) {
    /** @type {FormController} */
    const formController = component.formController;

    onEvent('cc-ft-demo-with-smart-component:formSubmit', ({ data }) => {
      formController.setState('submitting');

      submitForm(data)
        .then(() => {
          formController.reset();
        })
        .catch((error) => {
          if (error.message === 'email-used') {
            formController.setState('idle');
            formController.setFieldError('email', 'used');
          }
        });
    });
  },
});

// -- API calls
function submitForm ({ name, email }) {
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
