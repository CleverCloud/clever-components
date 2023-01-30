import { DateRange } from '../../src/components/cc-instances-timeline/cc-instances-timeline.js';
import instanceNames from '../utils/instances.json';
import {
  parseBoolean,
  parseInteger,
  random,
  randomCommit, randomLog as rl,
  randomPick,
  randomString,
  sendLogs,
} from '../utils/utils.js';
import '../../src/components/cc-button/cc-button.js';
import '../../src/components/cc-logs-advanced/cc-logs-advanced.js';

function parseDateTime (str) {
  const s1 = str.split(' ');
  const datePart = s1[0];
  const timePart = s1[1];

  const d = datePart.split('/');
  const t = timePart.split(':');

  const date = new Date();
  date.setDate(parseInt(d[0]));
  date.setMonth(parseInt(d[1]) - 1);
  date.setFullYear(parseInt(d[2]));
  date.setHours(parseInt(t[0]));
  date.setMinutes(parseInt(t[1]));
  date.setSeconds(parseInt(t[2]));
  date.setMilliseconds(0);

  return date.getTime();
}

const dateRange = new DateRange(
  parseDateTime('01/12/2022 13:00:00'),
  parseDateTime('01/12/2022 16:00:00'),
);

const instances = [
  {
    displayName: 'Coucou',
    instanceNumber: 0,
    start: parseDateTime('01/12/2022 14:00:30'),
    end: parseDateTime('01/12/2022 15:00:00'),
    state: 'DELETED',
  },
  {
    displayName: 'Bonjour',
    instanceNumber: 1,
    start: parseDateTime('01/12/2022 14:03:00'),
    end: parseDateTime('01/12/2022 15:00:00'),
    state: 'DELETED',
  },
  {
    displayName: 'Hello',
    instanceNumber: 2,
    start: parseDateTime('01/12/2022 14:30:20'),
    end: parseDateTime('01/12/2022 15:00:00'),
    state: 'DELETED',
  },
  {
    displayName: 'Hi',
    instanceNumber: 3,
    start: parseDateTime('01/12/2022 14:35:20'),
    end: parseDateTime('01/12/2022 14:50:00'),
    state: 'DELETED',
  },

  {
    displayName: 'Toto',
    instanceNumber: 0,
    start: parseDateTime('01/12/2022 15:00:10'),
    state: 'UP',
  },
  {
    displayName: 'Titi',
    instanceNumber: 1,
    start: parseDateTime('01/12/2022 15:01:00'),
    state: 'UP',
  },
  {
    displayName: 'Tata',
    instanceNumber: 2,
    start: parseDateTime('01/12/2022 15:01:00'),
    state: 'UP',
  },
];
const deployments = [
  {
    date: parseDateTime('01/12/2022 14:00:00'),
    action: 'DEPLOY',
  },
  {
    date: parseDateTime('01/12/2022 14:30:00'),
    action: 'UPSCALE',
  },
  {
    date: parseDateTime('01/12/2022 14:35:00'),
    action: 'UPSCALE',
  },
  {
    date: parseDateTime('01/12/2022 14:50:00'),
    action: 'DOWNSCALE',
  },
  {
    date: parseDateTime('01/12/2022 15:00:00'),
    action: 'DEPLOY',
    cause: 'Git',
  },
];

const logLevels = [
  'TRACE',
  'DEBUG',
  'WARN',
  'ERROR',
  'INFO',
];

const logStepsWithoutBuild = [
  'envVarInjection',
  'preStartHook',
  'start',
  'postStartHook',
];

const logStepsBuildOnly = [
  'envVarInjection',
  'preBuildHook',
  'build',
  'postBuildHook',
];

const logStepsWithBuild = [
  'envVarInjection',
  'preBuildHook',
  'build',
  'postBuildHook',
  'preStartHook',
  'start',
  'postStartHook',
];

const logSources = [
  'cron',
  'sys',
  'app',
  'worker',
];

// const $timeline = document.querySelector('cc-instances-timeline');
// const $logs = document.querySelector('cc-logs-advanced');

class Logger {
  constructor (timeline, logs) {
    this.timeline = timeline;
    this.logs = logs;
  }

  set dateRange (dateRange) {
    this.timeline.dateRange = dateRange;
  }

  get deployments () {
    return this.timeline.deployments;
  }

  set deployments (deployments) {
    this.timeline.deployments = deployments;
    this.logs.deployments = deployments;
  }

  get instances () {
    return this.timeline.instances;
  }

  set instances (instances) {
    this.timeline.instances = instances;
    this.logs.instances = instances;
  }

  addLogs (logs) {
    this.timeline.addLogs(logs);
    this.logs.addLogs(logs);
  }
}

const logView = new Logger(
  document.querySelector('cc-instances-timeline'),
  document.querySelector('cc-logs-advanced'),
);

let instanceIdx = 0;

function newInstance (deployment, number, build, dedicatedBuild) {
  const instance = {
    id: randomString(),
    state: 'BOOTING',
    flavor: {
      name: 'XS',
      mem: 1024,
      cpus: 1,
      price: 0.3436,
    },
    dedicatedBuild: dedicatedBuild,
    build: build,
    commit: deployment.commit,
    deployNumber: deployment.id,
    deployId: deployment.uuid,
    instanceNumber: number,
    displayName: instanceNames[instanceIdx],
    creationDate: new Date().getTime(),
  };

  instanceIdx++;

  return instance;
}

function findRunningInstances () {
  return logView.instances.filter((i) => i.state === 'UP' && !i.dedicatedBuild);
}
function findNumberOfRunningInstances () {
  return findRunningInstances().length;
}
function findInstance (id) {
  return logView.instances.find((i) => i.id === id);
}

function findLastDeployment () {
  return logView.deployments.length === 0 ? null : logView.deployments[logView.deployments.length - 1];
}

function setDeploymentState (deployment, state) {
  logView.deployments = [...logView.deployments.filter((d) => d.uuid !== deployment.uuid), {
    ...deployment,
    state: state,
  }];
}

function setInstanceState (instance, state) {
  const now = new Date().getTime();
  const newHistoryItem = {
    transition: {
      from: null,
      to: state,
    },
    timing: {
      start: now,
    },
  };

  let history;
  if (instance.history?.length > 0) {
    const previousItem = instance.history[instance.history.length - 1];
    previousItem.timing = {
      ...previousItem.timing,
      end: now,
    };

    history = [
      ...instance.history.slice(-1),
      previousItem,
      newHistoryItem,
    ];
  }
  else {
    history = [newHistoryItem];
  }

  logView.instances = [...logView.instances.filter((i) => i.id !== instance.id), {
    ...instance,
    state: state,
    history,
  }];
}

const instanceStopHandlers = new Map();
async function startInstance (instance, steps) {
  setInstanceState(instance, 'BOOTING');
  await sendLogs(logView, randomLogs(instance.id, 'boot', random(5, 15)), random(100, 400));

  setInstanceState(instance, 'STARTING');

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    await sendLogs(logView, randomLogs(instance.id, step, random(5, 15)), random(100, 400));
  }

  let interval;
  if (steps[steps.length - 1] === 'postStartHook') {
    setInstanceState(instance, 'DEPLOYING');
    await sendLogs(logView, randomLogs(instance.id, 'deploy', random(5, 15)), random(100, 400));

    setInstanceState(instance, 'UP');

    interval = setInterval(() => {
      logView.addLogs(randomLogs(instance.id, 'run', 1));
    }, random(800, 1500));
  }

  instanceStopHandlers.set(instance.id, async () => {
    if (interval) {
      clearInterval(interval);
    }
    setInstanceState(instance, 'STOPPING');
    await sendLogs(logView, randomLogs(instance.id, 'run', 10), 100);

    setInstanceState(instance, 'DELETED');
  });
}

async function startInstances (deployment, build, separateBuild) {
  if (build && separateBuild) {
    const buildInstance = newInstance(deployment, 0, true, true);
    logView.instances = [...logView.instances, buildInstance];
    await startInstance(buildInstance, logStepsBuildOnly);
    stopInstance(buildInstance).then();
  }

  const instanceNumberStart = findNumberOfRunningInstances();

  for (let i = 0; i < deployment.instances; i++) {
    const instanceNumber = instanceNumberStart + i;
    const instance = newInstance(deployment, instanceNumber, separateBuild ? false : build && instanceNumber === 0, false);
    logView.instances = [...logView.instances, instance];

    if (instance.build) {
      await startInstance(instance, separateBuild ? logStepsWithoutBuild : (instanceNumber === 0 ? logStepsWithBuild : logStepsWithoutBuild));
    }
    else {
      startInstance(instance, separateBuild ? logStepsWithoutBuild : (instanceNumber === 0 ? logStepsWithBuild : logStepsWithoutBuild)).then();
    }
  }

  const deployDone = setInterval(() => {
    const instances = logView.instances.filter((i) => i.deployId === deployment.uuid);

    const isInstanceInFinalState = (instance) => {
      return instance.state === 'UP' || instance.state === 'DELETED';
    };

    if (!instances.some((i) => !isInstanceInFinalState(i))) {
      clearInterval(deployDone);
      setDeploymentState(deployment, 'OK');
    }
  }, 500);
}

async function stopInstance (instance) {
  instanceStopHandlers.get(instance.id)();
}

async function stopInstances (instancesToStop) {
  await Promise.all(instancesToStop.map(stopInstance));
}

async function stopAllInstances (deployment = null) {
  let instancesToStop = logView.instances.filter((i) => i.state === 'UP');
  if (deployment != null) {
    instancesToStop = instancesToStop.filter((i) => i.deployId === deployment.uuid);
  }
  await stopInstances(instancesToStop);
}

// ----------------------------------------

export function randomMetadata (step) {
  const level = (step === 'run' || step === 'build' || step.endsWith('Hook'))
    ? 'INFO'
    : randomPick(logLevels);

  return {
    level,
    step,
    source: randomPick(logSources),
  };
}

function randomLog (instanceId, step) {
  const log = rl();

  const instance = findInstance(instanceId);

  // log.instanceId = instance.id;
  // log.deploymentId = instance.deployId;
  log.metadata = randomMetadata(step);
  log.metadata.instanceId = instance.id;
  log.metadata.instanceState = instance.state;
  log.metadata.deploymentId = instance.deployId;

  return log;
}

function randomLogs (instanceId, step, count) {
  return Array(count).fill(0).map(() => randomLog(instanceId, step));
}

// ---------------------------------------------

async function start (instanceCount, build, separateBuild) {
  const lastDeployment = findLastDeployment();

  if (lastDeployment != null) {
    await stopAllInstances(lastDeployment);
  }

  const id = lastDeployment == null ? 1 : lastDeployment.id + 1;
  const commit = lastDeployment == null ? randomCommit() : lastDeployment.commit;
  const deployment = {
    id,
    uuid: `deployment_${randomString()}`,
    date: new Date().getTime(),
    state: 'WIP',
    action: 'DEPLOY',
    commit: commit,
    cause: 'Console',
    instances: instanceCount,
    author: {
      id: 'user_f704a8cf-28d5-449d-b269-1db6a2e932c7',
      name: 'Pierre DE SOYRES',
    },
  };

  logView.deployments = [...logView.deployments, deployment];

  await startInstances(deployment, build, separateBuild);
}

async function scaleUp (instancesCount) {
  const lastDeployment = findLastDeployment();
  if (lastDeployment == null) {
    console.error('cannot scale up');
    return;
  }

  const deployment = {
    id: lastDeployment.id + 1,
    uuid: `deployment_${randomString()}`,
    date: new Date().getTime(),
    state: 'WIP',
    action: 'UPSCALE',
    commit: lastDeployment.commit,
    cause: 'Console',
    instances: instancesCount,
    author: {
      id: 'user_f704a8cf-28d5-449d-b269-1db6a2e932c7',
      name: 'Pierre DE SOYRES',
    },
  };

  logView.deployments = [...logView.deployments, deployment];

  await startInstances(deployment, false, false);
}

async function scaleDown (instancesCount) {
  const lastDeployment = findLastDeployment();
  if (lastDeployment == null) {
    console.error('cannot scale down');
    return;
  }

  const deployment = {
    id: lastDeployment.id + 1,
    uuid: `deployment_${randomString()}`,
    date: new Date().getTime(),
    state: 'WIP',
    action: 'DOWNSCALE',
    commit: lastDeployment.commit,
    cause: 'Console',
    instances: 0,
    author: {
      id: 'user_f704a8cf-28d5-449d-b269-1db6a2e932c7',
      name: 'Pierre DE SOYRES',
    },
  };

  logView.deployments = [...logView.deployments, deployment];

  const instances = [...findRunningInstances().sort((i1, i2) => i2.instanceNumber - i1.instanceNumber)];
  const instancesToStop = instances.slice(0, instancesCount);

  await stopInstances(instancesToStop);

  setDeploymentState(deployment, 'OK');
}

async function commit (separateBuild) {
  const instanceCount = findNumberOfRunningInstances();
  const lastDeployment = findLastDeployment();
  const id = lastDeployment == null ? 1 : lastDeployment.id + 1;

  await stopAllInstances();

  const deployment = {
    id,
    uuid: `deployment_${randomString()}`,
    date: new Date().getTime(),
    state: 'WIP',
    action: 'DEPLOY',
    commit: randomCommit(),
    cause: 'Git',
    instances: instanceCount,
    author: {
      id: 'user_f704a8cf-28d5-449d-b269-1db6a2e932c7',
      name: 'Pierre DE SOYRES',
    },
  };

  logView.deployments = [...logView.deployments, deployment];

  await startInstances(deployment, true, separateBuild);
}

async function restart (build, separateBuild) {
  const lastDeployment = findLastDeployment();
  const instanceCount = findNumberOfRunningInstances();

  await stopAllInstances();

  const id = lastDeployment == null ? 1 : lastDeployment.id + 1;
  const commit = lastDeployment == null ? randomCommit() : lastDeployment.commit;
  const deployment = {
    id,
    uuid: `deployment_${randomString()}`,
    date: new Date().getTime(),
    state: 'WIP',
    action: 'DEPLOY',
    commit: commit,
    cause: 'Console',
    instances: instanceCount === 0 ? 2 : instanceCount,
    author: {
      id: 'user_f704a8cf-28d5-449d-b269-1db6a2e932c7',
      name: 'Pierre DE SOYRES',
    },
  };

  logView.deployments = [...logView.deployments, deployment];

  await startInstances(deployment, build, separateBuild);
}

async function stop () {
  const lastDeployment = findLastDeployment();
  if (lastDeployment == null) {
    console.error('cannot stop');
    return;
  }

  const deployment = {
    id: lastDeployment.id + 1,
    uuid: `deployment_${randomString()}`,
    date: new Date().getTime(),
    state: 'WIP',
    action: 'UNDEPLOY',
    commit: lastDeployment.commit,
    cause: 'Console',
    instances: 0,
    author: {
      id: 'user_f704a8cf-28d5-449d-b269-1db6a2e932c7',
      name: 'Pierre DE SOYRES',
    },
  };

  logView.deployments = [...logView.deployments, deployment];

  await stopAllInstances();

  setDeploymentState(deployment, 'OK');
}

// -- time range refresh ------

const rate = 10;
// 2 minutes
const timeWindow = 5 * 60 * 1000;
function refreshTimeRange () {
  const dateRange = DateRange.relative(timeWindow);
  dateRange.from = Math.max(
    dateRange.from,
    logView.deployments
      .map((d) => d.date)
      .reduce((p, n) => Math.min(p, n), dateRange.to),
  );
  logView.dateRange = dateRange;
}
refreshTimeRange();

let interval = null;
function toggleTimelineFollow () {
  if (interval != null) {
    clearInterval(interval);
    interval = null;
  }
  else {
    interval = setInterval(refreshTimeRange, rate);
  }
}
toggleTimelineFollow();

// --- ctrl ------

function toggleTimeline () {
  const element = document.querySelector('.timeline-wrapper');
  if (element.style.display === 'none') {
    element.style.display = 'block';
  }
  else {
    element.style.display = 'none';
  }
}

const ctrl = document.querySelector('.ctrl');

ctrl.addEventListener('cc-button:click', (e) => {
  const button = e.target;
  if (!button.matches('cc-button')) {
    return;
  }

  if (button.dataset.action === 'start') {
    const instancesCount = parseInteger('instances', button.dataset.instances, 1);
    const build = parseBoolean('build', button.dataset.build, false);
    const separateBuild = build ? parseBoolean('separateBuild', button.dataset.separateBuild, false) : false;

    start(instancesCount, build, separateBuild).then();
  }
  else if (button.dataset.action === 'scaleUp') {
    const instancesCount = parseInteger('instances', button.dataset.instances, 1);

    scaleUp(instancesCount).then();
  }
  else if (button.dataset.action === 'scaleDown') {
    const instancesCount = parseInteger('instances', button.dataset.instances, 1);

    scaleDown(instancesCount).then();
  }
  else if (button.dataset.action === 'commit') {
    const separateBuild = parseBoolean('separateBuild', button.dataset.separateBuild, false);

    commit(separateBuild).then();
  }
  else if (button.dataset.action === 'restart') {
    const build = parseBoolean('build', button.dataset.build, false);
    const separateBuild = build ? parseBoolean('separateBuild', button.dataset.separateBuild, false) : false;

    restart(build, separateBuild).then();
  }
  else if (button.dataset.action === 'stop') {
    stop().then();
  }
  else if (button.dataset.action === 'timeline_follow') {
    toggleTimelineFollow();
  }
  else if (button.dataset.action === 'toggle_timeline') {
    toggleTimeline();
  }
});
