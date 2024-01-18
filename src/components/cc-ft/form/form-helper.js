import { dispatchCustomEvent } from '../../../lib/events.js';
import { invalid } from '../validation/validation.js';

export function formHelper (host, formName) {
  const formElement = host.shadowRoot.querySelector(`form[name=${formName}]`);

  if (formElement == null) {
    throw new Error(`Could not find form element with name ${formName}`);
  }

  const errorsMap = new Map();

  return {
    reset () {
      formElement.reset();
    },
    error (inputName, error) {
      if (isStringEmpty(inputName)) {
        return;
      }
      if (isStringEmpty(error)) {
        return;
      }

      // check if input exists in form
      // TODO: we could use formElement.elements[inputName] directly unless there's a pitfall I don't have in mind
      const element = Array.from(formElement.elements).find((e) => e.name === inputName);
      if (element == null) {
        return;
      }

      errorsMap.set(inputName, {
        element,
        error,
      });
    },
    reportErrors () {
      // nothing to do if no errors
      if (errorsMap.size === 0) {
        return;
      }

      const formValidationResult = Array.from(errorsMap.entries())
        .map(([inputName, { element, error }]) => {
          // mark element as invalid
          // TODO: actually, can be handled by the input
          // element.setCustomValidity?.(error);
          // set errorMessage on element
          element.errorMessage = error;

          return {
            name: inputName,
            validationResult: invalid(error),
          };
        });

      // dispatch invalid event
      // TODO: Here we report only errors (in the submit-handler we report all fields even those who are valid)
      //  But I cannot easily do that here.
      //  Should we, in submit-handler, only report invalid fields?
      //  I mean, does it make sens to report for valid fields in an 'invalid' event?
      dispatchCustomEvent(formElement, 'invalid', formValidationResult);

      // focus first invalid field
      host.updateComplete.then(() => formElement.querySelector(':invalid, [internals-invalid]')?.focus());
    },
  };
}

/**
 * @param {string} str
 * @return {boolean}
 */
function isStringEmpty (str) {
  return str == null || str.length === 0;
}
