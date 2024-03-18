
/**
 * @param {HTMLFormElement} formElement
 * @return {{[key: string]: InputData|Array<InputData>}}
 */
export function getFormData (formElement) {
  const result = {};

  for (const [key, value] of new FormData(formElement)) {
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

export function setCustomValidityOnElement (element, validationResult) {
  // cc input
  if (isCcInputElement(element)) {
    element.errorMessage = validationResult.valid ? null : validationResult.code;
  }
  // native input
  else {
    element.setCustomValidity?.(validationResult.valid ? '' : validationResult.code);
  }
}

export function isCcInputElement (element) {
  return element.validate != null && typeof element.validate === 'function';
}

export function isNativeInputElement (element) {
  return element.checkValidity != null && typeof element.checkValidity === 'function' && element.willValidate;
}

export async function focusInputAfterError (formElement) {
  const firstElementInError = formElement.querySelector(':invalid, [internals-invalid]');
  if (firstElementInError == null) {
    return Promise.resolve();
  }

  function focus () {
    firstElementInError.focus();
  }

  const shadowRoot = nearestParent(formElement, (e) => e instanceof ShadowRoot);

  // we try to focus directly
  focus();

  // if focus could not be made, we wait a little bit and trigger another attempt
  if ((shadowRoot ?? document).activeElement !== firstElementInError) {
    // if we found a shadowRoot with an updatable host (aka. a LitElement), we wait for the next update cycle to retry a focus
    if (shadowRoot != null && shadowRoot.host?.updateComplete != null) {
      shadowRoot.host.updateComplete.then(focus);
    }
    // otherwise, we just postpone the focus with a very short setTimeout
    else {
      setTimeout(focus);
    }
  }
}

function nearestParent (element, predicate) {
  let current = element;
  while (current != null && !predicate(current)) {
    current = current.parentNode;
  }
  return current;
}
