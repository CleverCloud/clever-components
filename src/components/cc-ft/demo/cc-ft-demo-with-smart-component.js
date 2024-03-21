import { css, html, LitElement } from 'lit';
import '../../cc-button/cc-button.js';
import '../../cc-input-text/cc-input-text.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { defineSmartComponent } from '../../../lib/define-smart-component.js';
import { dispatchCustomEvent } from '../../../lib/events.js';
import { FormController } from '../../../lib/form/form-controller.js';
import { updateRootContext } from '../../../lib/smart-manager.js';

/**
 * @typedef {{type: 'idle', values?: {name: string, email: string}}|{type: 'submitting'}} State3
 *
 * @typedef {import('../../../lib/form/form-controller.js').FormController<'email', 'email-used', null|'submitting'>} FormController1
 * @typedef {import('../../../lib/form/form-helper.js').FormHelper<'email', 'email-used', null|'submitting'>} FormHelper1
 * @typedef {import('../../../lib/form/form-controller.js').FormController<'name', 'awful-name', null|'submitting'>} FormController2
 * @typedef {import('../../../lib/form/form-helper.js').FormHelper<'name', 'awful-name', null|'submitting'>} FormHelper2
 * @typedef {import('../../../lib/form/form-controller.js').FormController<'email', 'email-used', State3>} FormController3
 * @typedef {import('../../../lib/form/form-helper.js').FormHelper<'email', 'email-used', State3>} FormHelper3
 * @typedef {import('../../../lib/form/form-controller.js').FormController<'email', 'email-used', null|'submitting'>} FormController4
 * @typedef {import('../../../lib/form/form-helper.js').FormHelper<'email', 'email-used', null|'submitting'>} FormHelper4
 *
 * @typedef {import('lit/directives/ref.js').Ref<HTMLFormElement>} HTMLFormElementRef
 */

export class CcFtDemoWithSmartComponent extends LitElement {
  static get properties () {
    return {
      form4Values: { type: Object },
    };
  }

  constructor () {
    super();

    /** @type {FormController1} */
    this._form1Ctrl = new FormController(this, {
      onSubmit: this._onForm1Submit.bind(this),
      errorsMap: {
        'email-used': 'Email already used',
      },
    });

    /** @type {FormController2} */
    this._form2Ctrl = new FormController(this, {
      onSubmit: this._onForm2Submit.bind(this),
      errorsMap: {
        'awful-name': () => 'I do not like your name, please change it!',
      },
    });

    /** @type {HTMLFormElementRef} */
    this._form3Ref = createRef();
    /** @type {FormController3} */
    this._form3Ctrl = new FormController(this, {
      onSubmit: this._onForm3Submit.bind(this),
      errorsMap: {
        'email-used': 'Email already used',
      },
      onStateChange: async (state) => {
        console.log(state);
        if (state.type === 'idle' && state.values != null) {
          const form = this._form3Ref.value;
          form.elements.name.value = state.values.name;
          form.elements.email.value = state.values.email;
        }
      },
    });

    /** @type {HTMLFormElementRef} */
    this._form4Ref = createRef();
    /** @type {FormController4} */
    this._form4Ctrl = new FormController(this, {
      onSubmit: this._onForm4Submit.bind(this),
      errorsMap: {
        'email-used': 'Email already used',
      },
    });
  }

  /**
   * @return {FormHelper1}
   */
  getForm1 () {
    return this._form1Ctrl.formHelper;
  }

  /**
   * @return {FormHelper2}
   */
  getForm2 () {
    return this._form2Ctrl.formHelper;
  }

  /**
   * @return {Promise<FormHelper3>}
   */
  getForm3 () {
    return this._form3Ctrl.getFormHelper();
  }

  /**
   * @return {FormHelper4}
   */
  getForm4 () {
    return this._form4Ctrl.formHelper;
  }

  /**
   *
   * @param {{name: string, email: string}} values
   */
  async setForm4Values (values) {
    const formHelper = await this._form4Ctrl.getFormHelper();
    formHelper.
    const form = this._form4Ref.value;
    form.elements.name.value = values.name;
    form.elements.email.value = values.email;
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
    const isForm4Submitting = this._form4Ctrl.formHelper?.state === 'submitting';

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
        <form name="form4" ${this._form3Ctrl.handleSubmit()} ${ref(this._form4Ref)}>
          <cc-input-text
            label="Name"
            name="name"
            reset-value=""
            required
            ?disabled=${isForm4Submitting}
          >
          </cc-input-text>
          <cc-input-text
            type="email"
            label="Email"
            name="email"
            reset-value=""
            value=""
            required
            ?disabled=${isForm4Submitting}
          ></cc-input-text>

          <cc-button primary type="submit" ?waiting=${isForm4Submitting}>Submit</cc-button>
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
   * @param {Object} args
   * @param {CcFtDemoWithSmartComponent} args.component
   * @param {any} args.onEvent
   */
  async onContextUpdate ({ component, onEvent }) {

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

    // setting form value from smart
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

    // setting form value from smart
    component.setForm4Values({
      name: 'initial name',
      email: 'initial-email@example.com',
    });

    onEvent('cc-ft-demo-with-smart-component:submit-form-4', ({ data }) => {
      console.log('submitting form 4', data);
      const form = component.getForm4();

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
  },
});

// -- API calls
function submitForm1 ({ _name, email }) {
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

function submitForm2 ({ name, _email }) {
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
