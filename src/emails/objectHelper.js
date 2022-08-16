import { isArray } from 'chart.js/helpers';

export const isObject = (o) => {
  return Object(o) === o;
};
export const isArrayIndex = (o) => {
  return Math.abs(o) >> 0 === +o;
};

/**
 * it doesnt deep clone
 *
 * @param obj
 * @param path
 * @param value
 * @returns {*}
 */
export function set (obj, path, value) {
  if (!isObject(obj)) {
    return obj;
  }
  if (!Array.isArray(path)) {
    path = path.toString().match(/[^.[\]]+/g) || [];
  }

  if (path.length === 0) {
    return obj;
  }

  const result = { ...obj };

  let current = result;
  for (let i = 0; i < path.length - 1; i++) {
    const p = path[i];
    if (!isObject(current[p])) {
      if (isArrayIndex(path[i + 1])) {
        current[p] = [];
      }
      else {
        current[p] = {};
      }
    }
    current = current[p];
  }
  current[path[path.length - 1]] = value;

  return result;
}

/**
 * it doesnt deep clone
 *
 * @param obj
 * @param path
 * @param value
 * @returns {*}
 */
export function unset (obj, path) {
  if (!isObject(obj)) {
    return obj;
  }
  if (!Array.isArray(path)) {
    path = path.toString().match(/[^.[\]]+/g) || [];
  }

  if (path.length === 0) {
    return obj;
  }

  const result = { ...obj };

  let current = result;
  for (let i = 0; i < path.length - 1; i++) {
    const p = path[i];
    if (!isObject(current[p])) {
      return obj;
    }
    current = current[p];
  }

  if (Array.isArray(current)) {
    current.splice(Number(path[path.length - 1]), 1);
  }
  else {
    delete current[path[path.length - 1]];
  }

  return result;
}
