import { dispatchCustomEvent } from '../../../lib/events.js';
import { VALID, invalid } from '../validation/validation.js';

/**
 *
 * @param {FormData} formData
 */
function serializeFormData (formData) {
  const result = {};

  for (const [key, value] of formData) {
    if (result[key] == null) {
      result[key] = value;
    }
    else if (Array.isArray(result[key])) {
      result[key].push(value);
    }
    else {
      result[key] = [result[key], value];
    }
  }

  return result;
}

/**
 *
 * @param host
 * @param { {[name: string]: (value:string|string[]) => string|null|void} } customValidation
 * @return {(function(*): void)|*}
 */
export function formSubmitHandler (host, customValidation = {}) {
  return (event) => {

    event.preventDefault();

    const formEl = event.target;

    const data = serializeFormData(new FormData(formEl));
    console.log(data);

    const formValidationResult = Array.from(formEl.elements)
      .filter((element) => element.name?.length > 0 && (element.validate != null || (element.checkValidity != null && element.willValidate) || customValidation[element.name] != null))
      .map((element) => {

        // --- custom validation

        const customValidateFunction = customValidation[element.name];

        if (customValidateFunction != null) {
          const validation = customValidateFunction(data[element.name]);
          const validationResult = validation == null ? VALID : invalid(validation);

          // --- native inputs validation

          if (!validationResult.valid) {
            // this is necessary to make the element flagged as 'in error' so it can be focused
            element.setCustomValidity?.(validationResult.code);
          }
          else {
            // this is necessary to make the element flagged as 'NOT in error'
            element.setCustomValidity?.('');
          }

          // --- not native inputs validation
          // TODO: if we do not have a native input, `setCustomValidity` method won't work
          // TODO: should we warn about that?

          return {
            name: element.name,
            validationResult,
          };
        }

        // --- cc input elements validation,

        if (element.validate != null) {
          return {
            name: element.name,
            validationResult: element.validate(true),
          };
        }

        // --- native element validation

        // this strange `?.() ?? true` is here because of a button is part of the validated form elements
        // button doesn't have `checkValidity()` nor `validate()` methods.
        const isElementValid = element.checkValidity?.() ?? true;

        return {
          name: element.name,
          validationResult: isElementValid ? VALID : invalid('native error'),
        };
      });

    const isFormValid = formValidationResult.every((result) => result.validationResult.valid);

    if (isFormValid) {
      dispatchCustomEvent(host, 'formSubmit', { form: formEl.getAttribute('name'), data });
    }
    else {
      dispatchCustomEvent(formEl, 'invalid', formValidationResult);
      console.log('form invalid', formValidationResult);
      host.updateComplete.then(() => formEl.querySelector(':invalid, [internals-invalid]')?.focus());
    }
  };
}

// export const formSubmitHandler = (e) => {
//   e.preventDefault();
//   const formEl = e.target;
//   const data = Object.fromEntries(new FormData(formEl));
//
//   const isFormValid = Array.from(formEl.elements).filter((element) => element.validate != null)
//     .map((element) => element.validate(true).valid)
//     .every((result) => result);
//
//   if (isFormValid) {
//     // TODO: handle form name to dispatch a different event depending on the form?
//     // We have access to the form name through the formEl so its easy but how should we transmit it?
//     dispatchCustomEvent(formEl.getRootNode().host, 'formSubmit', { data });
//   }
//   else {
//     formEl.querySelector(':invalid, [internals-invalid]')?.focus();
//   }
// };
