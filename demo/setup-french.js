// Setup langs and configure english
import { addTranslations, setLanguage } from '../src/lib/i18n.js';
import { lang, translations } from '../src/translations/translations.fr.js';

addTranslations(lang, translations);
setLanguage(lang);

import('../src/pricing/cc-pricing-product.smart-addon.js');
import('../src/pricing/cc-pricing-product.smart-runtime.js');
import('../src/zones/cc-zone-input.js');
import('../src/pricing/cc-pricing-page.smart.js');
