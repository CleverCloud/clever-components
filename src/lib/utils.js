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

export function arrayEquals (a, b) {
  if (a === b) {
    return true;
  }

  if (a == null || b == null) {
    return false;
  }

  if (b.length !== a.length) {
    return false;
  }

  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
}

export const unique = [(a, b, i, array) => {
  if (i === array.length - 1) {
    return Array.from(new Set(array));
  }
}, []];

export function sortBy (propertyName, desc = false) {
  return (a, b) => {
    return (desc === false)
      ? a[propertyName].localeCompare(b[propertyName])
      : b[propertyName].localeCompare(a[propertyName]);
  };
}

export function asyncMap (array, asyncCallback) {
  return Promise.all(array.map(asyncCallback));
}
