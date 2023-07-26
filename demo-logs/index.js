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
            value: randomNumber > 0.75 ? 'INFO' : 'WARN',
          },
          {
            name: 'ip',
            value: randomNumber > 0.25 ? '192.168.12.1' : '192.168.48.157',
          },
        ],
      };
    });
}

const $logs = Array.from(document.querySelectorAll('cc-logs'));
const $logsFoo = Array.from(document.querySelectorAll('cc-logs-foo'));

$logs[1].limit = 5;
$logsFoo[1].limit = 5;

const filter = [
  {
    metadata: 'level',
    value: 'WARN',
  },
  {
    metadata: 'ip',
    value: '192.168.12.1',
  },
];

$logs[2].filter = filter;
$logsFoo[2].filter = filter;

// $logs.appendLogs(theLogs) ne marche pas si on le fait trop tôt

let i = 0;

setInterval(() => {
  i += 1;
  if (i % 20 === 0) {
    $logs.forEach((item) => item.clear());
    $logsFoo.forEach((item) => item.clear());
  }
  else {
    const theLogs = generateLogs(1);
    $logs.forEach((item) => item.appendLogs(theLogs));
    $logsFoo.forEach((item) => item.appendLogs(theLogs));
  }
}, 1000);
