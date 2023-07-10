/**
 * @param {Record<string, any>} a
 * @param {Record<string, any>} b
 * @return {boolean}
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

/**
 * @template ItemType
 * @param {ItemType[]} a
 * @param {ItemType[]} b
 * @returns {boolean}
 */
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

/**
 * This must be used with flatMap so it can be chained
 * => myArray.flatMap(unique)
 *
 * @template ItemType
 * @param {ItemType} item
 * @param {number} index
 * @param {ItemType[]} array
 * @returns {ItemType[]}
 */
export function unique (item, index, array) {
  if (index === array.length - 1) {
    return Array.from(new Set(array));
  }
  return [];
};

/**
 * @template ItemType
 * @template {keyof ItemType} PropertyType
 * @param {PropertyType} propertyName
 * @param {boolean} desc
 * @returns {(a: Record<PropertyType, string>, b: Record<PropertyType, string>) => number}
 */
export function sortBy (propertyName, desc = false) {
  return (a, b) => {
    return (desc === false)
      ? a[propertyName].localeCompare(b[propertyName])
      : b[propertyName].localeCompare(a[propertyName]);
  };
}

/**
 * @template {Object<string, any>} T
 * @param {Array<T>} array
 * @param {string} key
 * @return {Object<string, Array<T>>}
 */
export function groupBy (array, key) {
  /** @type {Object<string, Array<T>>} */
  const groups = {};

  for (const value of array) {
    const prop = value[key];

    if (prop != null) {
      let group = groups[prop];
      if (group == null) {
        group = [];
        groups[prop] = group;
      }
      group.push(value);
    }
  }

  return groups;
}

/**
 * @template InputType
 * @template OutputType
 * @param {InputType[]} array
 * @param {(value: InputType, index: number, array: InputType[]) => Promise<OutputType>} asyncCallback
 * @return {Promise<OutputType[]>}
 */
export function asyncMap (array, asyncCallback) {
  return Promise.all(array.map(asyncCallback));
}

/**
 * Create an array of numbers, starting from `start` and ending at `end`.
 *
 * @param {number} start - The number to start with.
 * @param {number} end - The number to end with.
 * @return Array<number>
 */
export function range (start, end) {
  const s = Math.min(start, end);
  const e = Math.max(start, end);
  const result = [];
  for (let i = s; i <= e; i++) {
    result.push(i);
  }
  return result;
}

/**
 *
 * @param {number} min
 * @param {number} max
 * @return {number}
 */
export function random (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Bind the given number into the given bounds.
 *
 * @param {number} number
 * @param {number|null|undefined} [min]
 * @param {number|null|undefined} [max]
 * @return {number}
 */
export function bindNumber (number, min, max) {
  return Math.min(Math.max(number, min ?? -Infinity), max ?? Infinity);
}

/**
 * @param {string} string
 * @return {boolean}
 */
export function isStringEmpty (string) {
  return string == null || string.length === 0;
}
