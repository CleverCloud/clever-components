import { makeStory } from '../../stories/lib/make-story.js';
import './cc-header-addon-beta.js';

/**
 * @typedef {import('./cc-header-addon-beta.types.js').CcHeaderAddonBetaStateLoaded} CcHeaderAddonBetaStateLoaded
 * @typedef {import('./cc-header-addon-beta.types.js').CcHeaderAddonBetaStateError} CcHeaderAddonBetaStateError
 */

/** @type {CcHeaderAddonBetaStateLoaded} */
const matomoData = {
  type: 'loaded',
  id: 'addon_14234569',
  realId: 'matomo_14234569',
  name: 'my-matomo',
  provider: {
    name: 'Matomo Analytics',
    logoUrl: 'https://assets.clever-cloud.com/logos/matomo.svg',
  },
  plan: {
    name: '',
  },
  region: 'par',
  creationDate: 0,
};

/** @type {CcHeaderAddonBetaStateLoaded} */
const keycloakData = {
  type: 'loaded',
  id: 'addon_665123365',
  realId: 'keycloak_665123365',
  name: 'Keycloak',
  provider: null,
  plan: null,
  creationDate: null,
};

/** @type {CcHeaderAddonBetaStateLoaded} */
const jenkinsData = {
  type: 'loaded',
  id: 'addon_22354884',
  realId: 'jenkins_22354884',
  name: 'Jenkins',
  provider: null,
  plan: null,
  creationDate: null,
};

export default {
  tags: ['autodocs'],
  title: '🚧 Beta/🛠 Addons/<cc-header-addon-beta>',
  component: 'cc-header-addon-beta',
};

const conf = {
  component: 'cc-header-addon-beta',
};

export const defaultStory = makeStory(conf, {});

export const matomoDataLoadedStory = makeStory(conf, {
  items: [
    {
      /** @type {CcHeaderAddonBetaStateLoaded} */
      state: {
        ...matomoData,
      },
      addonHref: 'http://example.com',
      logsHref: 'http://example.com',
    },
  ],
});

export const keycloackDataLoadedStory = makeStory(conf, {
  items: [
    {
      /** @type {CcHeaderAddonBetaStateLoaded} */
      state: {
        ...keycloakData,
      },
      addonHref: 'http://example.com',
      logsHref: 'http://example.com',
      logo: 'https://cc-keycloak.cellar-c2.services.clever-cloud.com/keycloak_logo.svg',
    },
  ],
});

export const jenkinsDataLoadedStory = makeStory(conf, {
  items: [
    {
      /** @type {CcHeaderAddonBetaStateLoaded} */
      state: {
        ...jenkinsData,
      },
      addonHref: 'http://example.com',
      logsHref: 'http://example.com',
      logo: 'https://assets.clever-cloud.com/logos/jenkins.svg',
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
