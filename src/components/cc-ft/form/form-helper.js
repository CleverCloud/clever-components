import { dispatchCustomEvent } from '../../../lib/events.js';
import { invalid } from '../../../lib/validation/validation.js';

export function formHelper (host, formName) {
  const formElement = host.shadowRoot.querySelector(formName != null ? `form[name=${formName}]` : 'form');

  if (formElement == null) {
    throw new Error(formName != null ? `Could not find <form> element with name ${formName}` : `Could not find <form> element`);
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
      const element = formElement.elements[inputName];
      if (element == null) {
        return;
      }

      errorsMap.set(inputName, {
        element,
        error,
      });
    },
    reportErrors () {
      console.log('report', errorsMap);
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
      dispatchCustomEvent(formElement, 'async-invalid', formValidationResult);

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
