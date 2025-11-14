import { i18n as i18nRaw } from '../lib/i18n/i18n.js';

// FIXME: We're using `@typedef` instead of `@import` here due to a false positive from TS
// See: https://github.com/microsoft/TypeScript/issues/60908/
/**
 * @typedef {import('./translation.types.js').I18nFunction} I18nFunction
 */

/** @type {I18nFunction} */
export function i18n(key, data) {
  // @ts-ignore
  return i18nRaw(key, data);
}
