/**
 * @typedef {import('./i18n.types.js').Language} Language
 * @typedef {import('./i18n.types.js').TranslationsMap} TranslationsMap
 * @typedef {import('./i18n.types.js').Translations} Translations
 * @typedef {import('./i18n.types.js').TranslateFunction} TranslateFunction
 */

/**
 * @param {string} key - The translation key
 * @param {object} [data] - The translation data
 * @returns {string} - The translated
 */
export function i18n(key, data) {
  const translation = getTranslation(key);
  if (translation == null) {
    console.warn(`Unknown translation [${currentLanguage}] "${key}"`);
    return i18n.MISSING_TEXT;
  }
  if (typeof translation === 'function') {
    return translation(data);
  }
  return translation;
}

// Let anyone configure missing text placeholder
i18n.MISSING_TEXT = '🤬🤬🤬🤬🤬';

/**
 * @param {string} key - The translation key
 * @returns {null|string|TranslateFunction} - The translation string or function
 */
function getTranslation(key) {
  try {
    return translationsMap[currentLanguage][key];
  } catch (e) {
    return null;
  }
}

// Init private translation storage
/**
 * @type {TranslationsMap}
 */
const translationsMap = {};
/** @type {string|null} */
let currentLanguage = null;

/**
 * @param {Language} language - Translation language code
 */
export function setLanguage(language) {
  currentLanguage = language;
}

/**
 * @returns {Language} - Translation language code
 */
export function getLanguage() {
  return currentLanguage;
}

/**
 * @param {Language} language - Translation language code
 * @param {Translations} translations - Translation values by key
 */
export function addTranslations(language, translations) {
  if (translationsMap[language] == null) {
    translationsMap[language] = {};
  }
  for (const key in translations) {
    translationsMap[language][key] = translations[key];
  }
}
