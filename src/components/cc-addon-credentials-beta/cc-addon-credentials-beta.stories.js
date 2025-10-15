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
 * @param {Array<AddonCredentialCode|Pick<AddonCredentialNg, 'code' | 'kind'>>} codesOrCredentials
 * @returns {import('../cc-addon-credentials-content/cc-addon-credentials-content.types.js').AddonCredential[]}
 */
const getFilteredAddonCredentials = (codesOrCredentials) => {
  return BASE_ADDON_ACCESS_ITEMS.filter((credential) => {
    if (credential.code === 'ng') {
      return codesOrCredentials.some(
        (codeOrCredential) =>
          typeof codeOrCredential !== 'string' &&
          codeOrCredential.code === 'ng' &&
          codeOrCredential.kind === credential.kind,
      );
    }
    return codesOrCredentials.includes(credential.code);
  });
};

export const defaultStory = makeStory(conf, {
  /** @type {Partial<CcAddonCredentialsBeta>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        tabs: {
          default: {
            content: getFilteredAddonCredentials([
              'user',
              'password',
              'token',
              { code: 'ng', kind: 'standard' },
              { code: 'ng', kind: 'multi-instances' },
            ]),
            docLink: { text: 'Fake Add-on documentation', href: '#' },
          },
        },
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
          default: {
            content: getFilteredAddonCredentials([
              'user',
              'password',
              'token',
              { code: 'ng', kind: 'standard' },
              { code: 'ng', kind: 'multi-instances' },
            ]),
            docLink: { text: 'Fake Add-on documentation', href: '#' },
          },
          direct: {
            content: getFilteredAddonCredentials(['direct-host', 'direct-port', 'direct-uri']),
            docLink: { text: 'Fake Add-on documentation', href: '#' },
          },
          api: {
            content: getFilteredAddonCredentials([
              'api-client-user',
              'api-client-secret',
              'api-url',
              'api-key',
              'api-password',
              'open-api-url',
            ]),
            docLink: { text: 'Fake Add-on documentation', href: '#' },
          },
          elastic: {
            content: getFilteredAddonCredentials(['host', 'user', 'password']),
            docLink: { text: 'Fake Add-on documentation', href: '#' },
          },
          kibana: {
            content: getFilteredAddonCredentials(['user', 'password']),
            docLink: { text: 'Fake Add-on documentation', href: '#' },
          },
          apm: {
            content: getFilteredAddonCredentials(['user', 'password', 'token']),
            docLink: { text: 'Fake Add-on documentation', href: '#' },
          },
        },
      },
    },
  ],
});

export const dataLoadedWithDifferentDocLinksPerTab = makeStory(conf, {
  /** @type {Partial<CcAddonCredentialsBeta>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        tabs: {
          default: {
            content: getFilteredAddonCredentials([
              'user',
              'password',
              'token',
              { code: 'ng', kind: 'standard' },
              { code: 'ng', kind: 'multi-instances' },
            ]),
            docLink: { text: 'Fake Doc Link for default tab', href: '#' },
          },
          direct: {
            content: getFilteredAddonCredentials(['direct-host', 'direct-port', 'direct-uri']),
            docLink: { text: 'Fake Doc Link for direct tab', href: '#' },
          },
          api: {
            content: getFilteredAddonCredentials([
              'api-client-user',
              'api-client-secret',
              'api-url',
              'api-key',
              'api-password',
              'open-api-url',
            ]),
            docLink: { text: 'Fake Doc Link for api tab', href: '#' },
          },
          elastic: {
            content: getFilteredAddonCredentials(['host', 'user', 'password']),
            docLink: { text: 'Fake Doc Link for elastic tab', href: '#' },
          },
          kibana: {
            content: getFilteredAddonCredentials(['user', 'password']),
            docLink: { text: 'Fake Doc Link for kibana tab', href: '#' },
          },
          apm: {
            content: getFilteredAddonCredentials(['user', 'password', 'token']),
            docLink: { text: 'Fake Doc Link for apm tab', href: '#' },
          },
        },
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
          default: {
            content: getFilteredAddonCredentials([
              'user',
              'password',
              'token',
              { code: 'ng', kind: 'standard' },
              { code: 'ng', kind: 'multi-instances' },
            ]),
            docLink: { text: 'Fake Add-on documentation', href: '#' },
          },
        },
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
          default: {
            content: getFilteredAddonCredentials([
              'user',
              'password',
              'token',
              { code: 'ng', kind: 'standard' },
              { code: 'ng', kind: 'multi-instances' },
            ]),
            docLink: { text: 'Fake Add-on documentation', href: '#' },
          },
          direct: {
            content: getFilteredAddonCredentials(['direct-host', 'direct-port', 'direct-uri']),
            docLink: { text: 'Fake Add-on documentation', href: '#' },
          },
          api: {
            content: getFilteredAddonCredentials([
              'api-client-user',
              'api-client-secret',
              'api-url',
              'api-key',
              'api-password',
            ]),
            docLink: { text: 'Fake Add-on documentation', href: '#' },
          },
          elastic: {
            content: getFilteredAddonCredentials(['host', 'user', 'password']),
            docLink: { text: 'Fake Add-on documentation', href: '#' },
          },
          kibana: {
            content: getFilteredAddonCredentials(['user', 'password']),
            docLink: { text: 'Fake Add-on documentation', href: '#' },
          },
          apm: {
            content: getFilteredAddonCredentials(['user', 'password', 'token']),
            docLink: { text: 'Fake Add-on documentation', href: '#' },
          },
        },
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
          default: {
            content: getFilteredAddonCredentials([
              'user',
              'password',
              'token',
              { code: 'ng', kind: 'standard' },
              { code: 'ng', kind: 'multi-instances' },
            ]),
            docLink: { text: 'Fake Add-on documentation', href: '#' },
          },
        },
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
              content: getFilteredAddonCredentials([
                'user',
                'password',
                'token',
                { code: 'ng', kind: 'standard' },
                { code: 'ng', kind: 'multi-instances' },
              ]),
              docLink: { text: 'Fake Add-on documentation', href: '#' },
            },
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
          elastic: {
            content: getFilteredAddonCredentials(['host', 'user', 'password']),
            docLink: { text: 'Fake Add-on documentation', href: '#' },
          },
          kibana: {
            content: getFilteredAddonCredentials(['user', 'password']),
            docLink: { text: 'Fake Add-on documentation', href: '#' },
          },
          apm: {
            content: getFilteredAddonCredentials(['user', 'password', 'token']),
            docLink: { text: 'Fake Add-on documentation', href: '#' },
          },
        },
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
            elastic: {
              content: getFilteredAddonCredentials(['host', 'user', 'password']),
              docLink: { text: 'Fake Add-on documentation', href: '#' },
            },
            kibana: {
              content: getFilteredAddonCredentials(['user', 'password']),
              docLink: { text: 'Fake Add-on documentation', href: '#' },
            },
            apm: {
              content: getFilteredAddonCredentials(['user', 'password', 'token']),
              docLink: { text: 'Fake Add-on documentation', href: '#' },
            },
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
          default: {
            content: getFilteredAddonCredentials([
              'user',
              'password',
              'token',
              { code: 'ng', kind: 'standard' },
              { code: 'ng', kind: 'multi-instances' },
            ]),
            docLink: { text: 'Fake Add-on documentation', href: '#' },
          },
        },
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
          default: {
            content: getFilteredAddonCredentials([
              'user',
              { code: 'ng', kind: 'standard' },
              { code: 'ng', kind: 'multi-instances' },
            ]),
            docLink: { text: 'Fake Add-on documentation', href: '#' },
          },
        },
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
              content: [
                { code: 'user', value: 'toto' },
                { code: 'ng', kind: 'standard', value: { status: 'enabling' } },
                { code: 'ng', kind: 'multi-instances', value: { status: 'enabling' } },
              ],
              docLink: { text: 'Fake Add-on documentation', href: '#' },
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
              content: [
                { code: 'user', value: 'toto' },
                { code: 'ng', kind: 'standard', value: { status: 'enabled', id: 'fake-ng-id-12345' } },
                { code: 'ng', kind: 'multi-instances', value: { status: 'enabled', id: 'fake-ng-id-12346' } },
              ],
              docLink: { text: 'Fake Add-on documentation', href: '#' },
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
              content: [
                { code: 'user', value: 'toto' },
                { code: 'ng', kind: 'standard', value: { status: 'disabling', id: 'fake-ng-id-12345' } },
                { code: 'ng', kind: 'multi-instances', value: { status: 'disabling', id: 'fake-ng-id-12346' } },
              ],
              docLink: { text: 'Fake Add-on documentation', href: '#' },
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
              content: [
                { code: 'user', value: 'toto' },
                { code: 'ng', kind: 'standard', value: { status: 'disabled' } },
                { code: 'ng', kind: 'multi-instances', value: { status: 'disabled' } },
              ],
              docLink: { text: 'Fake Add-on documentation', href: '#' },
            },
          },
        };
      },
    ),
  ],
});
