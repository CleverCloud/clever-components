import { html } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { describe, expect, it, vi } from 'vitest';
import { defineCE, elementUpdated } from '../helpers/element-helper.js';
import { CcFormControlElement } from '../../src/lib/form/cc-form-control-element.abstract.js';
import { ValidValidator, Validation, createValidator } from '../../src/lib/form/validation.js';
import { isStringEmpty } from '../../src/lib/utils.js';
import { getElement } from '../helpers/element-helper.js';

function getCustomElement(inputSettings = {}) {
  const defaultSettings = {
    valuePropertyName: 'value',
    resetValuePropertyName: 'resetValue',
    errorSelector: '#error',
    inputSelector: '#value',
    validator: createValidator((value) => {
      return isStringEmpty(value) || value === 'valid' ? Validation.VALID : Validation.invalid(value);
    }),
    errorMessages: {},
  };

  const settings = {
    ...defaultSettings,
    ...inputSettings,
  };

  return defineCE(
    class extends CcFormControlElement {
      static get properties() {
        return {
          ...super.properties,
          resetValue: { type: String },
          value: { type: String },
        };
      }

      constructor() {
        super();

        this.value = '';
        this.resetValue = '';

        /** @type {HTMLElementRef} */
        this._errorRef = createRef();

        /** @type {HTMLInputElementRef} */
        this._inputRef = createRef();
      }

      /**
       * @return {HTMLElement}
       * @protected
       */
      _getFormControlElement() {
        return this._inputRef.value;
      }

      /**
       * @return {HTMLElement}
       * @protected
       */
      _getErrorElement() {
        return this._errorRef.value;
      }

      /**
       * @return {ErrorMessageMap}
       * @protected
       */
      _getErrorMessages() {
        if (settings.errorMessages == null) {
          return super._getErrorMessages();
        }
        return settings.errorMessages;
      }

      /**
       * @return {Validator}
       * @protected
       */
      _getValidator() {
        if (settings.validator == null) {
          return super._getValidator();
        }
        return settings.validator;
      }

      _getFormControlData() {
        if (settings.formControlData == null) {
          return super._getFormControlData();
        }
        return settings.formControlData();
      }

      render() {
        return html`<input id="value" .value=${this.value} ${ref(this._inputRef)} />
          <div id="error" ${ref(this._errorRef)}>${this.errorMessage}</div>`;
      }
    },
  );
}

/**
 * @param {any} [inputSettings]
 */
async function getFormControlElement(inputSettings = {}) {
  const customElement = getCustomElement(inputSettings);

  /** @type {CcFormControlElement} */
  const element = await getElement(`<${customElement}></${customElement}>`);
  return {
    element,
    async setValue(value) {
      element.value = value;
      await elementUpdated(element);
    },
  };
}

describe('InputElement', () => {
  describe('validate method', () => {
    it('should return valid if value is valid', async () => {
      const input = await getFormControlElement();
      await input.setValue('valid');

      const validation = input.element.validate();
      input.element.reportInlineValidity();

      expect(validation).toEqual(Validation.VALID);
    });

    it('should set valid validity if value is valid', async () => {
      const formControl = await getFormControlElement();
      await formControl.setValue('valid');

      formControl.element.validate();
      formControl.element.reportInlineValidity();

      expect(formControl.element.validity.valid).toBe(true);
    });

    it('should return invalid if value is not valid', async () => {
      const formControl = await getFormControlElement();
      await formControl.setValue('invalid');

      const validation = formControl.element.validate();
      formControl.element.reportInlineValidity();

      expect(validation).toEqual(Validation.invalid('invalid'));
    });

    it('should set invalid validity if value is invalid', async () => {
      const formControl = await getFormControlElement();
      await formControl.setValue('invalid');

      formControl.element.validate();
      formControl.element.reportInlineValidity();

      expect(formControl.element.validity.valid).toBe(false);
    });

    it('should set the right validation message if value is invalid (error code)', async () => {
      const formControl = await getFormControlElement();
      await formControl.setValue('invalid');

      formControl.element.validate();
      formControl.element.reportInlineValidity();

      expect(formControl.element.validationMessage).toBe('invalid');
    });

    it('should set the right validation message if value is invalid (translated message)', async () => {
      const formControl = await getFormControlElement({
        errorMessages: {
          invalid: 'Translated message',
        },
      });
      await formControl.setValue('invalid');

      formControl.element.validate();
      formControl.element.reportInlineValidity();

      expect(formControl.element.validationMessage).toBe('Translated message');
    });

    it('should set the right validation message if value is invalid (translated message with function)', async () => {
      const formControl = await getFormControlElement({
        errorMessages: {
          invalid: () => 'Translated message',
        },
      });
      await formControl.setValue('invalid');

      formControl.element.validate();
      formControl.element.reportInlineValidity();

      expect(formControl.element.validationMessage).toBe('Translated message');
    });

    it('should set the right validation message if value is invalid (translated message with Node)', async () => {
      const errorMessage = await getElement('<div>This is a<br>translated <b>message</b></div>');
      const formControl = await getFormControlElement({
        errorMessages: {
          invalid: () => errorMessage,
        },
      });
      await formControl.setValue('invalid');

      formControl.element.validate();
      formControl.element.reportInlineValidity();

      expect(formControl.element.validationMessage).toBe('This is a translated message');
    });

    it('should call validator with value as first argument', async () => {
      const spy = vi.fn();

      const formControl = await getFormControlElement({
        validator: {
          validate: (value, formData) => {
            spy(value, formData);
            return Validation.VALID;
          },
        },
      });
      spy.mockClear();

      await formControl.setValue('current value');

      expect(spy.mock.calls.length).toBe(1);
      expect(spy.mock.calls[0][0]).toBe('current value');
      expect(spy.mock.calls[0][1]).toEqual({});
    });

    it('should call validator with form data as second argument', async () => {
      const spy = vi.fn();

      const customElement = getCustomElement({
        validator: {
          validate: (value, formData) => {
            spy(value, formData);
            return Validation.VALID;
          },
        },
        errorMessages: {},
      });

      /** @type {HTMLFormElement} */
      const element = await getElement(
        `<form><${customElement} name="input"></${customElement}><input name="another-input" value="another input value"></form>`,
      );
      spy.mockClear();

      element.querySelector(customElement).value = 'current value';
      await elementUpdated(element);

      expect(spy.mock.calls.length).toBe(1);
      expect(spy.mock.calls[0][0]).toBe('current value');
      expect(spy.mock.calls[0][1]).toEqual({
        input: 'current value',
        'another-input': 'another input value',
      });
    });

    it('should not set the errorMessage property if report is not requested', async () => {
      const formControl = await getFormControlElement();
      await formControl.setValue('invalid');

      formControl.element.validate();

      expect(formControl.element.errorMessage).toBe(null);
    });

    it('should not change the errorMessage property if report is not requested', async () => {
      const formControl = await getFormControlElement();
      await formControl.setValue('invalid');
      formControl.element.validate();
      formControl.element.reportInlineValidity();

      await formControl.setValue('invalid-again');
      formControl.element.validate();

      expect(formControl.element.errorMessage).toBe('invalid');
    });

    it('should not clear the errorMessage property if report is not requested', async () => {
      const formControl = await getFormControlElement();
      await formControl.setValue('invalid');
      formControl.element.validate();
      formControl.element.reportInlineValidity();

      await formControl.setValue('valid');
      formControl.element.validate();

      expect(formControl.element.errorMessage).toBe('invalid');
    });

    it('should set the errorMessage property if report is requested', async () => {
      const formControl = await getFormControlElement();
      await formControl.setValue('invalid');

      formControl.element.validate();
      formControl.element.reportInlineValidity();

      expect(formControl.element.errorMessage).toBe('invalid');
    });

    it('should change the errorMessage property if report is requested', async () => {
      const formControl = await getFormControlElement();
      await formControl.setValue('invalid');
      formControl.element.validate();
      formControl.element.reportInlineValidity();

      await formControl.setValue('invalid-again');
      formControl.element.validate();
      formControl.element.reportInlineValidity();

      expect(formControl.element.errorMessage).toBe('invalid-again');
    });

    it('should clear the errorMessage if report is requested', async () => {
      const formControl = await getFormControlElement();
      await formControl.setValue('invalid');
      formControl.element.validate();
      formControl.element.reportInlineValidity();
      await elementUpdated(formControl.element);

      await formControl.setValue('valid');
      formControl.element.validate();
      formControl.element.reportInlineValidity();

      expect(formControl.element.errorMessage).toBe(null);
    });

    it('should set the right errorMessage property if value is invalid (error code)', async () => {
      const formControl = await getFormControlElement();
      await formControl.setValue('invalid');

      formControl.element.validate();
      formControl.element.reportInlineValidity();

      expect(formControl.element.errorMessage).toBe('invalid');
    });

    it('should set the right errorMessage property if value is invalid (translated message)', async () => {
      const formControl = await getFormControlElement({
        errorMessages: {
          invalid: 'Translated message',
        },
      });
      await formControl.setValue('invalid');

      formControl.element.validate();
      formControl.element.reportInlineValidity();

      expect(formControl.element.errorMessage).toBe('Translated message');
    });

    it('should set the right errorMessage property if value is invalid (translated message with function)', async () => {
      const formControl = await getFormControlElement({
        errorMessages: {
          invalid: () => 'Translated message',
        },
      });
      await formControl.setValue('invalid');

      formControl.element.validate();
      formControl.element.reportInlineValidity();

      expect(formControl.element.errorMessage).toBe('Translated message');
    });

    it('should set the right errorMessage property if value is invalid (translated message with Node)', async () => {
      const errorMessage = await getElement('<div>This is a<br>translated <b>message</b></div>');
      const formControl = await getFormControlElement({
        errorMessages: {
          invalid: () => errorMessage,
        },
      });
      await formControl.setValue('invalid');

      formControl.element.validate();
      formControl.element.reportInlineValidity();

      expect(formControl.element.errorMessage).toBe(errorMessage);
    });
  });

  it('should fallback to code when error message map does not know the error code', async () => {
    const formControl = await getFormControlElement({
      errorMessages: {},
      validator: {
        validate: (value) => (isStringEmpty(value) || value === 'valid' ? Validation.VALID : Validation.invalid(value)),
      },
    });
    await formControl.setValue('not-valid');

    formControl.element.validate();
    formControl.element.reportInlineValidity();

    expect(formControl.element.errorMessage).toEqual('not-valid');
  });

  it('should fallback to code when error message map returns null', async () => {
    const formControl = await getFormControlElement({
      errorMessages: {
        'not-valid': () => null,
      },
      validator: {
        validate: (value) => (isStringEmpty(value) || value === 'valid' ? Validation.VALID : Validation.invalid(value)),
      },
    });
    await formControl.setValue('not-valid');

    formControl.element.validate();
    formControl.element.reportInlineValidity();

    expect(formControl.element.errorMessage).toEqual('not-valid');
  });

  it('should call the _getFormControlData method to get form data', async () => {
    const spy = vi.fn();

    const customElement = getCustomElement({
      formControlData: () => {
        spy();
        return 'expected value';
      },
    });

    /** @type {HTMLFormElement} */
    await getElement(`<form><${customElement} name="input"></${customElement}></form>`);

    expect(spy.mock.calls.length).toEqual(1);
  });

  it('should provide the form data that is returned by the _getFormControlData', async () => {
    const customElement = getCustomElement({
      formControlData: () => 'expected value',
    });

    /** @type {HTMLFormElement} */
    const element = await getElement(`<form><${customElement} name="input"></${customElement}></form>`);

    expect(new FormData(element).get('input')).toEqual('expected value');
  });

  it('by default, should provide the value as form control data', async () => {
    const customElement = getCustomElement();

    /** @type {HTMLFormElement} */
    const element = await getElement(`<form><${customElement} name="input"></${customElement}></form>`);

    element.querySelector(customElement).value = 'current value';
    await elementUpdated(element);

    expect(new FormData(element).get('input')).toEqual('current value');
  });

  it('should have invalid validity when setting errorMessage property', async () => {
    const formControl = await getFormControlElement();
    await formControl.setValue('valid');

    formControl.element.errorMessage = 'another error message';
    await elementUpdated(formControl.element);

    expect(formControl.element.validity.valid).toEqual(false);
  });

  it('should have valid validity when resetting errorMessage property', async () => {
    const formControl = await getFormControlElement();
    await formControl.setValue('valid');
    formControl.element.errorMessage = 'another error message';
    await elementUpdated(formControl.element);

    formControl.element.errorMessage = '';
    await elementUpdated(formControl.element);

    expect(formControl.element.validity.valid).toEqual(true);
  });

  it('should have validationMessage when setting errorMessage property (with string)', async () => {
    const formControl = await getFormControlElement();
    await formControl.setValue('valid');

    formControl.element.errorMessage = 'another error message';
    await elementUpdated(formControl.element);

    expect(formControl.element.validationMessage).toEqual('another error message');
  });

  it('should have validationMessage when setting errorMessage property (with Node)', async () => {
    const formControl = await getFormControlElement();
    await formControl.setValue('valid');

    formControl.element.errorMessage = await getElement('<div>another<br><b>error</> <i>message</i>');
    await elementUpdated(formControl.element);

    expect(formControl.element.validationMessage).toEqual('another error message');
  });

  it('should call validate method when value changes', async () => {
    const formControl = await getFormControlElement();

    const validateStub = vi.spyOn(formControl.element, 'validate');
    await formControl.setValue('valid');

    expect(validateStub.mock.calls.length).toEqual(1);
  });

  it('should call validate method when customValidator changes', async () => {
    const formControl = await getFormControlElement();

    const validateStub = vi.spyOn(formControl.element, 'validate');
    formControl.element.customValidator = {
      validate(_value, _formData) {
        return Validation.VALID;
      },
    };
    await elementUpdated(formControl.element);

    expect(validateStub.mock.calls.length).toEqual(1);
  });

  it('should call validate method when customErrorMessages changes', async () => {
    const formControl = await getFormControlElement();

    const validateStub = vi.spyOn(formControl.element, 'validate');
    formControl.element.customErrorMessages = {};
    await elementUpdated(formControl.element);

    expect(validateStub.mock.calls.length).toEqual(1);
  });

  it('should call validate method when errorMessage property changes to something empty', async () => {
    const formControl = await getFormControlElement();

    const validateStub = vi.spyOn(formControl.element, 'validate');
    formControl.element.errorMessage = '';
    await elementUpdated(formControl.element);

    expect(validateStub).toHaveBeenCalled();
  });

  it('should not call validate method when errorMessage property changes to something not empty', async () => {
    const formControl = await getFormControlElement();

    const validateStub = vi.spyOn(formControl.element, 'validate');
    formControl.element.errorMessage = 'an error message';
    await elementUpdated(formControl.element);

    expect(validateStub).not.toHaveBeenCalled();
  });

  it('should use customValidator and built-in validator', async () => {
    const customValidator = new ValidValidator();
    const customValidatorSpy = vi.spyOn(customValidator, 'validate');
    customValidatorSpy;

    const builtInValidator = new ValidValidator();
    const builtInValidatorSpy = vi.spyOn(builtInValidator, 'validate');
    builtInValidatorSpy;

    const formControl = await getFormControlElement({
      validator: builtInValidator,
    });

    formControl.element.customValidator = customValidator;
    await elementUpdated(formControl.element);

    expect(builtInValidatorSpy).toHaveBeenCalled();
    expect(customValidatorSpy).toHaveBeenCalled();
  });

  it('should use built-in validator before customValidator', async () => {
    const customValidator = new ValidValidator();
    const customValidatorSpy = vi.spyOn(customValidator, 'validate');
    customValidatorSpy;

    const builtInValidator = {
      validate: () => Validation.invalid('invalid'),
    };
    const builtInValidatorSpy = vi.spyOn(builtInValidator, 'validate');
    builtInValidatorSpy;

    const formControl = await getFormControlElement({
      validator: builtInValidator,
    });

    formControl.element.customValidator = customValidator;
    await elementUpdated(formControl.element);

    expect(builtInValidatorSpy).toHaveBeenCalled();
    expect(customValidatorSpy).not.toHaveBeenCalled();
  });

  it('should reset value using the resetValue property when resetting <form>', async () => {
    const customElement = getCustomElement();

    /** @type {HTMLFormElement} */
    const formElement = await getElement(
      `<form><${customElement} name="input" value="current value"></${customElement}></form>`,
    );
    const formControlElement = formElement.querySelector(customElement);

    formControlElement.resetValue = 'reset value';

    formElement.reset();
    await elementUpdated(formElement);

    expect(formControlElement.value).toEqual('reset value');
  });

  it('should have the right form element', async () => {
    const customElement = getCustomElement();

    /** @type {HTMLFormElement} */
    const formElement = await getElement(
      `<form><${customElement} name="input" value="current value"></${customElement}></form>`,
    );
    const formControlElement = formElement.querySelector(customElement);

    expect(formControlElement.form).toEqual(formElement);
  });
});
