import { css, html, LitElement } from 'lit';
import '../../cc-button/cc-button.js';
import '../../cc-input-text/cc-input-text.js';
import { defineSmartComponent } from '../../../lib/define-smart-component.js';
import { updateRootContext } from '../../../lib/smart-manager.js';
import { formSubmitHandler } from '../form/form-submit-handler.js';

export class CcFtDemoWithSmartComponent extends LitElement {
  static get properties () {
    return {
      state: { type: String },
    };
  }

  constructor () {
    super();

    this.state = 'idle';
  }

  get forms () {
    return this.shadowRoot?.querySelectorAll('form');
  }

  connectedCallback () {
    super.connectedCallback();
    updateRootContext({});
  }

  render () {
    const isSubmitting = this.state === 'submitting';
    return html`
        <form name="my-form" novalidate @submit=${formSubmitHandler}>
          <cc-input-text
            label="Name"
            name="name"
            resetValue=""
            required
            ?disabled=${isSubmitting}
          ></cc-input-text>
          <cc-input-text
            type="email"
            label="Email"
            name="email"
            resetValue=""
            required
            ?disabled=${isSubmitting}
          ></cc-input-text>

          <cc-button primary type="submit" ?waiting=${isSubmitting}>Submit</cc-button>
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

    onEvent('cc-ft-demo-with-smart-component:formSubmit', ({ data }) => {
      component.state = 'submitting';
      const formElement = component.shadowRoot.querySelector('form[name=my-form]');

      submitForm(data)
        .then(() => {
          component.state = 'idle';
          formElement.reset();
        })
        .catch((error) => {
          if (error.message === 'email-used') {
            component.state = 'idle';
            // should our component expose some kind of helper for this?
            formElement.elements.email.errorMessage = 'Email already used';
            formElement.elements.email.focus();
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
