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
  'cc-logs',
];

const $listContainer = document.querySelector('.sandboxes-list');
const $sandboxContainer = document.querySelector('.sandbox-container');

// list of sandboxes
const htmlList = sandboxes.map((s) => `<li><a href="?component=${s}">${s}</a></li>`);
$listContainer.innerHTML = `<ul>${htmlList}</ul>`;

// get component name from URL
const { component } = Object.fromEntries(new URL(document.location).searchParams.entries());

if (!sandboxes.includes(component)) {
  $sandboxContainer.innerHTML = '<cc-notice intent="danger" message="No sandbox found !"></cc-notice>';
}
else {
  import(`./${component}/${component}-sandbox.js`);

  const $component = document.createElement(`${component}-sandbox`);
  $sandboxContainer.appendChild($component);
}
