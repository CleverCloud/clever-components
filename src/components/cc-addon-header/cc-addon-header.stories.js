import { fakeString } from '../../lib/fake-strings.js';
import {
  configProviderData,
  elasticData,
  jenkinsData,
  keycloakData,
  materiaData,
  matomoData,
  pulsarData,
  redisData,
} from '../../stories/fixtures/addon.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import './cc-addon-header.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Addon/<cc-addon-header>',
  component: 'cc-addon-header',
};

const conf = {
  component: 'cc-addon-header',
};

/**
 * @typedef {import('./cc-addon-header.types.js').CcAddonHeaderStateLoaded} CcAddonHeaderStateLoaded
 * @typedef {import('./cc-addon-header.types.js').CcAddonHeaderStateError} CcAddonHeaderStateError
 * @typedef {import('./cc-addon-header.types.js').CcAddonHeaderStateLoading} CcAddonHeaderStateLoading
 * @typedef {import('./cc-addon-header.types.js').CcAddonHeaderStateRestarting} CcAddonHeaderStateRestarting
 * @typedef {import('./cc-addon-header.types.js').CcAddonHeaderStateRebuilding} CcAddonHeaderStateRebuilding
 * @typedef {import('./cc-addon-header.js').CcAddonHeader} CcAddonHeader
 */

export const defaultStory = makeStory(conf, {
  items: [
    {
      /** @type {CcAddonHeaderStateLoaded} */
      state: {
        type: 'loaded',
        ...configProviderData,
      },
    },
  ],
});

export const basicData = makeStory(conf, {
  items: [
    {
      /** @type {CcAddonHeaderStateLoaded} */
      state: {
        type: 'loaded',
        ...configProviderData,
      },
    },
    {
      /** @type {CcAddonHeaderStateLoading} */
      state: {
        type: 'loading',
        logsUrl: '',
        openLinks: [],
        actions: {
          restart: false,
          rebuildAndRestart: false,
        },
        productStatus: '',
      },
    },
  ],
});

export const withViewLogs = makeStory(conf, {
  items: [
    {
      /** @type {CcAddonHeaderStateLoaded} */
      state: {
        type: 'loaded',
        ...pulsarData,
      },
    },
    {
      /** @type {CcAddonHeaderStateLoading} */
      state: {
        type: 'loading',
        logsUrl: 'https://example.com/logs',
      },
    },
  ],
});

export const withOpenLink = makeStory(conf, {
  items: [
    {
      /** @type {CcAddonHeaderStateLoaded} */
      state: {
        type: 'loaded',
        ...jenkinsData,
      },
    },
    {
      /** @type {CcAddonHeaderStateLoading} */
      state: {
        type: 'loading',
        logsUrl: fakeString(15),
        openLinks: [
          {
            url: fakeString(15),
            name: fakeString(5),
          },
        ],
      },
    },
  ],
});

export const withOpenLinks = makeStory(conf, {
  items: [
    {
      /** @type {CcAddonHeaderStateLoaded} */
      state: {
        type: 'loaded',
        ...elasticData,
      },
    },
    {
      /** @type {CcAddonHeaderStateLoading} */
      state: {
        type: 'loading',
        logsUrl: fakeString(15),
        openLinks: [
          {
            url: fakeString(15),
            name: fakeString(5),
          },
          {
            url: fakeString(15),
            name: fakeString(5),
          },
        ],
      },
    },
  ],
});

export const withOpenLinkAndActions = makeStory(conf, {
  items: [
    {
      /** @type {CcAddonHeaderStateLoaded} */
      state: {
        type: 'loaded',
        ...matomoData,
      },
    },
    {
      /** @type {CcAddonHeaderStateLoading} */
      state: {
        type: 'loading',
        logsUrl: fakeString(15),
        openLinks: [
          {
            url: fakeString(15),
            name: fakeString(5),
          },
        ],
        actions: {
          restart: true,
          rebuildAndRestart: true,
        },
      },
    },
  ],
});

export const withProductStatus = makeStory(conf, {
  items: [
    {
      /** @type {CcAddonHeaderStateLoaded} */
      state: {
        type: 'loaded',
        ...materiaData,
      },
    },
    {
      /** @type {CcAddonHeaderStateLoading} */
      state: {
        type: 'loading',
        logsUrl: fakeString(15),
        openLinks: [
          {
            url: fakeString(15),
            name: fakeString(5),
          },
        ],
        actions: {
          restart: true,
          rebuildAndRestart: true,
        },
        productStatus: fakeString(5),
      },
    },
  ],
});

export const withLongProductStatus = makeStory(conf, {
  items: [
    {
      /** @type {CcAddonHeaderStateLoaded} */
      state: {
        type: 'loaded',
        ...keycloakData,
      },
    },
    {
      /** @type {CcAddonHeaderStateLoading} */
      state: {
        type: 'loading',
        logsUrl: fakeString(15),
        openLinks: [
          {
            url: fakeString(15),
            name: fakeString(5),
          },
        ],
        actions: {
          restart: true,
          rebuildAndRestart: true,
        },
        productStatus: fakeString(10),
      },
    },
  ],
});

export const withDeploymentStatusAndViewLogs = makeStory(conf, {
  items: [
    {
      /** @type {CcAddonHeaderStateLoaded} */
      state: {
        type: 'loaded',
        ...redisData,
        deploymentStatus: 'active',
      },
    },
    {
      /** @type {CcAddonHeaderStateLoading} */
      state: {
        type: 'loading',
        openLinks: [
          {
            url: fakeString(15),
            name: fakeString(5),
          },
        ],
        actions: {
          restart: true,
          rebuildAndRestart: true,
        },
        productStatus: fakeString(10),
        deploymentStatus: 'deploying',
      },
    },
  ],
});

export const waitingWithRestart = makeStory(conf, {
  items: [
    {
      /** @type {CcAddonHeaderStateRestarting} */
      state: {
        type: 'restarting',
        ...keycloakData,
      },
    },
  ],
});

export const waitingWithRebuilding = makeStory(conf, {
  items: [
    {
      /** @type {CcAddonHeaderStateRebuilding} */
      state: {
        type: 'rebuilding',
        ...keycloakData,
      },
    },
  ],
});

export const errorStory = makeStory(conf, {
  items: [
    {
      /** @type {CcAddonHeaderStateError} */
      state: {
        type: 'error',
      },
    },
  ],
});

export const simulationWithLoadingSuccess = makeStory(conf, {
  /** @type {Partial<CcAddonHeader>[]} */
  items: [
    {
      state: {
        type: 'loading',
        logsUrl: fakeString(15),
        openLinks: [
          {
            url: fakeString(15),
            name: fakeString(5),
          },
        ],
        actions: {
          restart: true,
          rebuildAndRestart: true,
        },
        productStatus: fakeString(10),
      },
    },
  ],
  simulations: [
    storyWait(
      2000,
      /** @param {CcAddonHeader[]} components */ ([component]) => {
        component.state = {
          type: 'loaded',
          ...keycloakData,
        };
      },
    ),
  ],
});

export const simulationWithLoadingError = makeStory(conf, {
  /** @type {Partial<CcAddonHeader>[]} */
  items: [
    {
      state: {
        type: 'loading',
        logsUrl: fakeString(15),
        openLinks: [
          {
            url: fakeString(15),
            name: fakeString(5),
          },
        ],
        actions: {
          restart: true,
          rebuildAndRestart: true,
        },
        productStatus: fakeString(10),
      },
    },
  ],
  simulations: [
    storyWait(
      2000,
      /** @param {CcAddonHeader[]} components */ ([component]) => {
        component.state = {
          type: 'error',
        };
      },
    ),
  ],
});

export const simulationWithRestarting = makeStory(conf, {
  /** @type {Partial<CcAddonHeader>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        ...keycloakData,
      },
    },
  ],
  simulations: [
    storyWait(
      2000,
      /** @param {CcAddonHeader[]} components */ ([component]) => {
        component.state = {
          type: 'restarting',
          ...keycloakData,
        };
      },
    ),
    storyWait(
      5000,
      /** @param {CcAddonHeader[]} components */ ([component]) => {
        component.state = { type: 'loaded', ...keycloakData };
      },
    ),
  ],
});

export const simulationWithRebuilding = makeStory(conf, {
  /** @type {Partial<CcAddonHeader>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        ...keycloakData,
      },
    },
  ],
  simulations: [
    storyWait(
      2000,
      /** @param {CcAddonHeader[]} components */ ([component]) => {
        component.state = {
          type: 'rebuilding',
          ...keycloakData,
        };
      },
    ),
    storyWait(
      5000,
      /** @param {CcAddonHeader[]} components */ ([component]) => {
        component.state = { type: 'loaded', ...keycloakData };
      },
    ),
  ],
});
