import { CHANGE, select } from '@storybook/addon-knobs';
import { addons } from '@storybook/addons';
import { addTranslations, getAvailableLanguages, getLanguage, setLanguage } from '../../src/lib/i18n.js';
import * as en from '../../src/translations/translations.en.js';
import * as fr from '../../src/translations/translations.fr.js';

// Init languages
addTranslations(en.lang, en.translations);
addTranslations(fr.lang, fr.translations);
addTranslations('missing', { LANGUAGE: '🤬 Missing' });

const INIT_LANG = window.localStorage.getItem('I18N_LANG') || 'en';

// Default to English
setLanguage(INIT_LANG);

const ALL_LANGS = Object.values(getAvailableLanguages());

const channel = addons.getChannel();

window.addEventListener('keypress', ({ keyCode, altKey, ctrlKey, metaKey, shiftKey }) => {
  // "i" key
  if (keyCode === 105 && !altKey && !ctrlKey && !metaKey && !shiftKey) {
    const langIdx = ALL_LANGS.indexOf(getLanguage());
    const nextIdx = (langIdx + 1) % ALL_LANGS.length;
    channel.emit(CHANGE, {
      name: 'Language',
      value: ALL_LANGS[nextIdx],
    });
  }
});

export function i18nKnob () {
  const i18nValue = select('Language', getAvailableLanguages(), getLanguage());
  if (getLanguage() !== i18nValue) {
    setLanguage(i18nValue);
  }
  window.localStorage.setItem('I18N_LANG', getLanguage());
}
