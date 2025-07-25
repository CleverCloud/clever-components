import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import './cc-addon-access-items.js';

export default {
  tags: ['autodocs'],
  title: '🚧 Beta/🛠 Addon dashboards/<cc-addon-access-items-beta>',
  component: 'cc-addon-access-items-beta',
};

const conf = {
  component: 'cc-addon-access-items-beta',
};

/**
 * @typedef {import('./cc-addon-access-items.js').CcAddonAccessItems} CcAddonAccessItems
 * @typedef {import('./cc-addon-access-items.types.js').AddonAccessItemsNetworkGroupEnabled} AddonAccessItemsNetworkGroupEnabled
 */

/** @type {CcAddonAccessItems['addonAccessItems']} */
const BASE_ITEMS = [
  {
    code: 'user',
    value: 'toto',
  },
  {
    code: 'password',
    value: 'my-secret-password',
  },
  {
    code: 'api-client-user',
    value: 'api-client-toto',
  },
  {
    code: 'api-client-secret',
    value: 'api-client-secret-value',
  },
  {
    code: 'api-url',
    value: 'https://api.example.com',
  },
  {
    code: 'api-key',
    value: 'api-key-value',
  },
  {
    code: 'api-password',
    value: 'api-password-value',
  },
  {
    code: 'initial-password',
    value: 'initial-password-value',
  },
  {
    code: 'host',
    value: 'example.com',
  },
  {
    code: 'port',
    value: '5432',
  },
  {
    code: 'token',
    value: 'token-value',
  },
  {
    code: 'direct-host',
    value: 'direct.example.com',
  },
  {
    code: 'direct-port',
    value: '6543',
  },
  {
    code: 'direct-uri',
    value: 'direct://example.com:6543',
  },
  {
    code: 'database-name',
    value: 'my-database',
  },
  {
    code: 'cluster-full-name',
    value: 'cluster-full-name-value',
  },
  {
    code: 'uri',
    value: 'postgres://user:pass@example.com:5432/my-database',
  },
  {
    code: 'tenant',
    value: 'tenant-value',
  },
  {
    code: 'ng',
    value: {
      status: 'disabled',
    },
  },
];

export const defaultStory = makeStory(conf, {
  /** @type {Partial<CcAddonAccessItems>[]} */
  items: [
    {
      addonAccessItems: BASE_ITEMS,
    },
  ],
});

export const skeleton = makeStory(conf, {
  /** @type {Partial<CcAddonAccessItems>[]} */
  items: [
    {
      addonAccessItems: BASE_ITEMS,
      skeleton: true,
    },
  ],
});

export const dataLoadedWithNetworkGroupEnabled = makeStory(conf, {
  /** @type {Partial<CcAddonAccessItems>[]} */
  items: [
    {
      addonAccessItems: [
        {
          code: 'ng',
          value: { status: 'enabled', id: 'ng-fake-id-038917' },
        },
      ],
    },
  ],
});

export const dataLoadedWithNetworkGroupDisabled = makeStory(conf, {
  /** @type {Partial<CcAddonAccessItems>[]} */
  items: [
    {
      addonAccessItems: [
        {
          code: 'ng',
          value: { status: 'disabled' },
        },
      ],
    },
  ],
});

export const waitingWithEnablingNetworkGroup = makeStory(conf, {
  /** @type {Partial<CcAddonAccessItems>[]} */
  items: [
    {
      addonAccessItems: [
        {
          code: 'ng',
          value: { status: 'enabling' },
        },
      ],
    },
  ],
});

export const waitingWithDisablingNetworkGroup = makeStory(conf, {
  /** @type {Partial<CcAddonAccessItems>[]} */
  items: [
    {
      addonAccessItems: [
        {
          code: 'ng',
          value: { status: 'disabling', id: 'ng-fake-id-038917' },
        },
      ],
    },
  ],
});

export const simulationsWithSkeletonSwitch = makeStory(conf, {
  /** @type {Partial<CcAddonAccessItems>[]} */
  items: [
    {
      addonAccessItems: BASE_ITEMS,
      skeleton: true,
    },
  ],
  simulations: [
    storyWait(
      2000,
      /** @param {CcAddonAccessItems[]} components */
      ([component]) => {
        component.skeleton = false;
      },
    ),
  ],
});

export const simulationsWithEnablingNetworkGroup = makeStory(conf, {
  /** @type {Partial<CcAddonAccessItems>[]} */
  items: [
    {
      addonAccessItems: [{ code: 'ng', value: { status: 'disabled' } }],
      skeleton: true,
    },
  ],
  simulations: [
    storyWait(
      2000,
      /** @param {CcAddonAccessItems[]} components */
      ([component]) => {
        component.skeleton = false;
      },
    ),
    storyWait(
      2000,
      /** @param {CcAddonAccessItems[]} components */
      ([component]) => {
        component.addonAccessItems = [
          {
            code: 'ng',
            value: {
              status: 'enabling',
            },
          },
        ];
      },
    ),
    storyWait(
      2000,
      /** @param {CcAddonAccessItems[]} components */
      ([component]) => {
        component.addonAccessItems = [
          {
            code: 'ng',
            value: {
              status: 'enabled',
              id: 'fake-ng-id-03918',
            },
          },
        ];
      },
    ),
  ],
});

export const simulationsWithDisablingNetworkGroup = makeStory(conf, {
  /** @type {Partial<CcAddonAccessItems>[]} */
  items: [
    {
      addonAccessItems: [{ code: 'ng', value: { status: 'disabled' } }],
      skeleton: true,
    },
  ],
  simulations: [
    storyWait(
      2000,
      /** @param {CcAddonAccessItems[]} components */
      ([component]) => {
        component.skeleton = false;
        component.addonAccessItems = [
          {
            code: 'ng',
            value: {
              status: 'enabled',
              id: 'fake-ng-id-03918',
            },
          },
        ];
      },
    ),
    storyWait(
      2000,
      /** @param {CcAddonAccessItems[]} components */
      ([component]) => {
        const id = /** @type {AddonAccessItemsNetworkGroupEnabled} */ (component.addonAccessItems[0].value).id;
        component.addonAccessItems = [
          {
            code: 'ng',
            value: {
              id,
              status: 'disabling',
            },
          },
        ];
      },
    ),
    storyWait(
      2000,
      /** @param {CcAddonAccessItems[]} components */
      ([component]) => {
        component.addonAccessItems = [
          {
            code: 'ng',
            value: {
              status: 'disabled',
            },
          },
        ];
      },
    ),
  ],
});
