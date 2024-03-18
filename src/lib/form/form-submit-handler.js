import { dispatchCustomEvent } from '../events.js';
import { isStringEmpty } from '../utils.js';
import { invalid, VALID } from '../validation/validation.js';
import { focusInputAfterError, isCcInputElement, isNativeInputElement, getFormData } from './form-utils.js';

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
 * @return {(function(*): void)|*}
 */
export function formSubmitHandler () {
  return (event) => {

    event.preventDefault();

    const formElement = event.target;

    const data = getFormData(formElement);
    console.log(data);

    const formValidationResult = Array.from(formElement.elements)
      .filter((element) => shouldValidate(element))
      .map((element) => {
        const name = element.name;

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
      dispatchCustomEvent(formElement, 'submit', { form: formElement.getAttribute('name'), data });
      dispatchCustomEvent(formElement, 'valid');
    }
    else {
      dispatchCustomEvent(formElement, 'invalid', formValidationResult);
      focusInputAfterError(formElement);
    }
  };

}

function shouldValidate (element) {
  // name is mandatory
  if (isStringEmpty(element.name)) {
    return false;
  }

  return isCcInputElement(element)
    || isNativeInputElement(element);
}
