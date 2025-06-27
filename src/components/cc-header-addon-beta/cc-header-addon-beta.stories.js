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
  provider: {
    name: 'Matomo Analytics',
    logoUrl: 'https://cc-keycloak.cellar-c2.services.clever-cloud.com/keycloak_logo.svg',
  },
  plan: {
    name: '',
  },
  region: 'par',
  creationDate: 0,
};

/** @type {CcHeaderAddonBetaStateLoaded} */
const jenkinsData = {
  type: 'loaded',
  id: 'addon_22354884',
  realId: 'jenkins_22354884',
  name: 'Jenkins',
  provider: {
    name: 'Jenkins',
    logoUrl: 'https://assets.clever-cloud.com/logos/jenkins.svg',
  },
  plan: {
    name: '',
  },
  region: 'par',
  creationDate: 0,
};

/** @type {CcHeaderAddonBetaStateLoaded} */
const materiaData = {
  type: 'loaded',
  id: 'addon_9874221',
  realId: 'materia_9874221',
  name: 'Materia',
  provider: {
    name: 'Materia KV',
    logoUrl: 'https://assets.clever-cloud.com/logos/materia-db-kv.png',
  },
  plan: {
    name: '',
  },
  region: 'par',
  creationDate: 0,
};

/** @type {CcHeaderAddonBetaStateLoaded} */
const elasticData = {
  type: 'loaded',
  id: 'addon_5541236',
  realId: 'elastic_5541236',
  name: 'Elastic',
  provider: {
    name: 'Elastic Stack',
    logoUrl: 'https://assets.clever-cloud.com/logos/elastic.svg',
  },
  plan: {
    name: '',
  },
  region: 'par',
  creationDate: 0,
};

/** @type {CcHeaderAddonBetaStateLoaded} */
const configData = {
  type: 'loaded',
  id: 'addon_1452154',
  realId: 'config_1452154',
  name: 'Elastic',
  provider: {
    name: 'Configuration provider',
    logoUrl: 'https://assets.clever-cloud.com/logos/configprovider.svg',
  },
  plan: {
    name: '',
  },
  region: 'par',
  creationDate: 0,
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
    },
  ],
});

export const materiaDataLoadedStory = makeStory(conf, {
  items: [
    {
      /** @type {CcHeaderAddonBetaStateLoaded} */
      state: {
        ...materiaData,
      },
      addonHref: 'http://example.com',
      logsHref: 'http://example.com',
    },
  ],
});

export const elasticDataLoadedStory = makeStory(conf, {
  items: [
    {
      /** @type {CcHeaderAddonBetaStateLoaded} */
      state: {
        ...elasticData,
      },
      addonHref: 'http://example.com',
      logsHref: 'http://example.com',
    },
  ],
});

export const configDataLoadedStory = makeStory(conf, {
  items: [
    {
      /** @type {CcHeaderAddonBetaStateLoaded} */
      state: {
        ...configData,
      },
      addonHref: 'http://example.com',
      logsHref: 'http://example.com',
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
