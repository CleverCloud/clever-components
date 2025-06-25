import { ZONE } from '../../stories/fixtures/zones.js';
import { makeStory } from '../../stories/lib/make-story.js';
import './cc-header-addon-beta.js';

/**
 * @typedef {import('./cc-header-addon-beta.types.js').CcHeaderAddonBetaStateLoaded} CcHeaderAddonBetaStateLoaded
 * @typedef {import('./cc-header-addon-beta.types.js').CcHeaderAddonBetaStateError} CcHeaderAddonBetaStateError
 * @typedef {import('./cc-header-addon-beta.types.js').CcHeaderAddonBetaStateLoading} CcHeaderAddonBetaStateLoading
 *
 */

/** @type {CcHeaderAddonBetaStateLoaded} */
const matomoData = {
  type: 'loaded',
  providerName: 'Matomo Analytics',
  providerLogoUrl: 'https://assets.clever-cloud.com/logos/matomo.svg',
  name: 'my-matomo',
  id: 'addon_14234569',
  zone: ZONE,
  logsUrl: 'https://example.com',
  openLinks: [
    {
      url: 'https://example.com',
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
  id: 'addon_665123365',
  zone: ZONE,
  logsUrl: 'https://example.com',
  openLinks: [
    {
      url: 'https://example.com',
      name: `Keycloak`,
    },
  ],
  actions: {
    restart: true,
    rebuildAndRestart: true,
  },
};

/** @type {CcHeaderAddonBetaStateLoaded} */
const jenkinsData = {
  type: 'loaded',
  providerName: 'Jenkins',
  providerLogoUrl: 'https://assets.clever-cloud.com/logos/jenkins.svg',
  name: 'my-jenkins',
  id: 'addon_22354884',
  zone: ZONE,
  logsUrl: 'https://example.com',
  openLinks: [
    {
      url: 'https://example.com',
      name: `Jenkins`,
    },
  ],
  actions: {
    restart: false,
    rebuildAndRestart: false,
  },
};

/*
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
}; */
/*
/!** @type {CcHeaderAddonBetaStateLoaded} *!/
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
}; */
/*
/!** @type {CcHeaderAddonBetaStateLoaded} *!/
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
}; */

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

/* export const materiaDataLoadedStory = makeStory(conf, {
  items: [
    {
      /!** @type {CcHeaderAddonBetaStateLoaded} *!/
      state: {
        ...materiaData,
      },
      addonHref: 'http://example.com',
      logsHref: 'http://example.com',
    },
  ],
}); */

/* export const elasticDataLoadedStory = makeStory(conf, {
  items: [
    {
      /!** @type {CcHeaderAddonBetaStateLoaded} *!/
      state: {
        ...elasticData,
      },
      addonHref: 'http://example.com',
      logsHref: 'http://example.com',
    },
  ],
}); */

/* export const configDataLoadedStory = makeStory(conf, {
  items: [
    {
      /!** @type {CcHeaderAddonBetaStateLoaded} *!/
      state: {
        ...configData,
      },
      addonHref: 'http://example.com',
      logsHref: 'http://example.com',
    },
  ],
}); */

export const loadingStory = makeStory(conf, {
  items: [
    {
      /** @type {CcHeaderAddonBetaStateLoading} */
      state: {
        type: 'loading',
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
