import { fakeString } from '../../lib/fake-strings.js';
import { ZONE } from '../../stories/fixtures/zones.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import './cc-header-addon-beta.js';

/**
 * @typedef {import('./cc-header-addon-beta.types.js').CcHeaderAddonBetaStateLoaded} CcHeaderAddonBetaStateLoaded
 * @typedef {import('./cc-header-addon-beta.types.js').CcHeaderAddonBetaStateError} CcHeaderAddonBetaStateError
 * @typedef {import('./cc-header-addon-beta.types.js').CcHeaderAddonBetaStateLoading} CcHeaderAddonBetaStateLoading
 * @typedef {import('./cc-header-addon-beta.types.js').CcHeaderAddonBetaStateRestarting} CcHeaderAddonBetaStateRestarting
 * @typedef {import('./cc-header-addon-beta.types.js').CcHeaderAddonBetaStateRebuilding} CcHeaderAddonBetaStateRebuilding
 * @typedef {import('./cc-header-addon-beta.js').CcHeaderAddonBeta} CcHeaderAddonBeta
 */

/** @type {CcHeaderAddonBetaStateLoaded} */
const configProviderData = {
  type: 'loaded',
  providerName: 'Configuration provider',
  providerLogoUrl: 'https://assets.clever-cloud.com/logos/configprovider.svg',
  name: 'my-config',
  id: 'config_59xml9zd-f1rg-2jj2-z733-p564812374122',
  zone: ZONE,
};

/** @type {CcHeaderAddonBetaStateLoaded} */
const materiaData = {
  type: 'loaded',
  providerName: 'Materia KV',
  providerLogoUrl: 'https://assets.clever-cloud.com/logos/materia-db-kv.png',
  name: 'my-materia',
  id: 'kv_56ME45ETZMPOF7HR6DCVBN80Q',
  zone: ZONE,
  logsUrl: 'https://example.com/logs',
};

/** @type {CcHeaderAddonBetaStateLoaded} */
const jenkinsData = {
  type: 'loaded',
  providerName: 'Jenkins',
  providerLogoUrl: 'https://assets.clever-cloud.com/logos/jenkins.svg',
  name: 'my-jenkins',
  id: 'jenkins_fgh7evv9-q21m-9129-mm3b-04f77lo56w36',
  zone: ZONE,
  logsUrl: 'https://example.com/logs',
  openLinks: [
    {
      url: 'https://example.com/logs',
      name: `Jenkins`,
    },
  ],
};

/** @type {CcHeaderAddonBetaStateLoaded} */
const elasticData = {
  type: 'loaded',
  providerName: 'Elastic Stack',
  providerLogoUrl: 'https://assets.clever-cloud.com/logos/elastic.svg',
  name: 'my-elastic',
  id: 'elasticsearch_23694507-44yt-023u-ib5o-6vc7d0mp99a2',
  zone: ZONE,
  logsUrl: 'https://example.com/logs',
  openLinks: [
    {
      url: 'https://example.com/logs',
      name: `APM`,
    },
    {
      url: 'https://example.com/logs',
      name: `Kibana`,
    },
  ],
};

/** @type {CcHeaderAddonBetaStateLoaded} */
const matomoData = {
  type: 'loaded',
  providerName: 'Matomo Analytics',
  providerLogoUrl: 'https://assets.clever-cloud.com/logos/matomo.svg',
  name: 'my-matomo',
  id: 'matomo_0985go7t-2kda-6dv2-x978-h63r45o11q6p',
  zone: ZONE,
  logsUrl: 'https://example.com/logs',
  openLinks: [
    {
      url: 'https://example.com/logs',
      name: `Matomo Analytics`,
    },
  ],
  actions: {
    restart: true,
    rebuildAndRestart: true,
  },
};

/** @type {CcHeaderAddonBetaStateLoaded} */
const keycloakData = {
  type: 'loaded',
  providerName: 'Keycloak',
  providerLogoUrl: 'https://cc-keycloak.cellar-c2.services.clever-cloud.com/keycloak_logo.svg',
  name: 'my-keycloak',
  id: 'keycloak_511f6k82-9r44-6w90-86s3-az6m5kvyy478',
  zone: ZONE,
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

export default {
  tags: ['autodocs'],
  title: '🚧 Beta/🛠 Addons/<cc-header-addon-beta>',
  component: 'cc-header-addon-beta',
};

const conf = {
  component: 'cc-header-addon-beta',
};

export const defaultStory = makeStory(conf, {
  items: [
    {
      /** @type {CcHeaderAddonBetaStateLoaded} */
      state: {
        ...configProviderData,
      },
    },
  ],
});

export const basicData = makeStory(conf, {
  items: [
    {
      /** @type {CcHeaderAddonBetaStateLoaded} */
      state: {
        ...configProviderData,
      },
    },
    {
      /** @type {CcHeaderAddonBetaStateLoading} */
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
      /** @type {CcHeaderAddonBetaStateLoaded} */
      state: {
        ...materiaData,
      },
    },
    {
      /** @type {CcHeaderAddonBetaStateLoading} */
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
      /** @type {CcHeaderAddonBetaStateLoaded} */
      state: {
        ...jenkinsData,
      },
    },
    {
      /** @type {CcHeaderAddonBetaStateLoading} */
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
      /** @type {CcHeaderAddonBetaStateLoaded} */
      state: {
        ...elasticData,
      },
    },
    {
      /** @type {CcHeaderAddonBetaStateLoading} */
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
      /** @type {CcHeaderAddonBetaStateLoaded} */
      state: {
        ...matomoData,
      },
    },
    {
      /** @type {CcHeaderAddonBetaStateLoading} */
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
      /** @type {CcHeaderAddonBetaStateLoaded} */
      state: {
        ...keycloakData,
      },
    },
    {
      /** @type {CcHeaderAddonBetaStateLoading} */
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
      /** @type {CcHeaderAddonBetaStateRestarting} */
      state: {
        type: 'restarting',
        providerName: 'Keycloak',
        providerLogoUrl: 'https://cc-keycloak.cellar-c2.services.clever-cloud.com/keycloak_logo.svg',
        name: 'my-keycloak',
        id: 'keycloak_511f6k82-9r44-6w90-86s3-az6m5kvyy478',
        zone: ZONE,
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
      /** @type {CcHeaderAddonBetaStateRebuilding} */
      state: {
        type: 'rebuilding',
        providerName: 'Keycloak',
        providerLogoUrl: 'https://cc-keycloak.cellar-c2.services.clever-cloud.com/keycloak_logo.svg',
        name: 'my-keycloak',
        id: 'keycloak_511f6k82-9r44-6w90-86s3-az6m5kvyy478',
        zone: ZONE,
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
      /** @type {CcHeaderAddonBetaStateError} */
      state: {
        type: 'error',
      },
    },
  ],
});

export const simulationWithLoadingSuccess = makeStory(conf, {
  /** @type {Partial<CcHeaderAddonBeta>[]} */
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
      /** @param {CcHeaderAddonBeta[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          ...keycloakData,
        };
      },
    ),
  ],
});

export const simulationWithLoadingError = makeStory(conf, {
  /** @type {Partial<CcHeaderAddonBeta>[]} */
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
      /** @param {CcHeaderAddonBeta[]} components */
      ([component]) => {
        component.state = {
          type: 'error',
        };
      },
    ),
  ],
});

export const simulationWithRestarting = makeStory(conf, {
  /** @type {Partial<CcHeaderAddonBeta>[]} */
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
      /** @param {CcHeaderAddonBeta[]} components */
      ([component]) => {
        component.state = {
          type: 'restarting',
          providerName: 'Keycloak',
          providerLogoUrl: 'https://cc-keycloak.cellar-c2.services.clever-cloud.com/keycloak_logo.svg',
          name: 'my-keycloak',
          id: 'keycloak_511f6k82-9r44-6w90-86s3-az6m5kvyy478',
          zone: ZONE,
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
      /** @param {CcHeaderAddonBeta[]} components */
      ([component]) => {
        component.state = { type: 'loaded', ...keycloakData };
      },
    ),
  ],
});

export const simulationWithRebuilding = makeStory(conf, {
  /** @type {Partial<CcHeaderAddonBeta>[]} */
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
      /** @param {CcHeaderAddonBeta[]} components */
      ([component]) => {
        component.state = {
          type: 'rebuilding',
          providerName: 'Keycloak',
          providerLogoUrl: 'https://cc-keycloak.cellar-c2.services.clever-cloud.com/keycloak_logo.svg',
          name: 'my-keycloak',
          id: 'keycloak_511f6k82-9r44-6w90-86s3-az6m5kvyy478',
          zone: ZONE,
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
      /** @param {CcHeaderAddonBeta[]} components */
      ([component]) => {
        component.state = { type: 'loaded', ...keycloakData };
      },
    ),
  ],
});
