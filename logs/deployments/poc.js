import { addTranslations, setLanguage } from '../../src/lib/i18n.js';
import { lang, translations } from '../../src/translations/translations.en.js';
import '../../src/components/cc-logs-poc/cc-logs-poc.js';
import '../../src/components/cc-button/cc-button.js';
import '../../src/components/cc-select/cc-select.js';
import { randomLogs, sendLogs, sleep } from '../utils/utils.js';

addTranslations(lang, translations);
setLanguage(lang);

/**
 * @type {CcLogsPoc}
 */
const $poc = document.querySelector('cc-logs-poc');

const deploy = (reason, withBuild) => {
  return [
    '$group:deployment-asked',
    `$info:deployment-reason-${reason}`,
    '$info:application-details',
    withBuild ? '$info:deployment-details-with-build' : '$info:deployment-details-without-build',
    '$info:deployment-start',
  ];
};

const prepare = [
  '$group:prepare',
  'start-vm',
  '$wait:1000',
  'inject-env',
  '$logs:100-10',
  'build-cache',
  '$wait:100',
  '$info:build-cache/build-cache-found',
  'build-cache/download',
  '$logs:100-5',
];

const build = [
  '$group:build',
  'pre-build-hook',
  '$wait:100',
  '$info:pre-build-hook/pre-build-hook-not-found',
  'build/clone',
  '$logs:100-20',
  'build/build-command',
  '$logs:100-50',
  'post-build-hook',
  '$wait:100',
  '$info:post-build-hook/post-build-hook-not-found',
];

const run = [
  '$group:run',
  'pre-run-hook',
  '$wait:100',
  '$info:pre-run-hook/pre-run-hook-found',
  'pre-run-hook/run-hook',
  '$wait:5000',
  'start-app',
  '$logs:100-100',
  'post-run-hook',
  '$wait:100',
  '$info:post-run-hook/post-run-hook-not-found',
];

const deliver = [
  '$group:deliver',
  'monitoring/health-check',
  '$info:monitoring/health-check-ok',
  'wire',
  '$info:cron/no-cron',
];

const scenario = (reason, withBuild) => {
  let s = [
    ...deploy(reason, withBuild),
    ...prepare,
  ];
  if (withBuild) {
    s = s.concat(build);
  }
  s = s.concat([
    ...run,
    ...deliver,
    '$success',
  ]);

  return s;
};

const reasons = [
  ['user-new-version', true],
  ['user-restart', false],
  ['user-restart-version', false],
  ['user-change-scaling-conf', false],

  ['cc-cpu-load', false],
  ['cc-maintenance', false],
  ['cc-monitoring', false],
  ['cc-support', false],
];

const scenarios = {
  ...Object.fromEntries(reasons.map((r) => ([r[0], scenario(r[0], r[1])]))),
  'error-build': [
    '$group:deployment-asked',
    '$info:deployment-reason',
    '$info:deployment-details',
    '$info:deployment-start',

    ...prepare,

    '$group:build',
    'pre-build-hook',
    '$wait:100',
    '$info:pre-build-hook/pre-build-hook-not-found',
    'build/clone',
    '$logs:100-20',
    'build/build-command',
    '$logs:100-50',

    '$error',
  ],
};

async function executeStep (step, { first, last }) {
  if (typeof step !== 'string') {
    console.log('detail', step);
    $poc.setDetail(step);
  }
  else if (step.startsWith('$info:')) {
    const info = step.substring('$info:'.length);
    console.log('info', info);
    $poc.addStep(info, { group: false, intent: 'info', final: last });
  }
  else if (step.startsWith('$wait:')) {
    const duration = parseInt(step.substring('$wait:'.length));
    console.log('wait', duration);
    await sleep(duration);
  }
  else if (step.startsWith('$logs:')) {
    const spec = step.substring('$logs:'.length);
    console.log('logs', spec);
    const split = spec.split('-');
    const rate = parseInt(split[0]);
    const count = parseInt(split[1]);
    await sendLogs($poc, randomLogs(count), rate);
  }
  else if (step === '$error') {
    console.log('error');
    $poc.error();
  }
  else if (step === '$success') {
    console.log('success');
    $poc.success();
  }
  else if (step.startsWith('$group:')) {
    const groupName = step.substring('$group:'.length);
    console.log('group', groupName);
    $poc.addStep(groupName, { group: true, final: last });
  }
  else {
    console.log('step', step, last);
    $poc.addStep(step, { group: false, final: last });
  }
}

let stopping = false;
let stopped = true;

function toggleCtrl (disabled) {
  document.querySelectorAll('.ctrl cc-button').forEach((b) => {
    b.disabled = disabled;
  });
}

async function executeScenario (scenario) {
  if (stopping) {
    return;
  }

  stopped = false;

  $poc.steps = [];

  for (let i = 0; i < scenario.length; i++) {
    if (!stopping && !stopped) {
      await executeStep(scenario[i], { first: i === 0, last: i === scenario.length - 1 });
    }
    else {
      stopping = false;
      stopped = true;
      $poc.steps = [];
      toggleCtrl(false);
    }
  }
}

// -- ctrl ------
const ctrl = document.querySelector('.ctrl');
const select = document.querySelector('cc-select');

ctrl.addEventListener('cc-button:click', (e) => {
  const button = e.target;
  if (!button.matches('cc-button')) {
    return;
  }

  if (button.dataset.action === 'stop') {
    stopping = true;
    toggleCtrl(true);
  }
  else if (button.dataset.action === 'start' && select.value != null) {
    executeScenario(scenarios[select.value]).then();
  }
  else if (button.dataset.scenario != null) {
    executeScenario(scenarios[button.dataset.scenario]).then();
  }
});

select.options = [
  ...Object.keys(scenarios).map((s) => {
    return { label: s, value: s };
  })];
select.value = select.options[0].value;
