/* eslint-env node, mocha */

import './cc-input-text.js';
import { elementUpdated, expect, fixture } from '@open-wc/testing';
import * as hanbi from 'hanbi';
import { testAccessibility } from '../../../test/helpers/accessibility.js';
import { getStories } from '../../../test/helpers/get-stories.js';
import { sanitize } from '../../lib/i18n-sanitize.js';
import { addTranslations, setLanguage } from '../../lib/i18n.js';
import { clear, type } from '../../lib/test-utils.js';
import { invalid, VALID } from '../../lib/validation/validation.js';
import * as storiesModule from './cc-input-text.stories.js';

/**
 *
 * @param template
 * @return {Promise<CcInputText>}
 */
async function getElement (template) {
  const element = await fixture(template);
  await elementUpdated(element);
  return element;
}

const storiesToTest = getStories(storiesModule);

class CustomValidator {
  getErrorMessage (code) {
    if (code === 'errorCode') {
      return 'Custom validator error message';
    }
    throw new Error('Error code not supported');
  }

  validate (value) {
    if (value === 'valid') {
      return VALID;
    }

    return invalid('errorCode');
  };
}

function getErrorElement (element) {
  return element.shadowRoot.querySelector('#error-id');
}

async function getErrorMessageInnerText (element) {
  await elementUpdated(element);
  return getErrorElement(element)?.innerText;
}

async function assertNoErrorMessageDisplayed (element) {
  await elementUpdated(element);
  expect(getErrorElement(element)).to.eql(null);
}

async function assertErrorMessageInnerText (element, errorMessage) {
  await elementUpdated(element);
  expect(getErrorElement(element)).not.to.eql(null);
  expect(getErrorElement(element).innerText).to.eql(errorMessage);
}

function assertValid (element) {
  expect(element.checkValidity()).to.eql(true);
  expect(element.validity.valid).to.eql(true);
  expect(element.validationMessage).to.eql('');
  expect(element.errorMessage).to.eql(null);
}

function assertInvalid (element, message) {
  expect(element.checkValidity()).to.eql(false);
  expect(element.validity.valid).to.eql(false);
  expect(element.validity.customError).to.eql(true);
  expect(element.validationMessage).to.eql(message);
}

async function assertValidateMethodReturnsValid (element) {
  // call validate method with no report
  {
    const errorMessageBefore = await getErrorMessageInnerText(element);

    const validationResult = element.validate(false);
    expect(validationResult.valid).to.eql(true);

    // asserts the displayed error message didn't change
    const errorMessageAfter = await getErrorMessageInnerText(element);
    expect(errorMessageAfter).to.eql(errorMessageBefore);
  }

  // call validate method with report
  {
    const validationResult = element.validate(true);
    await elementUpdated(element);
    expect(validationResult.valid).to.eql(true);

    await assertNoErrorMessageDisplayed(element);
  }
}

async function assertValidateMethodReturnsInvalid (element, code, errorMessageAsText) {
  // call validate method with no report
  {
    const errorMessageBefore = await getErrorMessageInnerText(element);

    const validationResult = element.validate(false);
    expect(validationResult.valid).to.eql(false);
    expect(validationResult.code).to.eql(code);

    // asserts the displayed error message didn't change
    const errorMessageAfter = await getErrorMessageInnerText(element);
    expect(errorMessageAfter).to.eql(errorMessageBefore);
  }

  // call validate method with report
  {
    const validationResult = element.validate(true);
    expect(validationResult.valid).to.eql(false);
    expect(validationResult.code).to.eql(code);
    await assertErrorMessageInnerText(element, errorMessageAsText);
  }
}

before(() => {
  addTranslations('test', {
    'cc-input-text.error.empty': 'Empty error message',
    'cc-input-text.error.bad-email': 'Bad email error message',
  });
  setLanguage('test');
});

describe('Component cc-input-text', () => {
  describe('validity', () => {
    it('should be valid when default props', async () => {
      const element = await getElement(`<cc-input-text></cc-input-text>`);
      assertValid(element);
      await assertValidateMethodReturnsValid(element);
    });

    it('should return invalid with "empty" code when required but no value set', async () => {
      const element = await getElement(`<cc-input-text required></cc-input-text>`);
      assertInvalid(element, 'Empty error message');
      await assertValidateMethodReturnsInvalid(element, 'empty', 'Empty error message');
    });

    it('should return invalid with "empty" code when required but empty value set', async () => {
      const element = await getElement(`<cc-input-text required value=""></cc-input-text>`);
      assertInvalid(element, 'Empty error message');
      await assertValidateMethodReturnsInvalid(element, 'empty', 'Empty error message');
    });

    it('should return valid when required and value is set', async () => {
      const element = await getElement(`<cc-input-text required value="a value"></cc-input-text>`);
      assertValid(element);
      await assertValidateMethodReturnsValid(element);
    });

    it('should return valid when required validator is set and value respects constraint', async () => {
      const element = await getElement(`<cc-input-text value="valid"></cc-input-text>`);
      element.customValidator = new CustomValidator();
      assertValid(element);
      await assertValidateMethodReturnsValid(element);
    });

    it('should return invalid when required validator is set and value violates constraint', async () => {
      const element = await getElement(`<cc-input-text value="not valid"></cc-input-text>`);
      element.customValidator = new CustomValidator();
      assertInvalid(element, 'Custom validator error message');
      await assertValidateMethodReturnsInvalid(element, 'errorCode', 'Custom validator error message');
    });

    it('should return invalid with "empty" code when required and custom validator and empty value set', async () => {
      const element = await getElement(`<cc-input-text required value=""></cc-input-text>`);
      element.customValidator = new CustomValidator();
      assertInvalid(element, 'Empty error message');
      await assertValidateMethodReturnsInvalid(element, 'empty', 'Empty error message');
    });

    it('should return invalid with "errorCode" code when required and custom validator and invalid value set', async () => {
      const element = await getElement(`<cc-input-text required value="invalid"></cc-input-text>`);
      element.customValidator = new CustomValidator();
      assertInvalid(element, 'Custom validator error message');
      await assertValidateMethodReturnsInvalid(element, 'errorCode', 'Custom validator error message');
    });

    it('should call custom validator each time a character is typed', async () => {
      const element = await getElement(`<cc-input-text required value="v"></cc-input-text>`);
      const spy = hanbi.spy();
      element.customValidator = {
        validate (value) {
          spy.handler(value);
          return VALID;
        },
      };
      spy.reset();

      await type(element, 'a');
      await type(element, 'l');
      await type(element, 'u');
      await type(element, 'e');

      expect(spy.callCount).to.equal(4);
      expect(spy.getCall(0).args[0]).to.eql('va');
      expect(spy.getCall(1).args[0]).to.eql('val');
      expect(spy.getCall(2).args[0]).to.eql('valu');
      expect(spy.getCall(3).args[0]).to.eql('value');
    });

    it('should become valid when required and typing a character', async () => {
      const element = await getElement(`<cc-input-text required></cc-input-text>`);

      await type(element, 'a');

      assertValid(element);
      await assertValidateMethodReturnsValid(element);
    });

    it('should become invalid when required and erasing value', async () => {
      const element = await getElement(`<cc-input-text required value="a"></cc-input-text>`);

      await clear(element);

      assertInvalid(element, 'Empty error message');
      await assertValidateMethodReturnsInvalid(element, 'empty', 'Empty error message');
    });

    it('should become valid when required becomes false', async () => {
      const element = await getElement(`<cc-input-text required></cc-input-text>`);

      element.required = false;
      await elementUpdated(element);

      assertValid(element);
      await assertValidateMethodReturnsValid(element);
    });

    it('should become invalid when required becomes true', async () => {
      const element = await getElement(`<cc-input-text></cc-input-text>`);

      element.required = true;
      await elementUpdated(element);

      assertInvalid(element, 'Empty error message');
      await assertValidateMethodReturnsInvalid(element, 'empty', 'Empty error message');
    });

    it('should become invalid when type changes to email', async () => {
      const element = await getElement(`<cc-input-text value="not an email"></cc-input-text>`);

      element.type = 'email';
      await elementUpdated(element);

      assertInvalid(element, 'Bad email error message');
      await assertValidateMethodReturnsInvalid(element, 'badEmail', 'Bad email error message');
    });

    it('should become valid when type changes to text', async () => {
      const element = await getElement(`<cc-input-text type="email" value="not an email"></cc-input-text>`);

      element.type = 'text';
      await elementUpdated(element);

      assertValid(element);
      await assertValidateMethodReturnsValid(element);
    });

    it('should become invalid when custom validator changes', async () => {
      const element = await getElement(`<cc-input-text required value="valid"></cc-input-text>`);
      element.customValidator = new CustomValidator();
      assertValid(element);
      await assertValidateMethodReturnsValid(element);

      element.customValidator = {
        getErrorMessage (code) {
          return 'Custom validator error message';
        },
        validate (value) {
          return invalid('invalid');
        },
      };

      assertInvalid(element, 'Custom validator error message');
      await assertValidateMethodReturnsInvalid(element, 'invalid', 'Custom validator error message');
    });

    it('should have the right error message decoded from a sanitized error', async () => {
      const element = await getElement(`<cc-input-text required value="valid"></cc-input-text>`);
      element.customValidator = {
        getErrorMessage (code) {
          return sanitize`error<br>message`;
        },
        validate (value) {
          return invalid('invalid');
        },
      };

      assertInvalid(element, 'error\nmessage');
      await assertValidateMethodReturnsInvalid(element, 'invalid', 'error\nmessage');
    });

    it('should become invalid when errorMessage is set', async () => {
      const element = await getElement(`<cc-input-text value="value"></cc-input-text>`);

      element.errorMessage = 'error message';
      await elementUpdated(element);

      assertInvalid(element, 'error message');
    });

    it('should become invalid when errorMessage is set with DocumentFragment', async () => {
      const element = await getElement(`<cc-input-text value="value"></cc-input-text>`);

      element.errorMessage = sanitize`error<br>message`;
      await elementUpdated(element);

      assertInvalid(element, 'error\nmessage');
    });

    it('should become valid when we use the validate() method, even after setting the errorMessage property', async () => {
      const element = await getElement(`<cc-input-text value="value"></cc-input-text>`);

      element.errorMessage = 'error message';
      await elementUpdated(element);

      // when we use the validate method we come back to a normal validation
      await assertValidateMethodReturnsValid(element);
    });

    it('should become invalid when errorMessage is set with DocumentFragment', async () => {
      const element = await getElement(`<cc-input-text value="value"></cc-input-text>`);

      element.errorMessage = sanitize`error<br>message`;
      await elementUpdated(element);

      assertInvalid(element, 'error\nmessage');

      // when we use the validate method we come back to a normal validation
      await assertValidateMethodReturnsValid(element);
    });

    it('should use the given custom error message', async () => {
      const element = await getElement(`<cc-input-text required></cc-input-text>`);
      element.customErrorMessages = {
        empty: 'custom empty error',
      };

      await assertValidateMethodReturnsInvalid(element, 'empty', 'custom empty error');
    });

    it('should fallback to default error message when given custom error message does not contain the corresponding error code', async () => {
      const element = await getElement(`<cc-input-text required></cc-input-text>`);
      element.customErrorMessages = {
        unusedCode: 'custom empty error',
      };

      await assertValidateMethodReturnsInvalid(element, 'empty', 'Empty error message');
    });
  });
});

// describe(`Component: ${storiesModule.default.component}`, function () {
//   testAccessibility(storiesToTest);
// });
