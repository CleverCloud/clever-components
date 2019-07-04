import { en } from '../translations/translations.en.js';
import { fr } from '../translations/translations.fr.js';

const translations = { en, fr };

export function i18n (key, data) {

  const trs = translations[i18n.lang][key];

  if (trs == null) {
    console.warn(`Unknown translation ${key}`);
    return 'unknown';
  }

  return (typeof trs === 'function')
    ? trs(data)
    : trs;
}

// Default lang is en, change this at runtime
i18n.lang = 'en';

i18n.availableLanguages = {
  [en.LANGUAGE]: 'en',
  [fr.LANGUAGE]: 'fr',
};
