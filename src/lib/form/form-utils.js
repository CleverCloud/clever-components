import { focusBySelector } from '../focus-helper.js';
import { CcFormControlElement } from './cc-form-control-element.abstract.js';

/**
 * @typedef {import('./form.types.js').FormDataMap} FormDataMap
 * @typedef {import('./form.types.js').FormControlData} InputData
 * @typedef {import('./form.types.js').FormControlElementLike} FormControlElementLike
 * @typedef {import('./validation.types.js').ErrorMessage} ErrorMessage
 * @typedef {import('lit').LitElement} LitElement
 */

/**
 * Gets `<form>` element data. It aggregates the data of elements with the same name into an array.
 *
 * @param {HTMLFormElement} formElement
 * @return {FormDataMap}
 */
export function getFormDataMap (formElement) {
  const formData = new FormData(formElement);

  return Object.fromEntries(
    Array.from(formData.keys())
      .map((key) => {
        const values = formData.getAll(key);
        if (values.length === 0) {
          return null;
        }
        if (values.length === 1) {
          return [key, values[0]];
        }
        return [key, values];
      })
      .filter((pair) => pair != null),
  );
}

/**
 * Check whether the given element is a cc form control.
 *
 * A cc form control is an element that extends {@link CcFormControlElement}.
 *
 * @param {Element} element
 * @return {element is CcFormControlElement}
 */
export function isCcFormControlElement (element) {
  return element instanceof CcFormControlElement;
}

/**
 * Check whether the given element is a form control element like.
 *
 * A form control element like is an element that:
 * * has a `checkValidity` function
 * * has a `willValidate property
 * * has a `validationMessage property
 * * is not a button
 *
 * @param {any} element
 * @return {element is FormControlElementLike }
 */
export function isFormControlElementLike (element) {
  return !isButtonElement(element)
    && typeof element.checkValidity === 'function'
    && (element.willValidate !== undefined)
    && (element.validationMessage !== undefined)
  ;
}

const BUTTON_INPUT_TYPES = ['button', 'reset', 'submit'];

/**
 * @param {HTMLElement} element
 * @return {boolean}
 */
function isButtonElement (element) {
  return element instanceof HTMLButtonElement || (element instanceof HTMLInputElement && BUTTON_INPUT_TYPES.includes(element.type));
}

/**
 * Converts an error message into string.
 *
 * * if the given message is null, returns an empty string,
 * * if the given message is a string, return this string,
 * * if the given message is a Node, return its textContent (and replace the <br> by spaces)
 *
 *
 * @param {ErrorMessage} message The error message to convert
 * @return {string} The converted error message
 */
export function convertErrorMessageToString (message) {
  if (message == null) {
    return '';
  }

  if (typeof message === 'string') {
    return message;
  }

  if (message instanceof HTMLElement) {
    message.innerHTML = message.innerHTML.replace('<br>', ' ');
  }

  if (message instanceof Node) {
    return message.textContent;
  }

  return message;
}

/**
 * Moves the focus on the first form control element in error.
 *
 * @param {HTMLElement|ShadowRoot} element
 */
export function focusFirstFormControlWithError (element) {
  // the query selector below includes the `[internals-invalid]` alternative for compatibility with element internals polyfill
  focusBySelector(element, ':invalid, [internals-invalid]');
}
