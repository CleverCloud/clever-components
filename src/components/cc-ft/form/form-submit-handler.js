import { dispatchCustomEvent } from '../../../lib/events.js';
import { VALID, invalid, RequiredValidator } from '../validation/validation.js';

/**
 *
 * @param host
 * @param propertyMap
 * @param { {[name: string]: (value:string|string[]) => string|null} } customValidation
 * @return {(function(*): void)|*}
 */
export function getSubmitHandler (host, propertyMap = {}, customValidation = {}) {
  return (event) => {
    // we don't want native validation
    event.preventDefault();

    const formEl = event.target;

    const data = Object.fromEntries(new FormData(formEl));

    Object.entries(propertyMap ?? {}).forEach(([inputName, propertyName]) => {
      data[inputName] = formEl.elements[inputName][propertyName];
    });

    const formValidationResult = Array.from(formEl.elements)
      .filter((element) => element.validate != null || element.checkValidity != null || customValidation[element.name] != null)
      .map((element) => {

        // --- custom validation

        const customValidateFunction = customValidation[element.name];

        if (customValidateFunction != null) {
          const validator = new RequiredValidator(element.required === true, {
            validate (value) {
              const validation = customValidateFunction(value);
              if (validation == null) {
                return VALID;
              }
              return invalid(validation);
            },
          });

          // --- native inputs validation

          const validationResult = validator.validate(data[element.name]);
          if (!validationResult.valid) {
            element.setCustomValidity?.(validator.getErrorMessage?.(validationResult.code) ?? validationResult.code);
          }
          else {
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
      // TODO: handle form name to dispatch a different event depending on the form?
      // We have access to the form name through the formEl so its easy but how should we transmit it?
      dispatchCustomEvent(host, 'formSubmit', { data });
    }
    else {
      dispatchCustomEvent(formEl, 'invalid', formValidationResult);
      console.log('form invalid', formValidationResult);
      host.updateComplete.then(() => formEl.querySelector(':invalid, [internals-invalid]')?.focus());
    }
  };
}

export const formSubmitHandler = (e) => {
  e.preventDefault();
  const formEl = e.target;
  const data = Object.fromEntries(new FormData(formEl));

  const isFormValid = Array.from(formEl.elements).filter((element) => element.validate != null)
    .map((element) => element.validate(true).valid)
    .every((result) => result);

  if (isFormValid) {
    // TODO: handle form name to dispatch a different event depending on the form?
    // We have access to the form name through the formEl so its easy but how should we transmit it?
    dispatchCustomEvent(formEl.getRootNode().host, 'formSubmit', { data });
  }
  else {
    formEl.querySelector(':invalid, [internals-invalid]')?.focus();
  }
};
