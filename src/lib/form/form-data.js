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
