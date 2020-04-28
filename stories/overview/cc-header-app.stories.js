import '../../src/overview/cc-header-app.js';
import { makeStory, storyWait } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

const COMMIT_ONE = '99b8617a5e102b318593eed3cd0c0a67e77b7e9a';
const COMMIT_TWO = 'bf4c76b3c563050d32e411b2f06d11515c7d8304';

function app (variantName, variantLogoName, commit = COMMIT_ONE) {
  return {
    name: `Awesome ${variantName} app (PROD)`,
    commit,
    variantName,
    variantLogo: `https://static-assets.cellar.services.clever-cloud.com/logos/${variantLogoName}.svg`,
    lastDeploymentLogsUrl: '/url/to/logs?id=fe726a13-345b-46d1-9101-f4f232479122',
  };
}

export default {
  title: '🛠 Overview/<cc-header-app>',
  component: 'cc-header-app',
};

const conf = {
  component: 'cc-header-app',
  css: `
    cc-header-app:not(:last-child) {
      margin-bottom: 1rem;
    }
  `,
};

export const defaultStory = makeStory(conf, {
  items: [{ app: app('Node', 'nodejs'), status: 'running', runningCommit: COMMIT_ONE }],
});

export const skeleton = makeStory(conf, {
  items: [{}],
});

export const skeletonWithAppLoaded = makeStory(conf, {
  items: [{ app: app('Node', 'nodejs') }],
});

export const error = makeStory(conf, {
  items: [{ error: true }],
});

export const unknownState = makeStory(conf, {
  items: [{ app: app('PHP', 'php'), status: 'unknown' }],
});

export const stoppedState = makeStory(conf, {
  items: [{ app: app('Docker', 'docker'), status: 'stopped' }],
});

export const stoppedStateWithBrandNewApp = makeStory(conf, {
  items: [{ app: app('Python', 'python', null), status: 'stopped' }],
});

export const startFailedState = makeStory(conf, {
  items: [{ app: app('Java + WAR', 'java-war'), status: 'start-failed' }],
});

export const runningStateWithRunningCommitUnknown = makeStory(conf, {
  items: [{ app: app('Java + JAR', 'java-jar'), status: 'running' }],
});

export const runningState = makeStory(conf, {
  items: [{ app: app('Ruby', 'ruby'), status: 'running', runningCommit: COMMIT_ONE }],
});

export const restartFailedState = makeStory(conf, {
  items: [{ app: app('Java or Scala + Play! 2', 'play2'), status: 'restart-failed', runningCommit: COMMIT_ONE }],
});

export const startingStateWithDeployingCommitUnknown = makeStory(conf, {
  items: [{ app: app('Java + Maven', 'maven'), status: 'starting' }],
});

export const startingState = makeStory(conf, {
  items: [{ app: app('Go', 'go'), status: 'starting', runningCommit: COMMIT_ONE }],
});

export const restartingStateWithDeployingCommitUnknown = makeStory(conf, {
  items: [{ app: app('Scala', 'scala'), status: 'restarting', runningCommit: COMMIT_ONE }],
});

export const restartingState = makeStory(conf, {
  items: [{
    app: app('Haskell', 'haskell'),
    status: 'restarting',
    runningCommit: COMMIT_ONE,
    startingCommit: COMMIT_TWO,
  }],
});

export const restartingWithDowntimeState = makeStory(conf, {
  items: [{
    app: app('Static', 'apache'),
    status: 'restarting-with-downtime',
    runningCommit: COMMIT_ONE,
    startingCommit: COMMIT_ONE,
  }],
});

export const dataLoadedWithDisableButtons = makeStory(conf, {
  items: [
    { disableButtons: true, app: app('Docker', 'docker'), status: 'stopped' },
    { disableButtons: true, app: app('Ruby', 'ruby'), status: 'running' },
    { disableButtons: true, app: app('Scala', 'scala'), status: 'restarting' },
  ],
});

export const simulations = makeStory(conf, {
  items: [{}, {}],
  simulations: [
    storyWait(3000, ([component, componentError]) => {
      component.app = app('Node', 'nodejs');
      componentError.error = true;
    }),
    storyWait(2000, ([component]) => {
      component.status = 'running';
      component.runningCommit = COMMIT_ONE;
    }),
    storyWait(3000, ([component]) => {
      component.app = app('Node', 'nodejs', COMMIT_TWO);
      component.status = 'restarting';
      component.runningCommit = COMMIT_ONE;
    }),
    storyWait(1000, ([component]) => {
      component.startingCommit = COMMIT_TWO;
    }),
    storyWait(3000, ([component]) => {
      component.status = 'restart-failed';
      component.startingCommit = null;
    }),
    storyWait(3000, ([component]) => {
      component.status = 'stopped';
      component.runningCommit = null;
    }),
  ],
});

enhanceStoriesNames({
  defaultStory,
  skeleton,
  skeletonWithAppLoaded,
  error,
  unknownState,
  stoppedState,
  stoppedStateWithBrandNewApp,
  startFailedState,
  runningStateWithRunningCommitUnknown,
  runningState,
  restartFailedState,
  startingStateWithDeployingCommitUnknown,
  startingState,
  restartingStateWithDeployingCommitUnknown,
  restartingState,
  restartingWithDowntimeState,
  dataLoadedWithDisableButtons,
  simulations,
});
