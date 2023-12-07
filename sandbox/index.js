import { addTranslations, setLanguage } from '../src/lib/i18n.js';
import { lang, translations } from '../src/translations/translations.en.js';
import '../src/components/cc-toaster/cc-toaster.js';
import '../src/components/cc-notice/cc-notice.js';

addTranslations(lang, translations);
setLanguage(lang);

window.addEventListener('cc:notify', (event) => {
  document.querySelector('cc-toaster').show(event.detail);
});

const sandboxes = [
  'cc-ansi-palette',
  'cc-logs',
  'cc-product-card',
];

const $listContainer = document.querySelector('.sandboxes-list');
const $sandboxContainer = document.querySelector('.sandbox-container');

// list of sandboxes
const htmlList = sandboxes.map((s) => `<li><a href="?component=${s}" data-sandbox="${s}">${s}</a></li>`).join('');
$listContainer.innerHTML = `<ul>${htmlList}</ul>`;

// get component name from URL
let { component } = Object.fromEntries(new URL(document.location).searchParams.entries());

if (component == null) {
  component = sandboxes[0];
}

if (!sandboxes.includes(component)) {
  $sandboxContainer.innerHTML = '<cc-notice intent="danger" message="No sandbox found !"></cc-notice>';
}
else {
  document.querySelector(`.sandboxes-list [data-sandbox="${component}"]`)?.classList.add('selected');

  import(`./${component}/${component}-sandbox.js`);

  const $component = document.createElement(`${component}-sandbox`);
  $sandboxContainer.appendChild($component);
}
