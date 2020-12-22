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

// React hooks voodoo shit
let updateArgs = () => {
};

export function setUpdateArgsCallback (callback) {
  updateArgs = callback;
}

window.addEventListener('keypress', ({ keyCode, altKey, ctrlKey, metaKey, shiftKey }) => {
  // "i" key
  if (keyCode === 105 && !altKey && !ctrlKey && !metaKey && !shiftKey) {
    const langIdx = ALL_LANGS.indexOf(getLanguage());
    const nextIdx = (langIdx + 1) % ALL_LANGS.length;
    const nextLang = ALL_LANGS[nextIdx];
    // https://github.com/storybookjs/storybook/issues/3855#issuecomment-660158622
    updateArgs({ lang: nextLang });
  }
});

export function getLangArgType () {
  return { control: { type: 'inline-radio', options: getAvailableLanguages() } };
}

export function updateLang (lang) {
  window.localStorage.setItem('I18N_LANG', lang);
  setLanguage(lang);
}
