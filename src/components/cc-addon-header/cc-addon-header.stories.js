import { fakeString } from '../../lib/fake-strings.js';
import {
  configProviderData,
  elasticData,
  jenkinsData,
  keycloakData,
  materiaData,
  matomoData,
} from '../../stories/fixtures/addon.js';
import { ZONE } from '../../stories/fixtures/zones.js';
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
        ...materiaData,
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
        productStatus: fakeString(4),
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
        providerName: 'Keycloak',
        providerLogoUrl: 'https://cc-keycloak.cellar-c2.services.clever-cloud.com/keycloak_logo.svg',
        name: 'my-keycloak',
        id: 'keycloak_511f6k82-9r44-6w90-86s3-az6m5kvyy478',
        zone: {
          type: 'loaded',
          ...ZONE,
        },
        logsUrl: 'https://example.com/logs',
        openLinks: [
          {
            url: 'https://example.com/logs',
            name: `Keycloak`,
          },
        ],
        actions: {
          restart: true,
          rebuildAndRestart: true,
        },
        productStatus: 'Beta',
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
        providerName: 'Keycloak',
        providerLogoUrl: 'https://cc-keycloak.cellar-c2.services.clever-cloud.com/keycloak_logo.svg',
        name: 'my-keycloak',
        id: 'keycloak_511f6k82-9r44-6w90-86s3-az6m5kvyy478',
        zone: {
          type: 'loaded',
          ...ZONE,
        },
        logsUrl: 'https://example.com/logs',
        openLinks: [
          {
            url: 'https://example.com/logs',
            name: `Keycloak`,
          },
        ],
        actions: {
          restart: true,
          rebuildAndRestart: true,
        },
        productStatus: 'Beta',
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
        productStatus: fakeString(4),
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
        productStatus: fakeString(4),
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
          providerName: 'Keycloak',
          providerLogoUrl: 'https://cc-keycloak.cellar-c2.services.clever-cloud.com/keycloak_logo.svg',
          name: 'my-keycloak',
          id: 'keycloak_511f6k82-9r44-6w90-86s3-az6m5kvyy478',
          zone: {
            type: 'loaded',
            ...ZONE,
          },
          logsUrl: 'https://example.com/logs',
          openLinks: [
            {
              url: 'https://example.com/logs',
              name: `Keycloak`,
            },
          ],
          actions: {
            restart: true,
            rebuildAndRestart: true,
          },
          productStatus: 'Beta',
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
          providerName: 'Keycloak',
          providerLogoUrl: 'https://cc-keycloak.cellar-c2.services.clever-cloud.com/keycloak_logo.svg',
          name: 'my-keycloak',
          id: 'keycloak_511f6k82-9r44-6w90-86s3-az6m5kvyy478',
          zone: {
            type: 'loaded',
            ...ZONE,
          },
          logsUrl: 'https://example.com/logs',
          openLinks: [
            {
              url: 'https://example.com/logs',
              name: `Keycloak`,
            },
          ],
          actions: {
            restart: true,
            rebuildAndRestart: true,
          },
          productStatus: 'Beta',
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
