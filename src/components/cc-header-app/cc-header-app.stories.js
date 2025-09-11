import { getAssetUrl } from '../../lib/assets-url.js';
import { ZONE } from '../../stories/fixtures/zones.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import './cc-header-app.js';

const COMMIT_ONE = '99b8617a5e102b318593eed3cd0c0a67e77b7e9a';
const COMMIT_TWO = 'bf4c76b3c563050d32e411b2f06d11515c7d8304';

export default {
  tags: ['autodocs'],
  title: '🛠 Overview/<cc-header-app>',
  component: 'cc-header-app',
};

const conf = {
  component: 'cc-header-app',
  tests: {
    accessibility: {
      enable: true,
      ignoredRules: ['color-contrast'],
    },
  },
};

/**
 * @typedef {import('./cc-header-app.js').CcHeaderApp} CcHeaderApp
 * @typedef {import('./cc-header-app.types.js').HeaderAppStateLoaded} HeaderAppStateLoaded
 * @typedef {import('./cc-header-app.types.js').HeaderAppStateLoading} HeaderAppStateLoading
 * @typedef {import('./cc-header-app.types.js').HeaderAppStateError} HeaderAppStateError
 * @typedef {import('../common.types.js').App} App
 * @typedef {import('../common.types.js').Zone} Zone
 */

/**
 * @param {string} variantName
 * @param {string} variantLogoName
 * @param {string} [commit]
 * @returns {App & { type: 'loaded', zone: Zone }}
 */
function appWithTypeLoadedAndZone(variantName, variantLogoName, commit = COMMIT_ONE) {
  return {
    type: 'loaded',
    name: `Awesome ${variantName} app (PROD)`,
    commit,
    variantName,
    variantLogo: getAssetUrl(`/logos/${variantLogoName}.svg`),
    lastDeploymentLogsUrl: '/url/to/logs?id=fe726a13-345b-46d1-9101-f4f232479122',
    zone: ZONE,
  };
}

export const defaultStory = makeStory(conf, {
  items: [
    {
      /** @type {HeaderAppStateLoaded} */
      state: {
        ...appWithTypeLoadedAndZone('Node', 'nodejs'),
        status: 'running',
        runningCommit: COMMIT_ONE,
      },
    },
  ],
});

export const loading = makeStory(conf, {
  items: [
    {
      /** @type {HeaderAppStateLoading} */
      state: { type: 'loading' },
    },
  ],
});

export const error = makeStory(conf, {
  items: [
    {
      /** @type {HeaderAppStateError} */
      state: { type: 'error' },
    },
  ],
});

export const unknownState = makeStory(conf, {
  items: [
    {
      /** @type {HeaderAppStateLoaded} */
      state: {
        ...appWithTypeLoadedAndZone('PHP', 'php'),
        status: 'unknown',
      },
    },
  ],
});

export const stoppedState = makeStory(conf, {
  items: [
    {
      /** @type {HeaderAppStateLoaded} */
      state: {
        ...appWithTypeLoadedAndZone('Docker', 'docker'),
        status: 'stopped',
      },
    },
  ],
});

export const stoppedStateWithBrandNewApp = makeStory(conf, {
  items: [
    {
      /** @type {HeaderAppStateLoaded} */
      state: {
        ...appWithTypeLoadedAndZone('Python', 'python', null),
        status: 'stopped',
      },
    },
  ],
});

export const startFailedState = makeStory(conf, {
  items: [
    {
      /** @type {HeaderAppStateLoaded} */
      state: {
        ...appWithTypeLoadedAndZone('Java + WAR', 'java-war'),
        status: 'start-failed',
      },
    },
  ],
});

export const runningStateWithRunningCommitUnknown = makeStory(conf, {
  items: [
    {
      /** @type {HeaderAppStateLoaded} */
      state: {
        ...appWithTypeLoadedAndZone('Java + WAR', 'java-war'),
        status: 'running',
      },
    },
  ],
});

export const runningState = makeStory(conf, {
  items: [
    {
      /** @type {HeaderAppStateLoaded} */
      state: {
        ...appWithTypeLoadedAndZone('Ruby', 'ruby'),
        status: 'running',
        runningCommit: COMMIT_ONE,
      },
    },
  ],
});

export const restartFailedState = makeStory(conf, {
  items: [
    {
      /** @type {HeaderAppStateLoaded} */
      state: {
        ...appWithTypeLoadedAndZone('Java or Scala + Play! 2', 'play2'),
        status: 'restart-failed',
        runningCommit: COMMIT_ONE,
      },
    },
  ],
});

export const startingStateWithDeployingCommitUnknown = makeStory(conf, {
  items: [
    {
      /** @type {HeaderAppStateLoaded} */
      state: {
        ...appWithTypeLoadedAndZone('Java + Maven', 'maven'),
        status: 'starting',
      },
    },
  ],
});

export const startingState = makeStory(conf, {
  items: [
    {
      /** @type {HeaderAppStateLoaded} */
      state: {
        ...appWithTypeLoadedAndZone('Go', 'go'),
        status: 'starting',
        runningCommit: COMMIT_ONE,
      },
    },
  ],
});

export const restartingStateWithDeployingCommitUnknown = makeStory(conf, {
  items: [
    {
      /** @type {HeaderAppStateLoaded} */
      state: {
        ...appWithTypeLoadedAndZone('Scala', 'scala'),
        status: 'restarting',
        runningCommit: COMMIT_ONE,
      },
    },
  ],
});

export const restartingState = makeStory(conf, {
  items: [
    {
      /** @type {HeaderAppStateLoaded} */
      state: {
        ...appWithTypeLoadedAndZone('Haskell', 'haskell'),
        status: 'restarting',
        runningCommit: COMMIT_ONE,
        startingCommit: COMMIT_TWO,
      },
    },
  ],
});

export const restartingWithDowntimeState = makeStory(conf, {
  items: [
    {
      /** @type {HeaderAppStateLoaded} */
      state: {
        ...appWithTypeLoadedAndZone('Static', 'apache'),
        status: 'restarting-with-downtime',
        runningCommit: COMMIT_ONE,
        startingCommit: COMMIT_ONE,
      },
    },
  ],
});

export const dataLoadedWithDisableButtons = makeStory(conf, {
  items: [
    {
      disableButtons: true,
      /** @type {HeaderAppStateLoaded} */
      state: {
        ...appWithTypeLoadedAndZone('Docker', 'docker'),
        status: 'stopped',
      },
    },
    {
      disableButtons: true,
      /** @type {HeaderAppStateLoaded} */
      state: {
        ...appWithTypeLoadedAndZone('Ruby', 'ruby'),
        status: 'running',
      },
    },
    {
      disableButtons: true,
      /** @type {HeaderAppStateLoaded} */
      state: {
        ...appWithTypeLoadedAndZone('Scala', 'scala'),
        status: 'restarting',
      },
    },
  ],
});

export const simulations = makeStory(conf, {
  items: [{}, {}],
  simulations: [
    storyWait(
      3000,
      /** @param {CcHeaderApp[]} components */
      ([component, componentError]) => {
        component.state = {
          ...appWithTypeLoadedAndZone('Node', 'nodejs'),
          status: 'running',
          runningCommit: COMMIT_ONE,
        };
        componentError.state = { type: 'error' };
      },
    ),
    storyWait(
      3000,
      /** @param {CcHeaderApp[]} components */
      ([component]) => {
        component.state = {
          ...component.state,
          ...appWithTypeLoadedAndZone('Node', 'nodejs', COMMIT_TWO),
          status: 'restarting',
          runningCommit: COMMIT_ONE,
        };
      },
    ),
    storyWait(
      1000,
      /** @param {CcHeaderApp & { state: HeaderAppStateLoaded }[]} components */
      ([component]) => {
        component.state = {
          ...component.state,
          startingCommit: COMMIT_TWO,
        };
      },
    ),
    storyWait(
      3000,
      /** @param {CcHeaderApp & { state: HeaderAppStateLoaded }[]} components */
      ([component]) => {
        component.state = {
          ...component.state,
          status: 'restart-failed',
          startingCommit: null,
        };
      },
    ),
    storyWait(
      3000,
      /** @param {CcHeaderApp & { state: HeaderAppStateLoaded }[]} components */
      ([component]) => {
        component.state = {
          ...component.state,
          status: 'stopped',
          runningCommit: null,
        };
      },
    ),
  ],
});
