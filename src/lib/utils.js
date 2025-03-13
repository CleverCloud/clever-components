/**
 * @typedef {import("../components/common.types.js").ExpirationWarningThresholds} ExpirationWarningThresholds
 */

/** @type {ExpirationWarningThresholds} */
const DEFAULT_THRESHOLDS = [
  { maxApplicableTokenLifetimeInDays: 7, warningThresholdInDays: 2 },
  { maxApplicableTokenLifetimeInDays: 30, warningThresholdInDays: 7 },
  { maxApplicableTokenLifetimeInDays: 60, warningThresholdInDays: 10 },
  { maxApplicableTokenLifetimeInDays: 90, warningThresholdInDays: 20 },
  { maxApplicableTokenLifetimeInDays: 365, warningThresholdInDays: 30 },
];

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
 * @param {string} [currencyDisplay] - the currency formatting dysplay (defaults to "narrowSymbol")
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
 * Checks if a token is close to expiration based on its lifetime.
 *
 * Uses a tiered threshold system where tokens with longer lifespans have larger
 * warning thresholds. For example, 7-day tokens warn at 2 days remaining, while
 * 90-day tokens warn at 20 days remaining.
 *
 * Uses DEFAULT_THRESHOLDS by default, but custom thresholds can be provided.
 * Falls back to highest threshold for tokens exceeding defined lifespans.
 *
 * @param {Object} tokenInfo - Creation & expiration date
 * @param {Date|string|number} tokenInfo.creationDate - The creation date of the token
 * @param {Date|string|number} tokenInfo.expirationDate - The expiration date of the token
 * @param {ExpirationWarningThresholds} [thresholds] - Optional custom thresholds configuration
 * @returns {boolean} True if the token is close to expiration
 */
export function isExpirationClose({ creationDate, expirationDate }, thresholds = DEFAULT_THRESHOLDS) {
  const formattedExpirationDate = new Date(expirationDate);
  const now = new Date();
  const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

  // Calculate token's total lifetime and remaining days
  const expirationTimestamp = new Date(expirationDate).getTime();
  const creationTimestamp = new Date(creationDate).getTime();
  const totalTokenLifetimeInDays = Math.floor((expirationTimestamp - creationTimestamp) / MILLISECONDS_PER_DAY);

  // Calculate days remaining until expiration
  const daysUntilExpiration = (formattedExpirationDate.getTime() - now.getTime()) / MILLISECONDS_PER_DAY;

  // Sort thresholds by maxApplicableTokenLifetimeInDays in ascending order to find the appropriate
  // threshold based on the token's total lifetime
  const sortedThresholds = [...thresholds].sort(
    (a, b) => a.maxApplicableTokenLifetimeInDays - b.maxApplicableTokenLifetimeInDays,
  );

  // Find the first threshold that applies to this token's lifetime
  const thresholdToApply = sortedThresholds.find(
    (threshold) => totalTokenLifetimeInDays <= threshold.maxApplicableTokenLifetimeInDays,
  );

  // If no matching threshold found, use the one with the highest max days as fallback
  const highestThreshold = sortedThresholds[sortedThresholds.length - 1];

  // Determine the appropriate warning threshold in days
  const warningThreshold = thresholdToApply
    ? thresholdToApply.warningThresholdInDays
    : highestThreshold.warningThresholdInDays;

  // Return true if remaining time is less than or equal to the warning threshold
  return daysUntilExpiration <= warningThreshold;
}
