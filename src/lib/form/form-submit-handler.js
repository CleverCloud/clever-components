import { dispatchCustomEvent } from '../events.js';
import { isStringEmpty } from '../utils.js';
import { invalid, VALID } from '../validation/validation.js';
import { focusInputAfterError, isCcInputElement, isNativeInputElement, getFormData } from './form-utils.js';

/**
 * @typedef {import('../../mixins/abstract-input-element.js').AbstractInputElement} AbstractInputElement
 * @typedef {import('../validation/validation.types.js').Validation} Validation
 * @typedef {import('./form.types.js').HTMLFormElementEvent} HTMLFormElementEvent
 */

/*
Notes:

I tried to validate by groups of inputs but it doesn't work.
let say, I group, I will have something like:
```
const groups = { 'checkboxes': [elt1, elt2, elt3]);
```
for custom validaton, I can use the validate function once, and set the validity on every elements. ok

for not custom validation:
I still need to perform the validation on every elements of the group.

What do I gain here? It make the code strange, but I don't fill I gain much.

Also,
what about the result of the validation?
- should I group ?
- i can't really group, because let say we have a group of 2 inputs with different validation (one is required, the other isn't)
- what should the result of the validation for this group ?

*/

/**
 * @return {((e: HTMLFormElementEvent) => void)}
 */
export function formSubmitHandler () {
  /**
   * @param {Event & {target: HTMLFormElement}} event
   */
  return (event) => {

    // we don't want the native form submit
    event.preventDefault();

    const formElement = event.target;

    // we find the elements that should be validated
    const formValidation = getFormElementsToValidate(formElement)
      .map((e) => ({
        name: e.name,
        validation: e.validate(),
      }));

    // now we perform validation on all elements
    const isFormValid = formValidation.every((result) => result.validation.valid);

    if (isFormValid) {
      const data = getFormData(formElement);

      dispatchCustomEvent(formElement, 'submit', data);
      dispatchCustomEvent(formElement, 'valid');
    }
    else {
      dispatchCustomEvent(formElement, 'invalid', formValidation);
      focusInputAfterError(formElement);
    }
  };
}

/**
 *
 * @param {HTMLFormElement} formElement
 * @return {Array<{name: string, validate: () => Validation}>}
 */
function getFormElementsToValidate (formElement) {
  const elements = Array.from(formElement.elements);

  /** @type {Array<{name: string, validate: () => Validation}>} */
  const result = [];

  elements.forEach((element) => {
    if (hasName(element)) {
      const name = element.name;

      // for cc-input elements we use the validate() method with report
      if (isCcInputElement(element) && element.willValidate) {
        result.push({
          name,
          validate: () => element.validate(true),
        });
      }

      // for native element validation, we don't like the reportValidity native behavior
      if (isNativeInputElement(element) && element.willValidate) {
        result.push({
          name,
          validate: () => element.checkValidity() ? VALID : invalid(element.validationMessage),
        });
      }
    }
  });

  return result;
}

/**
 *
 * @param {Element & {name?: string}} element
 * @return {element is Element & {name: string}}
 */
function hasName (element) {
  return !isStringEmpty(element.name);
}
