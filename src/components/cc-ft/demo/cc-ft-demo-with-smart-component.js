import { css, html, LitElement } from 'lit';
import '../../cc-button/cc-button.js';
import '../../cc-input-text/cc-input-text.js';
import { defineSmartComponent } from '../../../lib/define-smart-component.js';
import { updateRootContext } from '../../../lib/smart-manager.js';
import { formSubmit, formSubmitHandler } from '../form/form.js';

export class CcFtDemoWithSmartComponent extends LitElement {
  static get properties () {
    return {
      form1State: { type: String, attribute: 'form1-state' },
      form2State: { type: String, attribute: 'form2-state' },
    };
  }

  constructor () {
    super();

    this.form1State = 'idle';

    this.form2State = 'idle';
  }

  get forms () {
    return this.shadowRoot?.querySelectorAll('form');
  }

  connectedCallback () {
    super.connectedCallback();
    updateRootContext({});
  }

  render () {
    const isForm1Submitting = this.form1State === 'submitting';
    const isForm2Submitting = this.form2State === 'submitting';

    return html`
      <cc-smart-container context="${{ fake: 'toto' }}">
        <form name="form1" ${formSubmit(formSubmitHandler(this))}>
          <cc-input-text
            label="Name"
            name="name"
            reset-value=""
            required
            ?disabled=${isForm1Submitting}
          ></cc-input-text>
          <cc-input-text
            type="email"
            label="Email"
            name="email"
            reset-value=""
            required
            ?disabled=${isForm1Submitting}
          ></cc-input-text>

          <cc-button primary type="submit" ?waiting=${isForm1Submitting}>Submit</cc-button>
        </form>  
        <form name="form2" ${formSubmit(formSubmitHandler(this))}>
          <cc-input-text
            label="Name"
            name="name"
            resetValue=""
            required
            ?disabled=${isForm2Submitting}
          >
            <p slot="help">Anything but "toto"</p>
          </cc-input-text>
          <cc-input-text
            type="email"
            label="Email"
            name="email"
            reset-value="prepopulated-email@email.fr"
            required
            ?disabled=${isForm2Submitting}
          ></cc-input-text>

          <cc-button primary type="submit" ?waiting=${isForm2Submitting}>Submit</cc-button>
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

    onEvent('cc-ft-demo-with-smart-component:formSubmit', ({ form, data }) => {
      console.log('submitting', data);
      const formElement = component.shadowRoot.querySelector(`form[name=${form}]`);

      if (form === 'form1') {
        component.form1State = 'submitting';
        submitForm1(data)
          .then(() => {
            component.form1State = 'idle';
            formElement.reset();
          })
          .catch((error) => {
            if (error.message === 'email-used') {
              component.form1State = 'idle';
              // should our component expose some kind of helper for this?
              formElement.elements.email.errorMessage = 'Email already used';
              formElement.elements.email.focus();
            }
          });
      }

      if (form === 'form2') {
        component.form2State = 'submitting';
        submitForm2(data)
          .then(() => {
            component.form2State = 'idle';
            formElement.reset();
          })
          .catch((error) => {
            if (error.message === 'awful-name') {
              component.form2State = 'idle';
              // should our component expose some kind of helper for this?
              formElement.elements.name.errorMessage = 'I do not like your name, please change it!';
              formElement.elements.name.focus();
            }
          });
      }
    });
  },
});

// -- API calls
function submitForm1 ({ name, email }) {
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

function submitForm2 ({ name, email }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (name === 'toto') {
        reject(new Error('awful-name'));
      }
      else {
        resolve();
      }
    }, 600);
  });
}
