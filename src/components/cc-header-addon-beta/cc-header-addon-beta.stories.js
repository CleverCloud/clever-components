import { makeStory } from '../../stories/lib/make-story.js';
import './cc-header-addon-beta.js';

/**
 * @typedef {import('./cc-header-addon-beta.types.js').CcHeaderAddonBetaStateLoaded} CcHeaderAddonBetaStateLoaded
 */

/** @type {CcHeaderAddonBetaStateLoaded} */
const matomoData = {
  type: 'loaded',
  addonHref: 'http://example.com',
  logsHref: 'http://example.com',
  zone: 'Paris',
  id: 'matomo_14234569',
  logo: 'https://assets.clever-cloud.com/logos/matomo.svg',
  name: 'Matomo',
};

/** @type {CcHeaderAddonBetaStateLoaded} */
const keycloakData = {
  type: 'loaded',
  addonHref: 'http://example.com',
  logsHref: 'http://example.com',
  zone: 'Roubaix',
  id: 'keycloak_14234569',
  logo: 'https://cc-keycloak.cellar-c2.services.clever-cloud.com/keycloak_logo.svg',
  name: 'Keycloak',
};

/** @type {CcHeaderAddonBetaStateLoaded} */
const jenkinsData = {
  type: 'loaded',
  addonHref: 'http://example.com',
  logsHref: 'http://example.com',
  zone: 'Lille',
  id: 'jenkins_14234569',
  logo: 'https://assets.clever-cloud.com/logos/jenkins.svg',
  name: 'Jenkins',
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
      /*  innerHTML: `
      <dd slot="restart"><a href="http://example.com">Restart</a></dd>
      <dd slot="rebuild"><a href="http://example.com">Re-built and restart</a></dd>
      `, */
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
      /* innerHTML: `
      <dd slot="restart"><a href="http://example.com">Restart</a></dd>
      <dd slot="rebuild"><a href="http://example.com">Re-built and restart</a></dd>
      `, */
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
    },
  ],
});
