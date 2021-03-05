/**
 * @param {Object} a
 * @param {Object} b
 * @return {Boolean}
 */
export function objectEquals (a, b) {
  if (a === b) {
    return true;
  }
  if (a == null || b == null) {
    return false;
  }
  if (Object.keys(a).length !== Object.keys(b).length) {
    return false;
  }
  return Object
    .entries(a)
    .every(([k, v]) => {
      return b[k] === v;
    });
}
