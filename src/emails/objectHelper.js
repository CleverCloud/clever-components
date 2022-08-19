export const isObject = (o) => {
  return Object(o) === o;
};
export const isArrayIndex = (o) => {
  return Math.abs(o) >> 0 === +o;
};

export const get = (obj, path, defValue) => {
  if (!path) {
    return undefined;
  }
  const pathArray = Array.isArray(path) ? path : path.match(/([^[.\]])+/g);
  const result = pathArray.reduce(
    (prevObj, key) => prevObj && prevObj[key],
    obj,
  );
  return result === undefined ? defValue : result;
};

/**
 * todo: this method should deep clone along the path
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
 * todo: this method should deep clone along the path
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
