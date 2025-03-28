/**
 * Get the translated name of a country using its code with a fallback
 *
 * @param {string} lang - BCP 47 language tag
 * @param {string} code - ISO 3166 Country code
 * @param {string} name - Country name (fallback)
 * @returns {string}
 */
export function getCountryName(lang, code, name) {
  // try/catch with fallback on english name because the support is not great for now
  // https://caniuse.com/mdn-javascript_builtins_intl_displaynames_of
  try {
    // This API was not really designed for this but...
    return new Intl.DisplayNames([lang], { type: 'region' }).of(code.toUpperCase());
  } catch {
    return name;
  }
}
