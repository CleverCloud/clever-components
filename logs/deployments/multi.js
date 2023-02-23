import '../../src/components/cc-logs-deployment/cc-logs-deployment-multi.js';
import '../../src/components/cc-button/cc-button.js';
import '../../src/components/cc-select/cc-select.js';
import '../../src/components/cc-input-number/cc-input-number.js';
import { StepsController } from '../../src/components/cc-logs-deployment/stepsController.js';
import { addTranslations, setLanguage } from '../../src/lib/i18n.js';
import { lang, translations } from '../../src/translations/translations.en.js';
import instanceNames from '../utils/instances.json';
import { randomLogs, randomString } from '../utils/utils.js';
import { dedicatedBuildInstanceSteps, scenarios } from './scenario.js';

addTranslations(lang, translations);
setLanguage(lang);

/**
 * @type {CcLogsDeploymentMultiComponent}
 */
const $poc = document.querySelector('cc-logs-deployment-multi');

async function executeStep (ctrl, step, last) {
  if (step.startsWith('$info:')) {
    const info = step.substring('$info:'.length);
    console.log('info', info, last);
    ctrl.addStep(info, { group: false, intent: 'info', final: last });
  }
  else if (step === '$error') {
    console.log('error');
    ctrl.error();
  }
  else if (step === '$success') {
    console.log('success');
    ctrl.success();
  }
  else if (step.startsWith('$group:')) {
    const groupName = step.substring('$group:'.length);
    console.log('group', groupName);
    ctrl.addStep(groupName, { group: true, final: last });
  }
  else {
    console.log('step', step, last);
    ctrl.addStep(step, { group: false, final: last });
  }
}

async function executeInstance (instance, steps, done) {
  const worker = new Worker('instanceWorker.js', { type: 'module' });

  const ctrl = new StepsController([]);

  worker.addEventListener('message', function (e) {
    const { type, data } = e.data;
    if (type === 'addLogs') {
      ctrl.addLogs(randomLogs(data));
      $poc.setSteps(instance.id, ctrl.steps);
    }
    else if (type === 'executeStep') {
      executeStep(ctrl, data.step, data.last);
      $poc.setSteps(instance.id, ctrl.steps);
    }

    if (ctrl.isDone()) {
      worker.terminate();
      done();
    }
  });

  worker.postMessage({
    action: 'start',
    steps,
  });
}

let instanceIdx = 0;

function nextInstanceName () {
  const result = instanceNames[instanceIdx];
  instanceIdx = (instanceIdx + 1) % instanceNames.length;
  console.log(instanceIdx, instanceNames.length, result);
  return result;
}

async function executeScenario (scenario, instancesCount, dedicatedBuildVMBuild) {
  $poc.reset();

  const ctrl = new StepsController([]);
  scenario.reason.forEach((s) => {
    executeStep(ctrl, s, false);
    $poc.reason = ctrl.steps;
  });

  if (dedicatedBuildVMBuild) {
    const buildInstance = {
      id: randomString(),
      name: nextInstanceName(),
      instanceNumber: 0,
      steps: [],
      dedicatedBuildInstance: true,
    };
    $poc.instances = [buildInstance];

    await new Promise((resolve) => {
      executeInstance(buildInstance, dedicatedBuildInstanceSteps, () => {
        resolve();
      });
    });
  }

  const instances = Array(instancesCount)
    .fill(0)
    .map((_, index) => {
      return {
        id: randomString(),
        name: nextInstanceName(),
        instanceNumber: index,
        steps: [],
        dedicatedBuildInstance: false,
      };
    });
  $poc.instances = [...$poc.instances, ...instances];

  const done = {};

  instances
    .forEach((instance) => {
      done[instance.id] = false;

      executeInstance(instance, scenario.steps, () => {
        done[instance.id] = true;

        if (Object.values(done).every((d) => d === true)) {
          const ctrl = new StepsController([]);
          scenario.done.forEach((s) => {
            executeStep(ctrl, s, false);
            $poc.done = ctrl.steps;
          });
        }
      });
    });
}

// -- ctrl ------
const ctrl = document.querySelector('.ctrl');
const select = document.querySelector('cc-select');
const instancesCount = document.querySelector('cc-input-number');
const dedicatedBuildInstance = document.querySelector('#dedicatedBuildInstance');

ctrl.addEventListener('cc-button:click', (e) => {
  const button = e.target;
  if (!button.matches('cc-button')) {
    return;
  }

  if (button.dataset.action === 'start' && select.value != null) {
    const s = typeof scenarios[select.value] === 'function' ? scenarios[select.value](dedicatedBuildInstance.checked) : scenarios[select.value];
    executeScenario(s, instancesCount.value, dedicatedBuildInstance.checked).then();
  }
});

select.options = [
  ...Object.keys(scenarios).map((s) => {
    return { label: s, value: s };
  })];
select.value = select.options[0].value;
