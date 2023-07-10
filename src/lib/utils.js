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
  * Returns the currency symbol corresponding to the given currency.
  *
  * @param {string} currency - the currency to get the symbol for
  */
export function getCurrencySymbol (currency) {
  // The lang does not really matter
  const nf = new Intl.NumberFormat('en', { style: 'currency', currency });
  return nf
    .formatToParts(0)
    .find((p) => p.type === 'currency')
    .value
  // Safari does not support currencySymbol: 'narrow' in Intl.NumberFormat so we need to do this #sorry
    .replace('$US', '$');
}

/**
 * Clamps the given number into the given bounds.
 *
 * @param {number} number
 * @param {number|null|undefined} [min]
 * @param {number|null|undefined} [max]
 * @return {number}
 */
export function clampNumber (number, min, max) {
  return Math.min(Math.max(number, min ?? -Infinity), max ?? Infinity);
}

/**
 * @param {string} string
 * @return {boolean}
 */
export function isStringEmpty (string) {
  return string == null || string.length === 0;
}
