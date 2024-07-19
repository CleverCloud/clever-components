import { translations as enTranslations } from './translations.en.js';
import { translations as frTranslations } from './translations.fr.js';

type Translations = typeof frTranslations | typeof enTranslations;
type TranslationsWithoutLanguage = Omit<Translations, 'LANGUAGE'>;
type ValueOf<T> = T[keyof T];

export function i18n<Key extends keyof TranslationsWithoutLanguage>(key: Key, data?: Object): (TranslationsWithoutLanguage[Key] extends () => any ? ReturnType<TranslationsWithoutLanguage[Key]> : TranslationsWithoutLanguage[Key]);
