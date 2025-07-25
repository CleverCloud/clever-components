/**
 * If you change the base URL here, you should probably also change it in places where it's still hard coded:
 * - README.md,
 * - CONTRIBUTING.md,
 * - sandbox/index.html,
 * - test/utils.test.js.
 */
const CC_DEV_HUB_BASE_URL = 'https://www.clever-cloud.com/developers/';

/**
 * @param {Record<string, any>} a
 * @param {Record<string, any>} b
 * @return {boolean}
 */
export function objectEquals(a, b) {
  if (a === b) {
    return true;
  }
  if (a == null || b == null) {
    return false;
  }
  if (Object.keys(a).length !== Object.keys(b).length) {
    return false;
  }
  return Object.entries(a).every(([k, v]) => {
    return b[k] === v;
  });
}

/**
 * @template ItemType
 * @param {ItemType[]} a
 * @param {ItemType[]} b
 * @returns {boolean}
 */
export function arrayEquals(a, b) {
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
 * @param {ItemType} _
 * @param {number} index
 * @param {ItemType[]} array
 * @returns {ItemType[]}
 */
export function unique(_, index, array) {
  if (index === array.length - 1) {
    return Array.from(new Set(array));
  }
  return [];
}

/**
 * @template ItemType
 * @template {keyof ItemType} PropertyType
 * @param {PropertyType} propertyName
 * @param {boolean} desc
 * @returns {(a: Record<PropertyType, string>, b: Record<PropertyType, string>) => number}
 */
export function sortBy(propertyName, desc = false) {
  return (a, b) => {
    return desc === false
      ? a[propertyName].localeCompare(b[propertyName])
      : b[propertyName].localeCompare(a[propertyName]);
  };
}

/**
 * @param {Array<T>} array
 * @param {(value: T) => V} keyProvider
 * @return {Object<V, Array<T>>}
 * @template {Object} T
 * @template {string} V
 */
export function groupBy(array, keyProvider) {
  /** @type {Object<V, Array<T>>} */
  const groups = {};

  for (const value of array) {
    const prop = keyProvider(value);

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
export function asyncMap(array, asyncCallback) {
  return Promise.all(array.map(asyncCallback));
}

/**
 * Returns the currency symbol corresponding to the given currency.
 *
 * @param {string} currency - the currency to get the symbol for
 * @param{Intl.NumberFormatOptions['currencyDisplay']} [currencyDisplay] - the currency formatting dysplay (defaults to "narrowSymbol")
 * @returns {string} the formatted currency symbol
 */
export function getCurrencySymbol(currency, currencyDisplay = 'narrowSymbol') {
  // The lang does not really matter
  const nf = new Intl.NumberFormat('en', { style: 'currency', currency, currencyDisplay });

  return nf.formatToParts(0).find((p) => p.type === 'currency').value;
}

/**
 * Create an array of integers, starting from `start` and ending at `end`.
 *
 * @param {number} start - The number to start with.
 * @param {number} end - The number to end with.
 * @return Array<number>
 */
export function range(start, end) {
  const s = Math.min(start, end);
  const e = Math.max(start, end);
  const result = [];
  for (let i = s; i <= e; i++) {
    result.push(i);
  }
  return result;
}

/**
 * Randomly pick an integer between the given range.
 *
 * @param {number} min The range left bound
 * @param {number} max The range right bound
 * @return {number}
 */
export function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Randomly pick an item from the given array.
 *
 * @param {Array<T>} array
 * @return {T|null} a random item or null if array was empty
 * @template T
 */
export function randomPick(array) {
  if (array.length === 0) {
    return null;
  }
  const index = random(0, array.length - 1);
  return array[index];
}

/**
 * Generates a random string using the given alphabet.
 *
 * @param {number} [length] The size of the string to generated
 * @param {string} [alphabet] The alphabet
 * @return {string} A random string
 */
export function randomString(length = 8, alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz') {
  if (alphabet.length === 0) {
    throw new Error('Alphabet cannot be an empty string');
  }
  const max = alphabet.length - 1;
  let result = '';
  for (let i = 0; i < length; i++) {
    result += alphabet.charAt(random(0, max));
  }
  return result;
}

/**
 * Clamps the given number into the given bounds.
 *
 * @param {number} number The number to clamp
 * @param {number|null|undefined} [min] The range left bound
 * @param {number|null|undefined} [max] The range right bound
 * @return {number} The clamped number
 */
export function clampNumber(number, min, max) {
  return Math.min(Math.max(number, min ?? -Infinity), max ?? Infinity);
}

/**
 * @param {string} string
 * @return {boolean}
 */
export function isStringEmpty(string) {
  return string == null || string.length === 0;
}

/**
 * @param {string} string
 * @return {boolean}
 */
export function isStringBlank(string) {
  return string == null || string.trim().length === 0;
}

/**
 *
 * @param {number} delay
 * @return {Promise<unknown>} a Promise that resolves when the given delay is timed out.
 */
export function sleep(delay) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

/**
 * Rely on this helper for every reference to the Clever Cloud docs website
 *
 * @param {string} [path]
 * @returns {string} href
 */
export function generateDocsHref(path = '') {
  /**
   * Ensure "/doc" is appended after the base URL, then append the provided path
   * If you change the base URL here, you should probably also change it in places where it's still hard coded:
   * - README.md,
   * - CONTRIBUTING.md,
   * - sandbox/index.html,
   * - test/utils.test.js.
   */
  const CC_DOCS_BASE_URL = CC_DEV_HUB_BASE_URL.replace(/\/$/, '') + '/doc/';
  // if a '/' is present at the beginning, the path is considered absolute and it is appended right after the origin
  // we want the path to always be appended after the existing path of the base URL so we remove the first '/' so that it's considered relative
  return new URL(path.replace(/^\//, ''), CC_DOCS_BASE_URL).href;
}

/**
 * Rely on this helper for every reference to the Clever Cloud developer hub website
 *
 * @param {string} [path]
 * @returns {string} href
 */
export function generateDevHubHref(path = '') {
  // if a '/' is present at the beginning, the path is considered absolute and it is appended right after the origin
  // we want the path to always be appended after the existing path of the base URL so we remove the first '/' so that it's considered relative
  return new URL(path.replace(/^\//, ''), CC_DEV_HUB_BASE_URL).href;
}
