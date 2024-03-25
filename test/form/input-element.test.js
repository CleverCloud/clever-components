import { defineCE, elementUpdated, expect, fixture } from '@open-wc/testing';
import * as hanbi from 'hanbi';
import { html } from 'lit';
import { InputElement } from '../../src/lib/form/input-element.js';
import { invalid, VALID } from '../../src/lib/form/validation.js';
import { isStringEmpty } from '../../src/lib/utils.js';

/**
 * @typedef {import('../../src/lib/form/input-element.types.js').InputElementSettings} InputElementSettings
 * @typedef {import('../../src/lib/form/input-element.types.js').ValidationSettings} ValidationSettings
 */

/**
 * @param {Partial<InputElementSettings & {validationSettingsProvider: () => Partial<ValidationSettings>}>} [inputSettings]
 */
function getCustomElement (inputSettings = {}) {
  /** @type {InputElementSettings} */
  const defaultSettings = {
    valuePropertyName: 'value',
    resetValuePropertyName: 'resetValue',
    errorSelector: '#error',
    inputSelector: '#value',
    validationSettingsProvider: () => ({
      validator: { validate: (value) => (isStringEmpty(value) || value === 'valid') ? VALID : invalid(value) },
      errorMessages: {},
    }),
  };

  const settings = {
    ...defaultSettings,
    ...inputSettings,
    validationSettingsProvider: () => ({
      ...(defaultSettings.validationSettingsProvider()),
      ...(inputSettings.validationSettingsProvider?.() ?? {}),
    }),
  };

  return defineCE(
    class extends InputElement {
      static get properties () {
        return {
          ...super.properties,
          value: { type: String },
          resetValue: { type: String },
        };
      }

      constructor () {
        super();

        this.value = '';
        this.resetValue = '';
      }

      getInputSettings () {
        return settings;
      }

      render () {
        return html`<input id="value" .value=${this.value}><div id="error">${this.errorMessage}</div>`;
      }
    },
  );
}

/**
 * @param {Partial<InputElementSettings & {validationSettingsProvider: () => Partial<ValidationSettings>}>} [inputSettings]
 */
async function getInputElement (inputSettings = {}) {
  const customElement = getCustomElement(inputSettings);

  /** @type {InputElement} */
  const element = await getElement(`<${customElement}></${customElement}>`);
  return {
    element,
    async setValue (value) {
      element.value = value;
      await elementUpdated(element);
    },
  };
}

async function getElement (template) {
  const element = await fixture(template);
  await elementUpdated(element);
  return element;
}

describe('InputElement', () => {
  describe('validate method', () => {
    it('should return valid if value is valid', async () => {
      const input = await getInputElement();
      await input.setValue('valid');

      const validation = input.element.validate(false);

      expect(validation).to.eql(VALID);
    });

    it('should set valid validity if value is valid', async () => {
      const input = await getInputElement();
      await input.setValue('valid');

      input.element.validate(false);

      expect(input.element.validity.valid).to.eql(true);
    });

    it('should return invalid if value is not valid', async () => {
      const input = await getInputElement();
      await input.setValue('invalid');

      const validation = input.element.validate(false);

      expect(validation).to.eql(invalid('invalid'));
    });

    it('should set invalid validity if value is invalid', async () => {
      const input = await getInputElement();
      await input.setValue('invalid');

      input.element.validate(false);

      expect(input.element.validity.valid).to.eql(false);
    });

    it('should set the right validation message if value is invalid (error code)', async () => {
      const input = await getInputElement();
      await input.setValue('invalid');

      input.element.validate(false);

      expect(input.element.validationMessage).to.eql('invalid');
    });

    it('should set the right validation message if value is invalid (translated message)', async () => {
      const input = await getInputElement({
        validationSettingsProvider: () => ({
          errorMessages: {
            invalid: 'Translated message',
          },
        }),
      });
      await input.setValue('invalid');

      input.element.validate(false);

      expect(input.element.validationMessage).to.eql('Translated message');
    });

    it('should set the right validation message if value is invalid (translated message with function)', async () => {
      const input = await getInputElement({
        validationSettingsProvider: () => ({
          errorMessages: {
            invalid: () => 'Translated message',
          },
        }),
      });
      await input.setValue('invalid');

      input.element.validate(false);

      expect(input.element.validationMessage).to.eql('Translated message');
    });

    it('should set the right validation message if value is invalid (translated message with Node)', async () => {
      const errorMessage = await getElement('<div>This is a<br>translated <b>message</b></div>');
      const input = await getInputElement({
        validationSettingsProvider: () => ({
          errorMessages: {
            invalid: () => errorMessage,
          },
        }),
      });
      await input.setValue('invalid');

      input.element.validate(false);

      expect(input.element.validationMessage).to.eql('This is a\ntranslated message');
    });

    it('should call validator with value as first argument', async () => {
      const spy = hanbi.spy();

      const input = await getInputElement({
        validationSettingsProvider: () => ({
          validator: {
            validate: (value, formData) => {
              spy.handler(value, formData);
              return VALID;
            },
          },
        }),
      });
      spy.reset();

      await input.setValue('current value');

      expect(spy.callCount).to.eql(1);
      expect(spy.firstCall.args[0]).to.eql('current value');
      expect(spy.firstCall.args[1]).to.eql({});
    });

    it('should call validator with form data as second argument', async () => {
      const spy = hanbi.spy();

      const customElement = getCustomElement({
        validationSettingsProvider: () => ({
          validator: {
            validate: (value, formData) => {
              spy.handler(value, formData);
              return VALID;
            },
          },
          errorMessages: {},
        }),
      });

      /** @type {HTMLFormElement} */
      const element = await getElement(`<form><${customElement} name="input"></${customElement}><input name="another-input" value="another input value"></form>`);
      spy.reset();

      element.querySelector(customElement).value = 'current value';
      await elementUpdated(element);

      expect(spy.callCount).to.eql(1);
      expect(spy.firstCall.args[0]).to.eql('current value');
      expect(spy.firstCall.args[1]).to.eql({
        input: 'current value',
        'another-input': 'another input value',
      });
    });

    it('should not set the errorMessage property if report is not requested', async () => {
      const input = await getInputElement();
      await input.setValue('invalid');

      input.element.validate(false);

      expect(input.element.errorMessage).to.eql(null);
    });

    it('should not change the errorMessage property if report is not requested', async () => {
      const input = await getInputElement();
      await input.setValue('invalid');
      input.element.validate(true);

      await input.setValue('invalid-again');
      input.element.validate(false);

      expect(input.element.errorMessage).to.eql('invalid');
    });

    it('should not clear the errorMessage property if report is not requested', async () => {
      const input = await getInputElement();
      await input.setValue('invalid');
      input.element.validate(true);

      await input.setValue('valid');
      input.element.validate(false);

      expect(input.element.errorMessage).to.eql('invalid');
    });

    it('should set the errorMessage property if report is requested', async () => {
      const input = await getInputElement();
      await input.setValue('invalid');

      input.element.validate(true);

      expect(input.element.errorMessage).to.eql('invalid');
    });

    it('should not change the errorMessage property if report is requested', async () => {
      const input = await getInputElement();
      await input.setValue('invalid');
      input.element.validate(true);

      await input.setValue('invalid-again');
      input.element.validate(true);

      expect(input.element.errorMessage).to.eql('invalid-again');
    });

    it('should clear the errorMessage if report is requested', async () => {
      const input = await getInputElement();
      await input.setValue('invalid');
      input.element.validate(true);

      await input.setValue('valid');
      input.element.validate(true);

      expect(input.element.errorMessage).to.eql(null);
    });

    it('should set the right errorMessage property if value is invalid (error code)', async () => {
      const input = await getInputElement();
      await input.setValue('invalid');

      input.element.validate(true);

      expect(input.element.errorMessage).to.eql('invalid');
    });

    it('should set the right errorMessage property if value is invalid (translated message)', async () => {
      const input = await getInputElement({
        validationSettingsProvider: () => ({
          errorMessages: {
            invalid: 'Translated message',
          },
        }),
      });
      await input.setValue('invalid');

      input.element.validate(true);

      expect(input.element.errorMessage).to.eql('Translated message');
    });

    it('should set the right errorMessage property if value is invalid (translated message with function)', async () => {
      const input = await getInputElement({
        validationSettingsProvider: () => ({
          errorMessages: {
            invalid: () => 'Translated message',
          },
        }),
      });
      await input.setValue('invalid');

      input.element.validate(true);

      expect(input.element.errorMessage).to.eql('Translated message');
    });

    it('should set the right errorMessage property if value is invalid (translated message with Node)', async () => {
      const errorMessage = await getElement('<div>This is a<br>translated <b>message</b></div>');
      const input = await getInputElement({
        validationSettingsProvider: () => ({
          errorMessages: {
            invalid: () => errorMessage,
          },
        }),
      });
      await input.setValue('invalid');

      input.element.validate(true);

      expect(input.element.errorMessage).to.eql(errorMessage);
    });
  });

  it('should use getErrorMessage method from validator when errorMessage does not have the code translation', async () => {
    const input = await getInputElement({
      validationSettingsProvider: () => ({
        errorMessages: {
          invalid: 'Translated message',
        },
        validator: {
          validate: (value) => (isStringEmpty(value) || value === 'valid') ? VALID : invalid(value),
          getErrorMessage (code) {
            if (code === 'not-valid') {
              return 'This is not valid!';
            }
            return null;
          },
        },
      }),
    });
    await input.setValue('not-valid');

    input.element.validate(true);

    expect(input.element.errorMessage).to.eql('This is not valid!');
  });

  it('should fallback to code when error translation is not found', async () => {
    const input = await getInputElement({
      validationSettingsProvider: () => ({
        errorMessages: {
          'not-valid': () => null,
        },
        validator: {
          validate: (value) => (isStringEmpty(value) || value === 'valid') ? VALID : invalid(value),
          getErrorMessage (_code) {
            return null;
          },
        },
      }),
    });
    await input.setValue('not-valid');

    input.element.validate(true);

    expect(input.element.errorMessage).to.eql('not-valid');
  });

  it('should call the inputDataProvider callback to get form data', async () => {
    const spy = hanbi.spy();

    const customElement = getCustomElement({
      inputDataProvider: () => {
        spy.handler();
        return 'expected value';
      },
    });

    /** @type {HTMLFormElement} */
    const element = await getElement(`<form><${customElement} name="input"></${customElement}></form>`);

    expect(spy.callCount).to.eql(1);
    expect(new FormData(element).get('input')).to.eql('expected value');
  });

  it('should provide the form data that is returned by the inputDataProvider', async () => {
    const customElement = getCustomElement({
      inputDataProvider: () => {
        return 'expected value';
      },
    });

    /** @type {HTMLFormElement} */
    const element = await getElement(`<form><${customElement} name="input"></${customElement}></form>`);

    expect(new FormData(element).get('input')).to.eql('expected value');
  });

  it('by default, should provide the value as form data', async () => {
    const customElement = getCustomElement();

    /** @type {HTMLFormElement} */
    const element = await getElement(`<form><${customElement} name="input"></${customElement}></form>`);

    element.querySelector(customElement).value = 'current value';
    await elementUpdated(element);

    expect(new FormData(element).get('input')).to.eql('current value');
  });

  it('should have invalid validity when setting errorMessage property', async () => {
    const input = await getInputElement();
    await input.setValue('valid');

    input.element.errorMessage = 'another error message';
    await elementUpdated(input.element);

    expect(input.element.validity.valid).to.eql(false);
  });

  it('should have valid validity when resetting errorMessage property', async () => {
    const input = await getInputElement();
    await input.setValue('valid');
    input.element.errorMessage = 'another error message';
    await elementUpdated(input.element);

    input.element.errorMessage = '';
    await elementUpdated(input.element);

    expect(input.element.validity.valid).to.eql(true);
  });

  it('should have validationMessage when setting errorMessage property (with string)', async () => {
    const input = await getInputElement();
    await input.setValue('valid');

    input.element.errorMessage = 'another error message';
    await elementUpdated(input.element);

    expect(input.element.validationMessage).to.eql('another error message');
  });

  it('should have validationMessage when setting errorMessage property (with Node)', async () => {
    const input = await getInputElement();
    await input.setValue('valid');

    input.element.errorMessage = await getElement('<div>another<br><b>error</> <i>message</i>');
    await elementUpdated(input.element);

    expect(input.element.validationMessage).to.eql('another\nerror message');
  });

  it('should call validate method when value changes', async () => {
    const input = await getInputElement();

    const validateStub = hanbi.stubMethod(input.element, 'validate');
    await input.setValue('valid');

    expect(validateStub.callCount).to.eql(1);
    expect(validateStub.calledWith(false)).to.eql(true);
  });

  it('should call validate method when customValidator changes', async () => {
    const input = await getInputElement();

    const validateStub = hanbi.stubMethod(input.element, 'validate');
    input.element.customValidator = {
      validate (_value, _formData) {
        return VALID;
      },
    };
    await elementUpdated(input.element);

    expect(validateStub.callCount).to.eql(1);
    expect(validateStub.calledWith(false)).to.eql(true);
  });

  it('should call validate method when customErrorMessages changes', async () => {
    const input = await getInputElement();

    const validateStub = hanbi.stubMethod(input.element, 'validate');
    input.element.customErrorMessages = {};
    await elementUpdated(input.element);

    expect(validateStub.callCount).to.eql(1);
    expect(validateStub.calledWith(false)).to.eql(true);
  });

  it('should call validate method when errorMessage property changes to something empty', async () => {
    const input = await getInputElement();

    const validateStub = hanbi.stubMethod(input.element, 'validate');
    input.element.errorMessage = '';
    await elementUpdated(input.element);

    expect(validateStub.called).to.eql(true);
  });

  it('should not call validate method when errorMessage property changes to something not empty', async () => {
    const input = await getInputElement();

    const validateStub = hanbi.stubMethod(input.element, 'validate');
    input.element.errorMessage = 'an error message';
    await elementUpdated(input.element);

    expect(validateStub.called).to.eql(false);
  });

  it('should reset value using the resetValue property when resetting <form>', async () => {
    const customElement = getCustomElement();

    /** @type {HTMLFormElement} */
    const formElement = await getElement(`<form><${customElement} name="input" value="current value"></${customElement}></form>`);
    const inputElement = formElement.querySelector(customElement);

    inputElement.resetValue = 'reset value';

    formElement.reset();
    await elementUpdated(formElement);

    expect(inputElement.value).to.eql('reset value');
  });

});
