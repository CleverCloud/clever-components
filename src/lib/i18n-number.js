// Intl.NumberFormat has a `notation: 'compact'` option.
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat
// This is close to want we want to achieve for compact number display but:
// * It's not supported on Safari.
// * In english:
//   * The prefixes are K, M, B and T with no space between number and prefix (1K, 2M...) (short scale based)
//   * K for 1 thousand (but why? the SI prefix for 1 kilo is lower case k)
//     * https://en.wikipedia.org/wiki/1000_(number)
//     * > Multiples of thousands are occasionally represented by replacing their last three zeros with the letter "K": for instance, writing "$30K" for $30 000, or denoting the Y2K computer bug of the year 2000.
//   * M for 1 million (not mega)
//   * B for 1 billion
//   * T for 1 trillion (not tera)
// * In french:
//   * The prefixes are k, M, Md and Bn with a space between number and prefix (1 k, 2 M...) (long scale based)
//   * k for 1 thousand (similar to SI prefix for 1 kilo)
//   * M for "un million" (not mega)
//   * Md for "un milliard"
//   * Bn for "un billion"
// For our context, we would prefer no space and just one letter, it's more compact.
// We also feel like the short/long scale is confusing for the "B" since a billion can be 10^9 or 10^12.
// Using SI symbols (k, M, G, T...) is simpler to implement and easier maintain.
// It's also pretty well understood by our kind of technical/scientific users (even in countries that don't use the metric system).

// https://en.wikipedia.org/wiki/Metric_prefix
const SI_SYMBOLS = ['', 'k', 'M', 'G', 'T', 'P'];

export function prepareNumberUnitFormatter (lang) {
  const nf = new Intl.NumberFormat(lang, { minimumFractionDigits: 0, maximumFractionDigits: 1 });
  return (rawValue) => {
    // Figure out the "magnitude" of the rawValue: 1000 => 1 / 1000000 => 2 / 1000000000 => 3 ...
    const symbolIndex = Math.floor(Math.log10(rawValue) / 3);
    // Use the symbolIndex to "rebase" the rawValue into the new base, 1250 => 1.25 / 1444000 => 1.444...
    const rebasedValue = rawValue / 1000 ** symbolIndex;
    // Use Intl/i18n aware number formatter
    const formattedValue = nf.format(rebasedValue);
    const symbol = SI_SYMBOLS[symbolIndex];
    // No space for compact display
    return formattedValue + symbol;
  };
}
