import { BASE_ADDON_ACCESS_ITEMS } from '../../stories/fixtures/addon-access-data.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import './cc-addon-credentials-beta.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Addon/<cc-addon-credentials-beta>',
  component: 'cc-addon-credentials-beta',
};

const conf = {
  component: 'cc-addon-credentials-beta',
};

/**
 * @typedef {import('./cc-addon-credentials-beta.js').CcAddonCredentialsBeta} CcAddonCredentialsBeta
 * @typedef {import('../cc-addon-credentials-content/cc-addon-credentials-content.types.js').AddonCredentialCode} AddonCredentialCode
 * @typedef {import('../cc-addon-credentials-content/cc-addon-credentials-content.types.js').AddonCredentialNg} AddonCredentialNg
 */

/**
 * Helper to filter items from the base fixture based on their codes.
 * @param {Array<AddonCredentialCode|AddonCredentialNg['code']>} codes
 * @returns {import('../cc-addon-credentials-content/cc-addon-credentials-content.types.js').AddonCredential[]}
 */
const getFilteredAddonCredentials = (codes) => {
  return BASE_ADDON_ACCESS_ITEMS.filter((credentials) => codes.includes(credentials.code));
};

export const defaultStory = makeStory(conf, {
  /** @type {Partial<CcAddonCredentialsBeta>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        tabs: {
          default: { credentials: getFilteredAddonCredentials(['user', 'password', 'token', 'ng']) },
        },
      },
      docLink: {
        text: 'Fake Add-on documentation',
        href: '#',
      },
    },
  ],
});

export const dataLoadedWithTabs = makeStory(conf, {
  /** @type {Partial<CcAddonCredentialsBeta>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        tabs: {
          default: { credentials: getFilteredAddonCredentials(['user', 'password', 'token', 'ng']) },
          direct: { credentials: getFilteredAddonCredentials(['direct-host', 'direct-port', 'direct-uri']) },
          api: {
            credentials: getFilteredAddonCredentials([
              'api-client-user',
              'api-client-secret',
              'api-url',
              'api-key',
              'api-password',
            ]),
          },
          elastic: { credentials: getFilteredAddonCredentials(['host', 'user', 'password']) },
          kibana: { credentials: getFilteredAddonCredentials(['user', 'password']) },
          apm: { credentials: getFilteredAddonCredentials(['user', 'password', 'token']) },
        },
      },
      docLink: {
        text: 'Fake Add-on documentation',
        href: '#',
      },
    },
  ],
});

export const dataLoadedWithTabsAndCliCommands = makeStory(conf, {
  /** @type {Partial<CcAddonCredentialsBeta>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        tabs: {
          default: {
            credentials: getFilteredAddonCredentials(['user', 'password', 'token', 'ng']),
            cliContent: [
              'My fake introduction blabla',
              { heading: 'My fake command heading', command: 'clever fake command --app app_fake_id' },
              {
                heading: 'My fake command heading #2',
                command: 'clever fake command another subcommand --app app_fake_id',
              },
              'Another fake intro in the middle',
              {
                heading: 'Another fake command',
                command: 'clever fake command',
              },
            ],
          },
          direct: {
            credentials: getFilteredAddonCredentials(['direct-host', 'direct-port', 'direct-uri']),
            cliContent: [
              'My fake introduction blabla',
              {
                heading: 'My fake command heading specific to Direct Tab',
                command: 'clever fake command --app app_fake_id',
              },
              {
                heading: 'My fake command heading specific to Direct Tab #2',
                command: 'clever fake command another subcommand --app app_fake_id',
              },
            ],
          },
          api: {
            credentials: getFilteredAddonCredentials([
              'api-client-user',
              'api-client-secret',
              'api-url',
              'api-key',
              'api-password',
            ]),
          },
          elastic: { credentials: getFilteredAddonCredentials(['host', 'user', 'password']) },
          kibana: { credentials: getFilteredAddonCredentials(['user', 'password']) },
          apm: { credentials: getFilteredAddonCredentials(['user', 'password', 'token']) },
        },
      },
      docLink: {
        text: 'Fake Add-on documentation',
        href: '#',
      },
    },
  ],
});

export const loading = makeStory(conf, {
  /** @type {Partial<CcAddonCredentialsBeta>[]} */
  items: [
    {
      state: {
        type: 'loading',
        tabs: {
          default: { credentials: getFilteredAddonCredentials(['user', 'password', 'token', 'ng']) },
        },
      },
      docLink: {
        text: 'Fake Add-on documentation',
        href: '#',
      },
    },
  ],
});

export const loadingWithTabs = makeStory(conf, {
  /** @type {Partial<CcAddonCredentialsBeta>[]} */
  items: [
    {
      state: {
        type: 'loading',
        tabs: {
          default: { credentials: getFilteredAddonCredentials(['user', 'password', 'token', 'ng']) },
          direct: { credentials: getFilteredAddonCredentials(['direct-host', 'direct-port', 'direct-uri']) },
          api: {
            credentials: getFilteredAddonCredentials([
              'api-client-user',
              'api-client-secret',
              'api-url',
              'api-key',
              'api-password',
            ]),
          },
          elastic: { credentials: getFilteredAddonCredentials(['host', 'user', 'password']) },
          kibana: { credentials: getFilteredAddonCredentials(['user', 'password']) },
          apm: { credentials: getFilteredAddonCredentials(['user', 'password', 'token']) },
        },
      },
      docLink: {
        text: 'Fake Add-on documentation',
        href: '#',
      },
    },
  ],
});

export const error = makeStory(conf, {
  items: [
    {
      state: { type: 'error' },
      docLink: { text: 'Fake Add-on documentation', href: '#' },
    },
  ],
});

export const simulationWithLoadingSuccess = makeStory(conf, {
  /** @type {Partial<CcAddonCredentialsBeta>[]} */
  items: [
    {
      state: {
        type: 'loading',
        tabs: {
          default: { credentials: getFilteredAddonCredentials(['user', 'password', 'token', 'ng']) },
        },
      },
      docLink: {
        text: 'Fake Add-on documentation',
        href: '#',
      },
    },
  ],
  simulations: [
    storyWait(
      2000,
      /** @param {CcAddonCredentialsBeta[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          tabs: {
            default: { credentials: getFilteredAddonCredentials(['user', 'password', 'token', 'ng']) },
          },
        };
      },
    ),
  ],
});

export const simulationsWithTabsAndLoadingSuccess = makeStory(conf, {
  /** @type {Partial<CcAddonCredentialsBeta>[]} */
  items: [
    {
      state: {
        type: 'loading',
        tabs: {
          elastic: { credentials: getFilteredAddonCredentials(['host', 'user', 'password']) },
          kibana: { credentials: getFilteredAddonCredentials(['user', 'password']) },
          apm: { credentials: getFilteredAddonCredentials(['user', 'password', 'token']) },
        },
      },
      docLink: {
        text: 'Fake Add-on documentation',
        href: '#',
      },
    },
  ],
  simulations: [
    storyWait(
      2000,
      /** @param {CcAddonCredentialsBeta[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          tabs: {
            elastic: { credentials: getFilteredAddonCredentials(['host', 'user', 'password']) },
            kibana: { credentials: getFilteredAddonCredentials(['user', 'password']) },
            apm: { credentials: getFilteredAddonCredentials(['user', 'password', 'token']) },
          },
        };
      },
    ),
  ],
});

export const simulationsWithLoadingError = makeStory(conf, {
  /** @type {Partial<CcAddonCredentialsBeta>[]} */
  items: [
    {
      state: {
        type: 'loading',
        tabs: {
          default: { credentials: getFilteredAddonCredentials(['user', 'password', 'token', 'ng']) },
        },
      },
      docLink: {
        text: 'Fake Add-on documentation',
        href: '#',
      },
    },
  ],
  simulations: [
    storyWait(
      2000,
      /** @param {CcAddonCredentialsBeta[]} components */
      ([component]) => {
        component.state = {
          type: 'error',
        };
      },
    ),
  ],
});

export const simulationsWithNetworkGroupStatus = makeStory(conf, {
  /** @type {Partial<CcAddonCredentialsBeta>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        tabs: {
          default: { credentials: getFilteredAddonCredentials(['user', 'ng']) },
        },
      },
      docLink: {
        text: 'Fake Add-on documentation',
        href: '#',
      },
    },
  ],
  simulations: [
    storyWait(
      2000,
      /** @param {CcAddonCredentialsBeta[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          tabs: {
            default: {
              credentials: [
                { code: 'user', value: 'toto' },
                { code: 'ng', value: { status: 'enabling' } },
              ],
            },
          },
        };
      },
    ),
    storyWait(
      2000,
      /** @param {CcAddonCredentialsBeta[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          tabs: {
            default: {
              credentials: [
                { code: 'user', value: 'toto' },
                { code: 'ng', value: { status: 'enabled', id: 'fake-ng-id-12345' } },
              ],
            },
          },
        };
      },
    ),
    storyWait(
      2000,
      /** @param {CcAddonCredentialsBeta[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          tabs: {
            default: {
              credentials: [
                { code: 'user', value: 'toto' },
                { code: 'ng', value: { status: 'disabling', id: 'fake-ng-id-12345' } },
              ],
            },
          },
        };
      },
    ),
    storyWait(
      2000,
      /** @param {CcAddonCredentialsBeta[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          tabs: {
            default: {
              credentials: [
                { code: 'user', value: 'toto' },
                { code: 'ng', value: { status: 'disabled' } },
              ],
            },
          },
        };
      },
    ),
  ],
});
