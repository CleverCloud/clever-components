import { AbstractInputElement } from '../../mixins/abstract-input-element.js';
import { setTimeoutAsPromise } from '../utils.js';

/**
 * @typedef {import('./form.types.js').InputData} InputData
 * @typedef {import('./form.types.js').NativeInputElement} NativeInputElement
 * @typedef {import('../validation/validation.types.js').Validation} Validation
 * @typedef {import('../validation/validation.types.js').ErrorMessage} ErrorMessage
 * @typedef {import('lit').LitElement} LitElement
 */

/**
 * @param {HTMLFormElement} formElement
 * @return {{[key: string]: InputData|Array<InputData>}}
 */
export function getFormData (formElement) {
  /** @type {{[key: string]: InputData|Array<InputData>}} */
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
 * Find all elements in the given form, associated with the given inputName
 * @param {HTMLFormElement} formElement
 * @param {string} inputName The name of the input
 * @return Array<Element>
 */
export function getFormElements (formElement, inputName) {
  const elementOrNodeList = formElement.elements.namedItem(inputName);

  if (elementOrNodeList == null) {
    return [];
  }

  if (elementOrNodeList instanceof Element) {
    return [elementOrNodeList];
  }
  /** @type {Array<Element>} */
  const result = [];
  elementOrNodeList.forEach((e) => {
    if (e instanceof Element) {
      result.push(e);
    }
  });

  return result;
}

/**
 * @param {Element & {validate?: function}} element
 * @return {element is AbstractInputElement}
 */
export function isCcInputElement (element) {
  return element instanceof AbstractInputElement;
}

/**
 * @param {Element & {updateComplete?: Promise<any>}} element
 * @return {element is LitElement}
 */
export function isLitElement (element) {
  return element.updateComplete != null;
}

/**
 * @param {Element & {checkValidity?: function, willValidate?: boolean}} element
 * @return {element is NativeInputElement }
 */
export function isNativeInputElement (element) {
  return element.checkValidity != null && typeof element.checkValidity === 'function'
    && element.willValidate != null && element.willValidate === true;
}

/**
 *
 * @param {HTMLElement} element
 * @return {Promise<void>}
 */
export async function focusInputAfterError (element) {
  /** @type {HTMLElement} */
  const firstElementInError = element.querySelector(':invalid, [internals-invalid]');
  if (firstElementInError == null) {
    return Promise.resolve();
  }

  function focus () {
    firstElementInError.focus();
  }

  const documentOrShadowRoot = nearestDocumentOrShadowRoot(element);

  // we try to focus directly
  focus();

  if (documentOrShadowRoot == null) {
    return Promise.resolve();
  }

  // if focus could not be made, we wait a little bit and trigger another attempt
  if (documentOrShadowRoot.activeElement !== firstElementInError) {
    // if we found a shadowRoot with a LitElement host, we wait for the next update cycle to retry a focus
    if (documentOrShadowRoot instanceof ShadowRoot && isLitElement(documentOrShadowRoot.host)) {
      documentOrShadowRoot.host.updateComplete.then(focus);
    }
    // otherwise, we just postpone the focus with a very short setTimeout
    else {
      return setTimeoutAsPromise(focus);
    }
  }
}

/**
 * @param {ErrorMessage} message
 * @return {string}
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

    // below is the simplest way, but we don't get the <br> replaced by \n
    // return message.textContent;
  }

  return '' + message;
}

/**
 * @param {Node} element
 * @return {DocumentOrShadowRoot | null}
 */
function nearestDocumentOrShadowRoot (element) {
  let current = element;
  while (current != null) {
    if (current instanceof ShadowRoot || current instanceof Document) {
      return current;
    }
    current = current.parentNode;
  }
  return null;
}
