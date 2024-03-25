import { dispatchCustomEvent } from '../events.js';
import { isStringEmpty } from '../utils.js';
import { focusInputAfterError, isCcInputElement, isNativeInputElement, getFormData } from './form-utils.js';
import { invalid, VALID } from './validation.js';

/**
 * @typedef {import('./validation.types.js').Validation} Validation
 * @typedef {import('./form.types.js').HTMLFormElementEvent} HTMLFormElementEvent
 * @typedef {import('./form.types.js').FormValidation} FormValidation
 * @typedef {import('./form.types.js').AggregatedFormData} FormSubmittedData
 */

/**
 * Creates a function that is to be set as a `<form>` element 'submit' event listener.
 *
 * This function performs a programmatic validation according to the constraints set on input elements.
 *
 * The validation is made according to the constraints set on input elements.
 *
 * When form is invalid, the first invalid input is automatically focused and a `form:invalid` event is dispatched with the validation result.
 * Error reporting is made on cc input elements: error message will be displayed.
 * But no error reporting will be made on native input elements because we think that the native behavior has bad UX and has bad accessibility design.
 *
 * When form is valid, a `form:submit` event is dispatched with the form data.
 *
 * @return {((e: HTMLFormElementEvent) => void)}
 * @fires {CustomEvent<FormValidation>} form:invalid - Whenever the form is submitted but some inputs are invalid
 * @fires {CustomEvent<AggregatedFormData>} form:submit - Whenever the form is submitted and all inputs are valid
 */
export function formSubmitHandler () {
  /**
   * @param {HTMLFormElementEvent} event
   */
  return (event) => {

    // we don't want the native form submit
    event.preventDefault();

    const formElement = event.target;

    // we find the elements that should be validated
    /** @type {FormValidation} */
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
    }
    else {
      dispatchCustomEvent(formElement, 'invalid', formValidation);
      focusInputAfterError(formElement);
    }
  };
}

/**
 * Find all elements within a `<form>` element that are to be validated.
 * For each, returns its name and a way to validate it.
 *
 * Elements to be validated are:
 * * element must have a `name` property
 * * element must have a `true` `willValidate` property
 * * element is a cc input element (see {@link isCcInputElement})
 * * or element is a native input element (see {@link isNativeInputElement})
 *
 * For cc inputs, validation will be a call to the validate function with report param set to true. (error messages will be displayed)
 * For native inputs, validation will be a call to the checkValidity function. (error messages won't be displayed because we don't like the native UX)
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
 * Checks whether an Element has a `name` property.
 *
 * @param {Element & {name?: string}} element
 * @return {element is Element & {name: string}}
 */
function hasName (element) {
  return !isStringEmpty(element.name);
}
