import { addTranslations, setLanguage } from '../../src/lib/i18n.js';
import { updateRootContext } from '../../src/lib/smart-manager.js';
import { lang, translations } from '../../src/translations/translations.en.js';
import '../../src/components/cc-toaster/cc-toaster.js';
import '../../src/components/cc-smart-container/cc-smart-container.js';
import '../../src/components/cc-logs-simple/cc-logs-simple.js';
import '../../src/components/cc-logs-simple/cc-logs-simple.smart.js';

addTranslations(lang, translations);
setLanguage(lang);

updateRootContext({});

document.addEventListener('cc:notify', (event) => {
  document.querySelector('cc-toaster').show(event.detail);
});
