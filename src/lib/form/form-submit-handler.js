import { dispatchCustomEvent } from '../events.js';
import { isStringEmpty } from '../utils.js';
import { invalid, VALID } from '../validation/validation.js';
import { getFormData } from './form-data.js';

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
 *
 * @param {Element|LitElement} rootElement
 * @param { {[name: string]: (value:InputData|Array<InputData>, formData:Object) => string|null|void} } customValidation
 * @return {(function(*): void)|*}
 */
export function formSubmitHandler (rootElement, customValidation = {}) {
  return (event) => {

    event.preventDefault();

    const formElement = event.target;

    const data = getFormData(formElement);
    console.log(data);

    const formValidationResult = Array.from(formElement.elements)
      .filter((element) => shouldValidate(element, customValidation))
      .map((element) => {
        const name = element.name;

        // --- custom validation

        // custom validation overrides the classic validation

        const customValidateFunction = customValidation[name];
        if (customValidateFunction != null) {

          const validation = customValidateFunction(data[name], data);
          const validationResult = validation == null ? VALID : invalid(validation);

          // todo: for cc inputs, should we have a way to combine the input's validator and this custom validation.
          //       or should we consider this custom validation to overriding the validator set on cc input element?
          //       if override: <cc-input required> => we need to re-implement the required validation

          setCustomValidityOnElement(element, validationResult);

          return {
            name,
            validationResult,
          };
        }

        // for cc-input elements we use the validate() method with report
        if (isCcInputElement(element)) {
          return {
            name,
            validationResult: element.validate(true),
          };
        }

        // for native element validation, we don't like the reportValidity native behavior
        const isElementValid = element.checkValidity();

        return {
          name,
          validationResult: isElementValid ? VALID : invalid(element.validationMessage),
        };
      });

    const isFormValid = formValidationResult.every((result) => result.validationResult.valid);

    if (isFormValid) {
      // TODO
      dispatchCustomEvent(rootElement, 'formSubmit', { form: formElement.getAttribute('name'), data });
      dispatchCustomEvent(formElement, 'submit', { form: formElement.getAttribute('name'), data });
      dispatchCustomEvent(formElement, 'valid');
    }
    else {
      dispatchCustomEvent(formElement, 'invalid', formValidationResult);
      console.log('form invalid', formValidationResult);
      const focus = () => formElement.querySelector(':invalid, [internals-invalid]')?.focus();
      if (rootElement.updateComplete != null) {
        rootElement.updateComplete.then(focus());
      }
      else {
        focus();
      }
    }
  };

}

function shouldValidate (element, customValidation) {
  // name is mandatory
  if (isStringEmpty(element.name)) {
    return false;
  }

  return isCcInputElement(element)
    || isNativeInputElement(element)
    || customValidation[element.name] != null;
}

function isCcInputElement (element) {
  return element.validate != null && typeof element.validate === 'function';
}

function isNativeInputElement (element) {
  return element.checkValidity != null && typeof element.checkValidity === 'function' && element.willValidate;
}

function setCustomValidityOnElement (element, validationResult) {
  // cc input
  if (isCcInputElement(element)) {
    element.errorMessage = validationResult.valid ? null : validationResult.code;
  }
  // native input
  else {
    element.setCustomValidity?.(validationResult.valid ? '' : validationResult.code);
  }
}

function nearestParent (element, predicate) {
  let current = element;
  while (current != null && !predicate(current)) {
    current = current.parentNode;
  }
  return current;
}
