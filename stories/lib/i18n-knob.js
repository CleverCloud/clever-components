import * as en from '../../components/translations/translations.en.js';
import * as fr from '../../components/translations/translations.fr.js';
import { addTranslations, getAvailableLanguages, getLanguage, setLanguage } from '../../components/lib/i18n.js';
import { color, select } from '@storybook/addon-knobs';
import { forceReRender } from '@storybook/web-components';

// NOTE: this project could be interesting but it's not ready (no npm package and install via github fails)
// https://github.com/CodeByAlex/storybook-i18n-addon

// Init languages
addTranslations(en.lang, en.translations);
addTranslations(fr.lang, fr.translations);
addTranslations('missing', { LANGUAGE: '🤬 Missing' });

const INIT_LANG = window.localStorage.getItem('I18N_LANG') || 'en';

// Default to English
setLanguage(INIT_LANG);

const ALL_LANGS = Object.values(getAvailableLanguages());

let keyboardShortcutWasPressed = false;
window.addEventListener('keypress', ({ keyCode, altKey, ctrlKey, metaKey, shiftKey }) => {
  // "i" key
  if (keyCode === 105 && !altKey && !ctrlKey && !metaKey && !shiftKey) {
    keyboardShortcutWasPressed = true;
    const langIdx = ALL_LANGS.indexOf(getLanguage());
    const nextIdx = (langIdx + 1) % ALL_LANGS.length;
    setLanguage(ALL_LANGS[nextIdx]);
    forceReRender();
  }
});

export function i18nKnob () {

  if (keyboardShortcutWasPressed) {
    // This is very very ugly, but this trick helps to reset the knob default value
    // Maybe the knob will be updated automatically after 5.3
    // https://github.com/storybookjs/storybook/issues/8376
    color('Language');
  }

  const i18nValue = select('Language', getAvailableLanguages(), getLanguage());

  if (getLanguage() !== i18nValue && !keyboardShortcutWasPressed) {
    setLanguage(i18nValue);
  }
  window.localStorage.setItem('I18N_LANG', getLanguage());
  keyboardShortcutWasPressed = false;
}
