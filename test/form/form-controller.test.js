import { defineCE, elementUpdated, expect, fixture } from '@open-wc/testing';
import * as hanbi from 'hanbi';
import { html, LitElement } from 'lit';
import '../../src/components/cc-input-text/cc-input-text.js';
import '../../src/components/cc-button/cc-button.js';
import { dispatchCustomEvent } from '../../src/lib/events.js';
import { FormController } from '../../src/lib/form/form-controller.js';

const form = defineCE(
  class extends LitElement {
    constructor () {
      super();

      /** @type {FormController} */
      this._formCtrl = new FormController(this, {
        initialState: 'idle',
        onSubmit: (formData) => {
          this._callHttpApi(formData);
        },
        errorMessageMap: {
          'cc-error': () => 'Cc error',
          'native-error': 'Native error',
        },
      });
    }

    /**
     * @param {any} formData
     */
    async _callHttpApi (formData) {
      this._formCtrl.state = 'busy';

      await new Promise((resolve) => {
        setTimeout(resolve, 200);
      });

      this._formCtrl.state = 'idle';

      const errorReporter = this._formCtrl.errorReporter();
      if (formData['cc-input'].startsWith('error')) {
        errorReporter.add('cc-input', 'cc-error');
      }
      if (formData['native-input'].startsWith('error')) {
        errorReporter.add('native-input', 'native-error');
      }

      await errorReporter.reportOrElse(() => this._formCtrl.reset());

      dispatchCustomEvent(this, 'test:done');
    }

    render () {
      const isBusy = this._formCtrl.state === 'busy';

      return html`
            <form ${this._formCtrl.handleSubmit()}>
              <cc-input-text name="cc-input" required ?disabled=${isBusy}></cc-input-text>
              <input name="native-input" type="text" required ?disabled=${isBusy}>
              <cc-button type="submit" ?waiting=${isBusy}>Submit</cc-button>
            </form>
          `;
    }
  },
);

async function getElement (template) {
  const element = await fixture(template);
  await elementUpdated(element);
  return element;
}

async function getCustomFormElement () {
  const element = await getElement(`<${form}></${form}>`);

  const formElement = element.shadowRoot.querySelector('form');
  const ccInputElement = element.shadowRoot.querySelector('[name=cc-input]');
  const nativeInputElement = element.shadowRoot.querySelector('[name=native-input]');

  /** @type {function} */
  let done;
  const donePromise = new Promise((resolve) => {
    done = resolve;
  });
  element.addEventListener('test:done', () => {
    done?.();
  });

  return {
    element,
    submit: async () => {
      await elementUpdated(element);
      formElement.requestSubmit();
    },
    setCcInput: async (value) => {
      ccInputElement.value = value;
      await elementUpdated(element);
    },
    setNativeInput: async (value) => {
      nativeInputElement.value = value;
      await elementUpdated(element);
    },
    getCcInputValue: () => {
      return ccInputElement.value;
    },
    getNativeInputValue: () => {
      return ccInputElement.value;
    },
    get done () {
      return donePromise;
    },
    get activeElement () {
      return element.shadowRoot.activeElement;
    },
    get ccInputElement () {
      return ccInputElement;
    },
    get nativeInputElement () {
      return nativeInputElement;
    },
  };
}

describe('FormController', () => {

  it('should reset after form is submitted and when form is asynchronously valid', async () => {
    const element = await getCustomFormElement(`<${form}></${form}>`);
    await element.setCcInput('valid value');
    await element.setNativeInput('valid value');

    await element.submit();
    await element.done;

    expect(element.getCcInputValue()).to.eql('');
    expect(element.getNativeInputValue()).to.eql('');
  });

  it('should not reset after form is submitted and when form is asynchronously invalid', async () => {
    const element = await getCustomFormElement(`<${form}></${form}>`);
    await element.setCcInput('error value');
    await element.setNativeInput('valid value');

    await element.submit();
    await element.done;

    expect(element.getCcInputValue()).to.eql('error value');
    expect(element.getNativeInputValue()).to.eql('error value');
  });

  it('should focus the cc input after form is submitted and when form is asynchronously invalid', async () => {
    const element = await getCustomFormElement(`<${form}></${form}>`);
    await element.setCcInput('error value');
    await element.setNativeInput('valid value');

    await element.submit();
    await element.done;

    expect(element.activeElement).to.eql(element.ccInputElement);
  });

  it('should focus the native input after form is submitted and when form is asynchronously invalid', async () => {
    const element = await getCustomFormElement(`<${form}></${form}>`);
    await element.setCcInput('valid value');
    await element.setNativeInput('error value');

    await element.submit();
    await element.done;

    expect(element.activeElement).to.eql(element.nativeInputElement);
  });

  it('cc input element should have error displayed after form is submitted and when form is asynchronously invalid', async () => {
    const element = await getCustomFormElement(`<${form}></${form}>`);
    await element.setCcInput('error value');
    await element.setNativeInput('valid value');

    await element.submit();
    await element.done;

    expect(element.ccInputElement.errorMessage).to.eql('Cc error');
  });

  it('native input element should be invalid after form is submitted and when form is asynchronously invalid', async () => {
    const element = await getCustomFormElement(`<${form}></${form}>`);
    await element.setCcInput('valid value');
    await element.setNativeInput('error value');

    await element.submit();
    await element.done;

    expect(element.nativeInputElement.validity.valid).to.eql(false);
  });

  function spyController ({ initialState = 'idle', errorMessageMap = {} }) {
    const hostSpy = hanbi.spy();
    const submitSpy = hanbi.spy();

    const fakeHost = {
      addController: () => {},
      requestUpdate: hostSpy.handler,
      get updateComplete () {
        return Promise.resolve();
      },
    };

    const ctrl = new FormController(
      fakeHost,
      {
        initialState,
        onSubmit: submitSpy.handler,
        errorMessageMap,
      },
    );

    return {
      ctrl,
      spies: {
        requestUpdate: hostSpy,
        onSubmit: submitSpy,
      },
    };
  }

  it('should request host update when changing state', async () => {
    const spy = spyController({});

    spy.ctrl.state = 'new state';

    expect(spy.spies.requestUpdate.callCount).to.eql(1);
  });

  it('should not request host update when setting same state', async () => {
    const spy = spyController({});

    spy.ctrl.state = 'idle';

    expect(spy.spies.requestUpdate.callCount).to.eql(0);
  });

  it('should have the right state', async () => {
    const spy = spyController({});

    spy.ctrl.state = 'new state';

    expect(spy.ctrl.state).to.eql('new state');
  });

  it('should have null hostElement when none was registered', async () => {
    const spy = spyController({});

    expect(spy.ctrl.formElement).to.equal(null);
  });

  it('should have the registered formElement', async () => {
    const spy = spyController({});
    const formElement = await getElement('<form></form>');

    spy.ctrl.register(formElement);

    expect(spy.ctrl.formElement).to.equal(formElement);
  });

  it('should have the registered hostElement after awaiting the formElementRegistered promise', async () => {
    const spy = spyController({});
    const formElement = await getElement('<form></form>');

    setTimeout(() => {
      spy.ctrl.register(formElement);
    }, 100);
    await spy.ctrl.formElementRegistered;

    expect(spy.ctrl.formElement).to.equal(formElement);
  });

  it('should call the reset method on the registered formElement', async () => {
    const spy = spyController({});
    const formElement = await getElement('<form></form>');
    spy.ctrl.register(formElement);
    const resetSpy = hanbi.spy();
    formElement.reset = resetSpy.handler;

    spy.ctrl.reset();

    expect(resetSpy.callCount).to.equal(1);
  });

  it('should call the submit callback when form is submitted', async () => {
    const spy = spyController({});
    const formElement = await getElement('<form></form>');
    spy.ctrl.register(formElement);

    dispatchCustomEvent(formElement, 'form:submit', 'submittedData');

    expect(spy.spies.onSubmit.callCount).to.equal(1);
    expect(spy.spies.onSubmit.calledWith('submittedData')).to.equal(true);
  });

});
