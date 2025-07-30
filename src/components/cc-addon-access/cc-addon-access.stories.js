import { BASE_ADDON_ACCESS_ITEMS } from '../../stories/fixtures/addon-access-data.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import './cc-addon-access.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Addon/<cc-addon-access>',
  component: 'cc-addon-access',
};

const conf = {
  component: 'cc-addon-access',
};

/**
 * @typedef {import('./cc-addon-access.js').CcAddonAccess} CcAddonAccess
 * @typedef {import('../cc-addon-access-content/cc-addon-access-content.types.js').AddonAccessContentItemCode} AddonAccessContentItemCode
 * @typedef {import('../cc-addon-access-content/cc-addon-access-content.types.js').AddonAccessContentItemNg} AddonAccessContentItemNg
 */

/**
 * Helper to filter items from the base fixture based on their codes.
 * @param {Array<AddonAccessContentItemCode|AddonAccessContentItemNg['code']>} codes
 * @returns {import('../cc-addon-access-content/cc-addon-access-content.types.js').AddonAccessContentItem[]}
 */
const getFilteredAddonAccessItems = (codes) => {
  return BASE_ADDON_ACCESS_ITEMS.filter((item) => codes.includes(item.code));
};

export const defaultStory = makeStory(conf, {
  /** @type {Partial<CcAddonAccess>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        tabs: {
          default: getFilteredAddonAccessItems(['user', 'password', 'token', 'ng']),
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
  /** @type {Partial<CcAddonAccess>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        tabs: {
          default: getFilteredAddonAccessItems(['user', 'password', 'token', 'ng']),
          direct: getFilteredAddonAccessItems(['direct-host', 'direct-port', 'direct-uri']),
          api: getFilteredAddonAccessItems([
            'api-client-user',
            'api-client-secret',
            'api-url',
            'api-key',
            'api-password',
          ]),
          elastic: getFilteredAddonAccessItems(['host', 'user', 'password']),
          kibana: getFilteredAddonAccessItems(['user', 'password']),
          apm: getFilteredAddonAccessItems(['user', 'password', 'token']),
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
  /** @type {Partial<CcAddonAccess>[]} */
  items: [
    {
      state: {
        type: 'loading',
        tabs: {
          default: getFilteredAddonAccessItems(['user', 'password', 'token', 'ng']),
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
  /** @type {Partial<CcAddonAccess>[]} */
  items: [
    {
      state: {
        type: 'loading',
        tabs: {
          default: getFilteredAddonAccessItems(['user', 'password', 'token', 'ng']),
          direct: getFilteredAddonAccessItems(['direct-host', 'direct-port', 'direct-uri']),
          api: getFilteredAddonAccessItems([
            'api-client-user',
            'api-client-secret',
            'api-url',
            'api-key',
            'api-password',
          ]),
          elastic: getFilteredAddonAccessItems(['host', 'user', 'password']),
          kibana: getFilteredAddonAccessItems(['user', 'password']),
          apm: getFilteredAddonAccessItems(['user', 'password', 'token']),
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
  /** @type {Partial<CcAddonAccess>[]} */
  items: [
    {
      state: {
        type: 'loading',
        tabs: {
          default: getFilteredAddonAccessItems(['user', 'password', 'token', 'ng']),
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
      /** @param {CcAddonAccess[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          tabs: {
            default: getFilteredAddonAccessItems(['user', 'password', 'token', 'ng']),
          },
        };
      },
    ),
  ],
});

export const simulationsWithTabsAndLoadingSuccess = makeStory(conf, {
  /** @type {Partial<CcAddonAccess>[]} */
  items: [
    {
      state: {
        type: 'loading',
        tabs: {
          elastic: getFilteredAddonAccessItems(['host', 'user', 'password']),
          kibana: getFilteredAddonAccessItems(['user', 'password']),
          apm: getFilteredAddonAccessItems(['user', 'password', 'token']),
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
      /** @param {CcAddonAccess[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          tabs: {
            elastic: getFilteredAddonAccessItems(['host', 'user', 'password']),
            kibana: getFilteredAddonAccessItems(['user', 'password']),
            apm: getFilteredAddonAccessItems(['user', 'password', 'token']),
          },
        };
      },
    ),
  ],
});

export const simulationsWithLoadingError = makeStory(conf, {
  /** @type {Partial<CcAddonAccess>[]} */
  items: [
    {
      state: {
        type: 'loading',
        tabs: {
          default: getFilteredAddonAccessItems(['user', 'password', 'token', 'ng']),
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
      /** @param {CcAddonAccess[]} components */
      ([component]) => {
        component.state = {
          type: 'error',
        };
      },
    ),
  ],
});

export const simulationsWithNetworkGroupStatus = makeStory(conf, {
  /** @type {Partial<CcAddonAccess>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        tabs: {
          default: getFilteredAddonAccessItems(['user', 'ng']),
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
      /** @param {CcAddonAccess[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          tabs: {
            default: [
              { code: 'user', value: 'toto' },
              { code: 'ng', value: { status: 'enabling' } },
            ],
          },
        };
      },
    ),
    storyWait(
      2000,
      /** @param {CcAddonAccess[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          tabs: {
            default: [
              { code: 'user', value: 'toto' },
              { code: 'ng', value: { status: 'enabled', id: 'fake-ng-id-12345' } },
            ],
          },
        };
      },
    ),
    storyWait(
      2000,
      /** @param {CcAddonAccess[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          tabs: {
            default: [
              { code: 'user', value: 'toto' },
              { code: 'ng', value: { status: 'disabling', id: 'fake-ng-id-12345' } },
            ],
          },
        };
      },
    ),
    storyWait(
      2000,
      /** @param {CcAddonAccess[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          tabs: {
            default: [
              { code: 'user', value: 'toto' },
              { code: 'ng', value: { status: 'disabled' } },
            ],
          },
        };
      },
    ),
  ],
});
