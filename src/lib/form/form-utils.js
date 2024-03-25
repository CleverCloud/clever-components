import { InputElement } from './input-element.js';

/**
 * @typedef {import('./form.types.js').AggregatedFormData} AggregatedFormData
 * @typedef {import('./form.types.js').InputData} InputData
 * @typedef {import('./form.types.js').NativeInputElement} NativeInputElement
 * @typedef {import('./validation.types.js').ErrorMessage} ErrorMessage
 * @typedef {import('lit').LitElement} LitElement
 */

/**
 * Gets `<form>` element data. It aggregates the data of elements having the same name into an array.
 *
 * @param {HTMLFormElement} formElement
 * @return {AggregatedFormData}
 */
export function getFormData (formElement) {
  /** @type {AggregatedFormData} */
  const result = {};

  const formData = new FormData(formElement);

  formData.forEach((value, key) => {
    const resultElement = result[key];

    if (resultElement == null) {
      result[key] = value;
    }
    else if (Array.isArray(resultElement)) {
      resultElement.push(value);
    }
    else {
      result[key] = [resultElement, value];
    }
  });

  return result;
}

/**
 * Find all input elements in the given `<form>` element, associated with the given `inputName`.
 *
 * An element is considered an input element if it is one of:
 * * cc input element: see {@link isCcInputElement}
 * * native input element: see {@link isNativeInputElement}
 *
 * @param {HTMLFormElement} formElement
 * @param {string} inputName The name of the input
 * @return Array<DescribedInputElement>
 */
export function getFormInputElements (formElement, inputName) {
  const elementOrNodeList = formElement.elements.namedItem(inputName);

  if (elementOrNodeList == null) {
    return [];
  }

  /** @type {Array<{native: true, element: NativeInputElement} | {native: false, element: InputElement}>} */
  const result = [];

  /**
   * @param {Node} node
   */
  function addInputElement (node) {
    if (node instanceof Element) {
      if (isCcInputElement(node)) {
        result.push({ native: false, element: node });
      }
      if (isNativeInputElement(node)) {
        result.push({ native: true, element: node });
      }
    }
  }

  if (elementOrNodeList instanceof Element) {
    addInputElement(elementOrNodeList);
  }
  else {
    elementOrNodeList.forEach(addInputElement);
  }

  return result;
}

/**
 * Check whether the given element is a cc input.
 * A cc input is an element that extends {@link InputElement}.
 *
 * @param {Element} element
 * @return {element is InputElement}
 */
export function isCcInputElement (element) {
  return element instanceof InputElement;
}

const INPUT_TYPES = ['checkbox', 'color', 'date', 'datetime-local', 'email', 'file', 'hidden', 'month', 'number', 'password', 'radio', 'range', 'search', 'tel', 'text', 'time', 'url', 'week'];

/**
 * Check whether the given element is a native input element.
 * A native input is:
 * * an `HTMLInputElement` (but not with `button`, `reset` nor `submit` type)
 * * an `HTMLTextAreaElement`
 * * an `HTMLSelectElement`
 *
 * @param {Element} element
 * @return {element is NativeInputElement }
 */
export function isNativeInputElement (element) {
  return (element instanceof HTMLInputElement && INPUT_TYPES.includes(element.type))
    || element instanceof HTMLTextAreaElement
    || element instanceof HTMLSelectElement
  ;
}

/**
 * Converts an error message into string.
 *
 * * if the given message is null, returns an empty string,
 * * if the given message is a string, return this string,
 * * if the given message is a Node,
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

  if (message instanceof Node) {
    // todo: this is the proper way to get the best text corresponding to the string error message (it handles <br> => \n)
    const div = document.createElement('div');
    div.style.width = '0';
    div.style.height = '0';
    div.appendChild(message.cloneNode(true));
    document.body.appendChild(div);
    const result = div.innerText;
    div.remove();
    return result;

    // below is the simplest and cheapest way, but we don't get the <br> replaced by \n
    // return message.textContent;
  }

  return message;
}

/**
 * Moves the focus on the first input element in error.
 *
 * @param {HTMLElement} element
 */
export function focusInputAfterError (element) {
  // the query selector below includes the `[internals-invalid]` alternative for compatibility with element internals polyfill
  /** @type {HTMLElement} */
  const firstElementInError = element.querySelector(':invalid, [internals-invalid]');
  firstElementInError?.focus();
}
