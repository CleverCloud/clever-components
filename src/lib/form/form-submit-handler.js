import { isStringEmpty } from '../utils.js';
import {
  focusFirstFormControlWithError,
  getFormDataMap,
  isCcFormControlElement,
  isFormControlElementLike,
} from './form-utils.js';
import { CcFormInvalidEvent, CcFormValidEvent } from './form.events.js';
import { Validation } from './validation.js';

/**
 * @typedef {import('./validation.types.js').Validity} Validity
 * @typedef {import('./form.types.js').HTMLFormElementEvent} HTMLFormElementEvent
 * @typedef {import('./form.types.js').FormValidity} FormValidity
 * @typedef {import('./form.types.js').FormDataMap} FormSubmittedData
 * @typedef {import('./form.types.js').SubmitHandlerCallbacks} SubmitHandlerCallbacks
 */

/**
 * Creates a function that is to be set as a `<form>` element 'submit' event listener.
 *
 * This function performs a programmatic validation according to the constraints set on form control elements.
 *
 * When form is invalid, the first invalid form control is automatically focused and the `onInvalid` callback is called with the validation result.
 * Also, a `form:invalid` event is dispatched with the validation result.
 *
 * Error reporting is made on cc form control elements: inline error message will be displayed.
 * But no error reporting will be made on native form control elements because we think that the native behavior has bad UX and has bad accessibility design.
 *
 * When form is valid, the `onValid` callback is called and a `form:valid` event is dispatched with the form data.
 *
 * @param {SubmitHandlerCallbacks} callbacks
 * @return {((e: HTMLFormElementEvent) => void)}
 */
export function formSubmitHandler(callbacks) {
  /**
   * @param {Event & {target: HTMLFormElement}} event
   */
  return (event) => {
    // we don't want the native form submit
    event.preventDefault();

    /** @type {HTMLFormElement} */
    const formElement = event.target;

    // we find all the elements that should be validated
    const formControlElementsToReport = getFormControlElementsToReport(formElement);

    // we perform validation on all these elements
    /** @type {FormValidity} */
    const formValidity = formControlElementsToReport.map((e) => ({
      name: e.name,
      validity: e.validate(),
    }));

    // we also "report" which means that:
    // * we display inline error message on form controls having invalid validity
    // * we hide inline error message on form controls having valid validity
    formControlElementsToReport.forEach((e) => e.report());

    // finally, we call the right callback according to the form validity.
    const isFormValid = formValidity.every((result) => result.validity.valid);
    if (isFormValid) {
      const data = getFormDataMap(formElement);
      callbacks.onValid?.(data, formElement);
      formElement.dispatchEvent(new CcFormValidEvent(data));
    } else {
      callbacks.onInvalid?.(formValidity, formElement);
      focusFirstFormControlWithError(formElement);
      formElement.dispatchEvent(new CcFormInvalidEvent(formValidity));
    }
  };
}

/**
 * Find all elements within a `<form>` element for which a validity reporting is to be done.
 * For each, returns its name and a way to report its validity.
 *
 * Elements for which a validity reporting is to be done are:
 * * element must have a `name` property
 * * element must have a `true` `willValidate` property
 * * element is either a:
 *   * cc form control element (see {@link isCcFormControlElement})
 *   * form control element like (see {@link isFormControlElementLike})
 *
 * For cc form controls, validity reporting will be done with a call to the `reportInlineValidity()` function. (error messages will be displayed inline)
 * For form control likes, validity reporting will be done with a call to the `checkValidity()` function. (error messages won't be displayed because we don't like the native UX)
 *
 * @param {HTMLFormElement} formElement
 * @return {Array<{name: string, validate: () => Validity, report: () => void}>}
 */
function getFormControlElementsToReport(formElement) {
  const elements = Array.from(formElement.elements);

  /** @type {Array<{name: string, validate: () => Validity, report: () => void}>} */
  const result = [];

  elements.forEach((element) => {
    if (hasName(element)) {
      const name = element.name;

      // Usually, running `validate` is not necessary because the form control validity is already synced when the value of the form control changes.
      // We found some corner cases where validating right before submitting was necessary:
      // Imagine using a `customValidator` to check that the value of a "password" form control matches the value of a "password confirmation" form control.
      // You need to make sure the validation is performed with the current value of both the `password` and `password confirmation` form controls.
      // Unfortunately, automatic validation is performed when the value of the form control changes so if you change the value of the `password confirmation` form control, the `password` form control validity is left unchanged.
      // This is why we always perform validation on submit, just in case. This way we are sure to validate form controls based on all the current values within the form.
      if (isCcFormControlElement(element) && element.willValidate) {
        result.push({
          name,
          validate: () => element.validate(),
          report: () => {
            element.reportInlineValidity();
          },
        });
      }

      // for form control elements like, we don't like the reportValidity native behavior
      else if (isFormControlElementLike(element) && element.willValidate) {
        result.push({
          name,
          validate: () => (element.checkValidity() ? Validation.VALID : Validation.invalid(element.validationMessage)),
          report: () => {},
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
function hasName(element) {
  return !isStringEmpty(element.name);
}
