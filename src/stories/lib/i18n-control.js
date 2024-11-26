// eslint-disable-next-line import/no-extraneous-dependencies
import { useGlobals } from '@storybook/manager-api';
// eslint-disable-next-line import/no-extraneous-dependencies
import { addTranslations, getLanguage, setLanguage } from '../../lib/i18n/i18n.js';
import * as en from '../../translations/translations.en.js';
import * as fr from '../../translations/translations.fr.js';

const [_, updateGlobals] = useGlobals();

const availableLanguages = [
  { value: 'en', title: 'English' },
  { value: 'fr', title: 'Français' },
  { value: 'missing', title: '🤬 Missing' },
];

// Init languages
// @ts-expect-error
addTranslations(en.lang, en.translations);
// @ts-expect-error
addTranslations(fr.lang, fr.translations);

const INIT_LANG = window.localStorage.getItem('I18N_LANG') ?? 'en';

// Default to English
setLanguage(INIT_LANG);

const ALL_LANGS = availableLanguages.map((o) => o.value);

window.addEventListener('keypress', ({ key, altKey, ctrlKey, metaKey, shiftKey }) => {
  if (key === 'i' && !altKey && !ctrlKey && !metaKey && !shiftKey) {
    const langIdx = ALL_LANGS.indexOf(getLanguage());
    const nextIdx = (langIdx + 1) % ALL_LANGS.length;
    const nextLang = ALL_LANGS[nextIdx];
    updateGlobals({ locale: nextLang });
  }
});
