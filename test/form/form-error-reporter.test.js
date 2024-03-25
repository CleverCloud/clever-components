import { elementUpdated, expect, fixture } from '@open-wc/testing';
import { FormErrorReporter } from '../../src/lib/form/form-error-reporter.js';
import '../../src/components/cc-input-text/cc-input-text.js';

async function getElement (template) {
  const element = await fixture(template);
  await elementUpdated(element);
  return element;
}

/**
 *
 * @param {Object} [settings]
 * @param {Object} [settings.errorMessageMap]
 * @param {string} [settings.formTemplate]
 * @return {Promise<FormErrorReporter>}
 */
async function getErrorReporter ({ errorMessageMap = {}, formTemplate = '' } = {}) {
  const formElement = await getElement(`<form>${formTemplate}</form>`);
  return new FormErrorReporter(
    {
      get formElement () {
        return formElement;
      },
      get _host () {
        return {
          get updateComplete () {
            return Promise.resolve();
          },
        };
      },
    },
    errorMessageMap,
  );
}

describe('FormErrorReporter', () => {
  it('should have no errors when just constructed', async () => {
    const errorReporter = await getErrorReporter();

    expect(errorReporter.hasError()).to.eql(false);
  });

  it('should have no errors when adding error with empty input name', async () => {
    const errorReporter = await getErrorReporter();

    errorReporter.add('', 'error');

    expect(errorReporter.hasError()).to.eql(false);
  });

  it('should have no errors when adding error with empty input name', async () => {
    const errorReporter = await getErrorReporter({
      formTemplate: (`<input name="input">`),
    });

    errorReporter.add('input', '');

    expect(errorReporter.hasError()).to.eql(false);
  });

  it('should have no errors when adding error with no corresponding input', async () => {
    const errorReporter = await getErrorReporter({
      formTemplate: (`<input name="input">`),
    });

    errorReporter.add('unknown-input', 'error');

    expect(errorReporter.hasError()).to.eql(false);
  });

  it('should have no errors when adding error with an input that is not considered as a real input element', async () => {
    const errorReporter = await getErrorReporter({
      formTemplate: (`<input type="button" name="button-input">`),
    });

    errorReporter.add('button-input', 'error');

    expect(errorReporter.hasError()).to.eql(false);
  });

  it('should have error after adding an error', async () => {
    const errorReporter = await getErrorReporter({
      formTemplate: (`<input type="text" name="input">`),
    });

    errorReporter.add('input', 'error');

    expect(errorReporter.hasError()).to.eql(true);
  });

  describe('with native input', () => {
    it('should set invalid validity', async () => {
      const errorReporter = await getErrorReporter({
        formTemplate: (`<input type="text" name="input">`),
      });
      const inputElement = errorReporter._formController.formElement.querySelector('[name=input]');
      errorReporter.add('input', 'error');

      await errorReporter.report();

      expect(inputElement.validity.valid).to.eql(false);
    });

    it('should set the given error code ', async () => {
      const errorReporter = await getErrorReporter({
        formTemplate: (`<input type="text" name="input">`),
      });
      const inputElement = errorReporter._formController.formElement.querySelector('[name=input]');
      errorReporter.add('input', 'error');

      await errorReporter.report();

      expect(inputElement.validationMessage).to.eql('error');
    });

    it('should set the associated error message', async () => {
      const errorReporter = await getErrorReporter({
        formTemplate: (`<input type="text" name="input">`),
        errorMessageMap: {
          error: 'Error message',
        },
      });
      const inputElement = errorReporter._formController.formElement.querySelector('[name=input]');
      errorReporter.add('input', 'error');

      await errorReporter.report();

      expect(inputElement.validationMessage).to.eql('Error message');
    });

    it('should set the associated error message (with function)', async () => {
      const errorReporter = await getErrorReporter({
        formTemplate: (`<input type="text" name="input">`),
        errorMessageMap: {
          error: () => 'Error message',
        },
      });
      const inputElement = errorReporter._formController.formElement.querySelector('[name=input]');
      errorReporter.add('input', 'error');

      await errorReporter.report();

      expect(inputElement.validationMessage).to.eql('Error message');
    });

    it('should set the associated error message (with Node)', async () => {
      const errorMessage = await getElement('<div>This is <br>an error <b>message</b></div>');
      const errorReporter = await getErrorReporter({
        formTemplate: (`<input type="text" name="input">`),
        errorMessageMap: {
          error: errorMessage,
        },
      });
      const inputElement = errorReporter._formController.formElement.querySelector('[name=input]');
      errorReporter.add('input', 'error');

      await errorReporter.report();

      expect(inputElement.validationMessage).to.eql('This is\nan error message');
    });
  });

  describe('with cc input', () => {
    it('should set invalid validity', async () => {
      const errorReporter = await getErrorReporter({
        formTemplate: (`<cc-input-text name="input">`),
      });
      const inputElement = errorReporter._formController.formElement.querySelector('[name=input]');
      errorReporter.add('input', 'error');

      await errorReporter.report();

      expect(inputElement.validity.valid).to.eql(false);
    });

    it('should set the given error code', async () => {
      const errorReporter = await getErrorReporter({
        formTemplate: (`<cc-input-text name="input">`),
      });
      const inputElement = errorReporter._formController.formElement.querySelector('[name=input]');
      errorReporter.add('input', 'error');

      await errorReporter.report();

      expect(inputElement.errorMessage).to.eql('error');
    });

    it('should set the associated error message', async () => {
      const errorReporter = await getErrorReporter({
        formTemplate: (`<cc-input-text name="input">`),
        errorMessageMap: {
          error: 'Error message',
        },
      });
      const inputElement = errorReporter._formController.formElement.querySelector('[name=input]');
      errorReporter.add('input', 'error');

      await errorReporter.report();

      expect(inputElement.errorMessage).to.eql('Error message');
    });

    it('should set the associated error message (with function)', async () => {
      const errorReporter = await getErrorReporter({
        formTemplate: (`<cc-input-text name="input">`),
        errorMessageMap: {
          error: () => 'Error message',
        },
      });
      const inputElement = errorReporter._formController.formElement.querySelector('[name=input]');
      errorReporter.add('input', 'error');

      await errorReporter.report();

      expect(inputElement.errorMessage).to.eql('Error message');
    });

    it('should set the associated error message on native input (with Node)', async () => {
      const errorMessage = await getElement('<div>This is <br>an error <b>message</b></div>');
      const errorReporter = await getErrorReporter({
        formTemplate: (`<cc-input-text name="input">`),
        errorMessageMap: {
          error: errorMessage,
        },
      });
      const inputElement = errorReporter._formController.formElement.querySelector('[name=input]');
      errorReporter.add('input', 'error');

      await errorReporter.report();

      expect(inputElement.errorMessage).to.eql(errorMessage);
    });
  });
});
