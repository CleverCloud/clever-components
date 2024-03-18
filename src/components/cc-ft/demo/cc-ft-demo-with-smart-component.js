import { css, html, LitElement } from 'lit';
import '../../cc-button/cc-button.js';
import '../../cc-input-text/cc-input-text.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { defineSmartComponent } from '../../../lib/define-smart-component.js';
import { dispatchCustomEvent } from '../../../lib/events.js';
import { FormController } from '../../../lib/form/form-controller.js';
import { updateRootContext } from '../../../lib/smart-manager.js';

export class CcFtDemoWithSmartComponent extends LitElement {
  static get properties () {
    return {
    };
  }

  constructor () {
    super();

    this._form1Ctrl = new FormController(this, {
      onSubmit: this._onForm1Submit.bind(this),
      errorsMap: {
        'email-used': 'Email already used',
      },
    });
    this._form2Ctrl = new FormController(this, {
      onSubmit: this._onForm2Submit.bind(this),
      errorsMap: {
        'awful-name': () => 'I do not like your name, please change it!',
      },
    });
    this._form3Ref = createRef();
    this._form3Ctrl = new FormController(this, {
      onSubmit: this._onForm3Submit.bind(this),
      errorsMap: {
        'email-used': 'Email already used',
      },
      onStateChange: async (state) => {
        console.log(state);
        if (state.values != null) {
          const form3 = this._form3Ref.value;
          form3.elements.name.value = state.values.name;
          form3.elements.email.value = state.values.email;
        }
      },
    });

    this._form4Ctrl = new FormController(this, {
      onSubmit: this._onForm4Submit.bind(this),
      errorsMap: {
        'email-used': 'Email already used',
      },
      onStateChange: async (state) => {
        console.log(state);
        if (state.values != null) {

          const form3 = this._form3Ref.value;
          form3.elements.name.value = state.values.name;
          form3.elements.email.value = state.values.email;
        }
      },
    });
  }

  /**
   * @return {IFormHelper<'email', 'email-used', null|'submitting'>}
   */
  getForm1 () {
    return this._form1Ctrl.formHelper;
  }

  /**
   * @return {IFormHelper<'name', 'awful-name', null|'submitting'>}
   */
  getForm2 () {
    return this._form2Ctrl.formHelper;
  }

  /**
   * @return {Promise<IFormHelper<'email', 'email-used', null|'submitting'>>}
   */
  getForm3 () {
    return this._form3Ctrl.getFormHelper();
  }

  _onForm1Submit ({ detail }) {
    dispatchCustomEvent(this, 'submit-form-1', detail);
  }

  _onForm2Submit ({ detail }) {
    dispatchCustomEvent(this, 'submit-form-2', detail);
  }

  _onForm3Submit ({ detail }) {
    dispatchCustomEvent(this, 'submit-form-3', detail);
  }

  _onForm4Submit ({ detail }) {
    dispatchCustomEvent(this, 'submit-form-4', detail);
  }

  connectedCallback () {
    super.connectedCallback();
    updateRootContext({});
  }

  render () {
    const isForm1Submitting = this._form1Ctrl.formHelper?.state === 'submitting';
    const isForm2Submitting = this._form2Ctrl.formHelper?.state === 'submitting';
    const isForm3Submitting = this._form3Ctrl.formHelper?.state?.type === 'submitting';
    console.log('isForm3Submitting', isForm3Submitting);

    return html`
      <cc-smart-container context="${{ fake: 'toto' }}">
        <form name="form1" ${this._form1Ctrl.handleSubmit()}>
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
        <form name="form2" ${this._form2Ctrl.handleSubmit()}>
          <cc-input-text
            label="Name"
            name="name"
            reset-value=""
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
            value="prepopulated-email@email.fr"
            required
            ?disabled=${isForm2Submitting}
          ></cc-input-text>

          <cc-button primary type="submit" ?waiting=${isForm2Submitting}>Submit</cc-button>
        </form>
        <form name="form3" ${this._form3Ctrl.handleSubmit()} ${ref(this._form3Ref)}>
          <cc-input-text
            label="Name"
            name="name"
            reset-value=""
            required
            ?disabled=${isForm3Submitting}
          >
          </cc-input-text>
          <cc-input-text
            type="email"
            label="Email"
            name="email"
            reset-value=""
            value=""
            required
            ?disabled=${isForm3Submitting}
          ></cc-input-text>

          <cc-button primary type="submit" ?waiting=${isForm3Submitting}>Submit</cc-button>
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
  async onContextUpdate ({ component, context, onEvent, updateComponent, signal }) {

    onEvent('cc-ft-demo-with-smart-component:submit-form-1', ({ data }) => {
      console.log('submitting form 1', data);
      const form = component.getForm1();

      form.setState('submitting');

      submitForm1(data)
        .then(() => {
          form.reset().setState(null);
        })
        .catch((error) => {
          const transaction = form.beginTransaction();

          if (error.message === 'email-used') {
            transaction.addError('email', 'email-used');
          }

          transaction.setState(null).commit();
        });
    });

    onEvent('cc-ft-demo-with-smart-component:submit-form-2', ({ data }) => {
      console.log('submitting form 2', data);
      const form = component.getForm2();

      form.setState('submitting');

      submitForm2(data)
        .then(() => {
          form.reset().setState(null);
        })
        .catch((error) => {
          const transaction = form.beginTransaction();

          if (error.message === 'awful-name') {
            transaction.addError('name', 'awful-name');
          }

          transaction.setState(null).commit();
        });
    });

    // initial state
    const form3 = await component.getForm3();
    form3.setState({
      type: 'idle',
      values: {
        name: 'initial name',
        email: 'initial-email@example.com',
      },
    });

    onEvent('cc-ft-demo-with-smart-component:submit-form-3', ({ data }) => {
      console.log('submitting form 3', data);

      form3.setState({ type: 'submitting' });

      submitForm1(data)
        .then(() => {
          form3.reset().setState({ type: 'idle' });
        })
        .catch((error) => {
          const transaction = form3.beginTransaction();

          if (error.message === 'email-used') {
            transaction.addError('email', 'email-used');
          }

          transaction.setState({ type: 'idle' }).commit();
        });
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
