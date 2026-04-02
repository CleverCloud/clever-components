import '../src/components/cc-toaster/cc-toaster.js';
import { addTranslations, setLanguage } from '../src/lib/i18n/i18n.js';
import { updateRootContext } from '../src/lib/smart/smart-manager.js';
import { lang as enLang, translations as enTranslations } from '../src/translations/translations.en.js';
import { lang as frLang, translations as frTranslations } from '../src/translations/translations.fr.js';

addTranslations(enLang, enTranslations);
addTranslations(frLang, frTranslations);

const url = new URL(document.location);
const currentLang = url.searchParams.get('lang') || 'en';
setLanguage(currentLang);

const $langSwitcher = document.getElementById('lang-switcher');
$langSwitcher.value = currentLang;
$langSwitcher.addEventListener('change', (e) => {
  const newUrl = new URL(document.location);
  newUrl.searchParams.set('lang', e.target.value);
  window.location.href = newUrl.toString();
});

// Preserve lang param in sidebar links
document.querySelectorAll('.definition-link').forEach((link) => {
  const linkUrl = new URL(link.href);
  linkUrl.searchParams.set('lang', currentLang);
  link.href = linkUrl.toString();
});

updateRootContext({});

window.addEventListener('cc-notify', (event) => {
  document.querySelector('cc-toaster').show(event.detail);
});

const { definition, lang: _lang, ...componentProperties } = Object.fromEntries(url.searchParams.entries());

if (definition) {
  document.getElementById('empty-message').style.display = 'none';

  const componentName = definition.split('.').shift();

  import(`../src/components/${componentName}/${definition}.js`);

  const $container = document.querySelector('cc-smart-container');

  const $component = document.createElement(componentName);
  for (const [name, value] of Object.entries(componentProperties)) {
    $component.setAttribute(name, value);
  }
  $container.appendChild($component);

  // Highlight active link in sidebar
  const activeLink = document.querySelector(`.definition-link[href*="definition=${definition}"]`);
  if (activeLink) {
    activeLink.classList.add('active');
    activeLink.scrollIntoView({ block: 'nearest' });
  }

  // Show context panel
  const $contextPanel = document.getElementById('context-sidebar');
  $contextPanel.classList.add('visible');

  // Context buttons
  $contextPanel.addEventListener('click', (e) => {
    const button = e.target.closest('.ctx-btn');
    if (!button) {
      return;
    }
    $container.context = JSON.parse(button.dataset.context);
  });
}
