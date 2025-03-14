/**
 * @typedef {import('./i18n.types.d.ts').NumberFormatter} NumberFormatter
 */

/**
 * Format a given number
 *
 * @param {string} lang - BCP 47 language tag
 * @param {number} value - The number to format
 * @param {Object} [options]
 * @param {number} [options.minimumFractionDigits] - minimum fraction digits (defaults to 0)
 * @param {number} [options.maximumFractionDigits] - maximum fraction digits (defaults to 0)
 * @returns {string}
 */
export function formatNumber(lang, value, options = {}) {
  const { minimumFractionDigits, maximumFractionDigits } = options;
  const nf = new Intl.NumberFormat(lang, {
    minimumFractionDigits,
    maximumFractionDigits,
  });

  return nf.format(value);
}

/**
 * Format a given number as a currency
 *
 * @param {string} lang - BCP 47 language tag
 * @param {number} value - The number to format
 * @param {Object} [options]
 * @param {string} [options.currency] - Currency code (defaults to EUR)
 * @param {'code'|'symbol'|'narrowSymbol'|'name'} [options.currencyDisplay] - currency formatting display (defaults to "narrowSymbol")
 * @param {number} [options.minimumFractionDigits] - minimum fraction digits (defaults to 2)
 * @param {number} [options.maximumFractionDigits] - maximum fraction digits (defaults to 2)
 * @returns {string}
 */
export function formatCurrency(lang, value, options = {}) {
  const { currency = 'EUR' } = options;
  const { currencyDisplay = 'narrowSymbol', minimumFractionDigits = 2, maximumFractionDigits = 2 } = options;
  const nf = new Intl.NumberFormat(lang, {
    style: 'currency',
    currency,
    currencyDisplay,
    minimumFractionDigits,
    maximumFractionDigits,
  });

  return nf.format(value);
}

/**
 * Format a given number as a percentage
 *
 * @param {string} lang - BCP 47 language tag
 * @param {number} value - The number to format
 * @param {Object} [options]
 * @param {number} [options.minimumFractionDigits] - minimum fraction digits (defaults to 1)
 * @param {number} [options.maximumFractionDigits] - maximum fraction digits (defaults to 1)
 * @returns {string}
 */
export function formatPercent(lang, value, options = {}) {
  const { minimumFractionDigits = 1, maximumFractionDigits = 1 } = options;

  const nf = new Intl.NumberFormat(lang, {
    style: 'percent',
    minimumFractionDigits,
    maximumFractionDigits,
  });
  return nf.format(value);
}

// Intl.NumberFormat has a `notation: 'compact'` option.
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat
// This is close to what we want to achieve for compact number display but:
// * It's not supported on Safari.
// * In English:
//   * The prefixes are K, M, B and T with no space between number and prefix (1K, 2M...) (short scale based)
//   * K for 1 thousand (but why? the SI prefix for 1 kilo is lower case k)
//     * https://en.wikipedia.org/wiki/1000_(number)
//     * > Multiples of thousands are occasionally represented by replacing their last three zeros with the letter "K": for instance, writing "$30K" for $30 000, or denoting the Y2K computer bug of the year 2000.
//   * M for 1 million (not mega)
//   * B for 1 billion
//   * T for 1 trillion (not tera)
// * In French:
//   * The prefixes are k, M, Md and Bn with a space between number and prefix (1 k, 2 M...) (long scale based)
//   * k for 1 thousand (similar to SI prefix for 1 kilo)
//   * M for "un million" (not mega)
//   * Md for "un milliard"
//   * Bn for "un billion"
// For our context, we would prefer no space and just one letter, it's more compact.
// We also feel like the short/long scale is confusing for the "B" since a billion can be 10^9 or 10^12.
// Using SI prefixes (k, M, G, T...) is simpler to implement and easier maintain.
// It's also pretty well understood by our kind of technical/scientific users (even in countries that don't use the metric system).

// https://en.wikipedia.org/wiki/Metric_prefix
const SI_PREFIXES = ['', 'k', 'M', 'G', 'T', 'P'];

/**
 * @param {string} lang - BCP 47 language tag
 * @param {string} symbol
 * @param {string} separator
 * @return {NumberFormatter}
 */
export function prepareNumberUnitFormatter(lang, symbol = '', separator = '') {
  const nf = new Intl.NumberFormat(lang, { minimumFractionDigits: 0, maximumFractionDigits: 1 });
  return (value) => {
    // Figure out the "magnitude" of the value: 1000 => 1 / 1000000 => 2 / 1000000000 => 3 ...
    const prefixIndex = value > 1 ? Math.floor(Math.log10(value) / 3) : 0;
    // Use the prefixIndex to "rebase" the value into the new base, 1250 => 1.25 / 1444000 => 1.444...
    const rebasedValue = value / 1000 ** prefixIndex;
    // Use Intl/i18n aware number formatter
    const formattedValue = nf.format(rebasedValue);
    const prefix = SI_PREFIXES[prefixIndex];
    return formattedValue + separator + prefix + symbol;
  };
}

// Intl.NumberFormat has a `style: 'unit', unit: 'byte'` option.
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat
// This is close to what we need, it would help us display `B` in english and `o` in french but:
// * It's not supported in Safari.
// * We would still have to do the 1024 base magic.
// * We would still have to decide if we need to display kilobyte, megabytes... and would have to list all those unit names.
// For our context, this solution is smaller and simpler.

// https://en.wikipedia.org/wiki/Binary_prefix
const IEC_PREFIXES = ['', 'Ki', 'Mi', 'Gi', 'Ti', 'Pi'];

// We tried an implementation with Math.log2() similar to what we do with prepareNumberUnitFormatter, but it gets weird around 1125899906842621 :-|
/**
 * @param {string} lang - BCP 47 language tag
 * @param {string} byteSymbol - The byte symbol
 * @param {string} separator - The separator between value and the byte symbol
 * @return {(value: number, fractionDigits?:number, maxPrefixIndex?: number) => string}
 */
export function prepareNumberBytesFormatter(lang, byteSymbol, separator) {
  const simpleNf = new Intl.NumberFormat(lang);

  return (value, fractionDigits = 0, maxPrefixIndex = IEC_PREFIXES.length - 1) => {
    // Nothing fancy to do when value is under 1 kilobyte
    if (value < 1024) {
      return simpleNf.format(value) + separator + byteSymbol;
    }

    const nf = new Intl.NumberFormat(lang, {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    });

    // Figure out the "magnitude" of the value: greater than 1024 => 1 / greater than 1024^2 => 2 / greater than 1024^3 => 3 ...
    const prefixIndex = IEC_PREFIXES.slice(0, maxPrefixIndex + 1).findIndex((_, i) => {
      // Return last prefix of the array if we cannot find a prefix
      return value < 1024 ** (i + 1) || i === maxPrefixIndex;
    });

    // Use the prefixIndex to "rebase" the value into the new base, 1250 => 1.22 / 1444000 => 1.377...
    const rebasedValue = value / 1024 ** prefixIndex;

    // Truncate so the rounding applied by nf.format() does not mess with the prefix we selected
    // Ex: it prevents from returning 1,024.0 KiB if we're just under 1024^2 bytes and returns 1,023.9 KiB instead
    const truncatedValue = Math.trunc(rebasedValue * 10 ** fractionDigits) / 10 ** fractionDigits;

    // Use Intl/i18n aware number formatter
    const formattedValue = nf.format(truncatedValue);

    const prefix = IEC_PREFIXES[prefixIndex];
    return formattedValue + separator + prefix + byteSymbol;
  };
}
