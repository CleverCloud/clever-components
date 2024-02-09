import '../../../cc-toaster/cc-toaster.js';
import '../../../cc-notice/cc-notice.js';
import '../../../cc-smart-container/cc-smart-container.js';
import { addTranslations, setLanguage } from '../../../../lib/i18n.js';
import { notify, notifyError, notifySuccess } from '../../../../lib/notifications.js';
import { lang, translations } from '../../../../translations/translations.en.js';
import { toJson } from './json.js';

if (document.querySelector('cc-toaster') == null) {
  const toaster = document.createElement('cc-toaster');
  toaster.setAttribute('animation', 'fade-and-slide');
  toaster.setAttribute('position', 'top-right');
  toaster.setAttribute('toast-default-options', '{"timeout": 3000, "closeable": true, "showProgress": true}');
  document.body.appendChild(toaster);
}

window.addEventListener('cc:notify', (event) => {
  document.querySelector('cc-toaster').show(event.detail);
});

addTranslations(lang, translations);
setLanguage(lang);

window.onload = () => {
  const form = document.querySelector('form');
  if (form != null) {
    form.addEventListener('submit', () => {
      notify({ intent: 'info', message: 'Form was submitted' });

      const formData = new FormData(form);
      const formDataStr = JSON.stringify(Object.fromEntries(formData.entries()), null, 4);

      let dataElement = document.querySelector('.data');
      if (dataElement == null) {
        dataElement = document.createElement('cc-notice');
        dataElement.classList.add('data');
        dataElement.intent = 'info';
        dataElement.heading = 'Form data';
        document.querySelector('.main').appendChild(dataElement);
      }
      dataElement.innerHTML = `<pre slot="message">${formDataStr}</pre>`;
    });
  }
  const ccForm = document.querySelector('cc-my-form');
  if (ccForm != null) {
    ccForm.addEventListener('cc-my-form:formSubmit', () => {
      notify({ intent: 'info', message: 'Form was submitted' });
    });
    ccForm.addEventListener('form:valid', () => {
      notifySuccess('Form is valid');
    });
    ccForm.addEventListener('form:invalid', (e) => {
      notifyError(toJson(e.detail), 'Form is not valid');
    });
  }
};
