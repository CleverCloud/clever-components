import * as en from '../../components/translations/translations.en.js';
import * as fr from '../../components/translations/translations.fr.js';
import { addTranslations, getAvailableLanguages, getLanguage, setLanguage } from '../../components/lib/i18n.js';
import { select } from '@storybook/addon-knobs';

// NOTE: this project could be interesting but it's not ready (no npm package and install via github fails)
// https://github.com/CodeByAlex/storybook-i18n-addon

// Init languages
addTranslations(en.lang, en.translations);
addTranslations(fr.lang, fr.translations);

const INIT_LANG = localStorage.getItem('I18N_LANG') || 'en';

// Default to English
setLanguage(INIT_LANG);

export function i18nKnob () {

  const i18nValue = select('Language', getAvailableLanguages(), getLanguage());

  if (getLanguage() !== i18nValue) {
    setLanguage(i18nValue);
    localStorage.setItem('I18N_LANG', i18nValue);
  }
}
