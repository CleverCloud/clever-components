import { addTranslations, setLanguage } from '../src/lib/i18n.js';
import { lang, translations } from '../src/translations/translations.en.js';
import '../src/components/cc-logs/cc-logs.js';
import '../src/components/cc-logs/cc-logs-foo.js';

addTranslations(lang, translations);
setLanguage(lang);

function generateLogs (count) {
  const now = new Date();
  return Array
    .from({ length: count })
    .map((_, index) => {
      const timestamp = now.getTime() + index;
      const randomNumber = Math.random();
      const randomString = randomNumber.toString(36).slice(2);
      return {
        id: `${timestamp}-${randomString}`,
        timestamp,
        message: `This is a message (${randomString})`,
        metadata: [
          {
            name: 'level',
            value: (randomNumber > 0.5)
              ? (randomNumber > 0.75)
                ? 'INFO'
                : 'WARN'
              : 'ERROR',
          },
          {
            name: 'ip',
            value: randomNumber > 0.25 ? '192.168.12.1' : '192.168.48.157',
          },
        ],
      };
    });
}

function $$ (selector) {
  return Array.from(document.querySelectorAll(selector));
}

const filter = [
  {
    metadata: 'level',
    value: 'WARN',
  },
  {
    metadata: 'level',
    value: 'ERROR',
  },
  {
    metadata: 'ip',
    value: '192.168.12.1',
  },
];

$$('.filter').forEach((item) => item.filter = filter);

// $logs.appendLogs(theLogs) ne marche pas si on le fait trop tôt

let i = 0;

let id = setInterval(() => {
  i += 1;
  if (i % 20 === 0) {
    // $$('.logs:not(.ignore)').forEach((item) => item.clear());
    clearInterval(id);
  }
  // else {
  const theLogs = generateLogs(10);
  $$('.logs:not(.ignore)').forEach((item) => item.appendLogs(theLogs));
  // }
}, 200);

// setTimeout(() => {
//   const theLogs = generateLogs(2000);
//   $$('.logs:not(.ignore)').forEach((item) => item.appendLogs(theLogs));
// }, 100);
