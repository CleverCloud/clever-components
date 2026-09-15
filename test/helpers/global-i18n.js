import { addTranslations, setLanguage } from '../../src/lib/i18n/i18n.js';
import { lang, translations } from '../../src/translations/translations.en.js';

addTranslations(lang, translations);
setLanguage(lang);
