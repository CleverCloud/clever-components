import { BASE_ADDON_ACCESS_ITEMS } from '../../stories/fixtures/addon-access-data.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import './cc-addon-credentials-content.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Addon/<cc-addon-credentials-content>',
  component: 'cc-addon-credentials-content',
};

const conf = {
  component: 'cc-addon-credentials-content',
};

/**
 * @typedef {import('./cc-addon-credentials-content.js').CcAddonCredentialsContent} CcAddonCredentialsItems
 * @typedef {import('./cc-addon-credentials-content.types.js').AddonCredentialNgEnabled} AddonCredentialsItemsNetworkGroupEnabled
 */

export const defaultStory = makeStory(conf, {
  /** @type {Partial<CcAddonCredentialsItems>[]} */
  items: [
    {
      credentials: BASE_ADDON_ACCESS_ITEMS,
    },
  ],
});

export const skeleton = makeStory(conf, {
  /** @type {Partial<CcAddonCredentialsItems>[]} */
  items: [
    {
      credentials: BASE_ADDON_ACCESS_ITEMS,
      skeleton: true,
    },
  ],
});

export const dataLoadedWithNetworkGroupEnabled = makeStory(conf, {
  /** @type {Partial<CcAddonCredentialsItems>[]} */
  items: [
    {
      credentials: [
        {
          code: 'ng',
          value: { status: 'enabled', id: 'ng-fake-id-038917' },
        },
      ],
    },
  ],
});

export const dataLoadedWithNetworkGroupDisabled = makeStory(conf, {
  /** @type {Partial<CcAddonCredentialsItems>[]} */
  items: [
    {
      credentials: [
        {
          code: 'ng',
          value: { status: 'disabled' },
        },
      ],
    },
  ],
});

export const waitingWithEnablingNetworkGroup = makeStory(conf, {
  /** @type {Partial<CcAddonCredentialsItems>[]} */
  items: [
    {
      credentials: [
        {
          code: 'ng',
          value: { status: 'enabling' },
        },
      ],
    },
  ],
});

export const waitingWithDisablingNetworkGroup = makeStory(conf, {
  /** @type {Partial<CcAddonCredentialsItems>[]} */
  items: [
    {
      credentials: [
        {
          code: 'ng',
          value: { status: 'disabling', id: 'ng-fake-id-038917' },
        },
      ],
    },
  ],
});

export const simulationsWithSkeletonSwitch = makeStory(conf, {
  /** @type {Partial<CcAddonCredentialsItems>[]} */
  items: [
    {
      credentials: BASE_ADDON_ACCESS_ITEMS,
      skeleton: true,
    },
  ],
  simulations: [
    storyWait(
      2000,
      /** @param {CcAddonCredentialsItems[]} components */
      ([component]) => {
        component.skeleton = false;
      },
    ),
  ],
});

export const simulationsWithEnablingNetworkGroup = makeStory(conf, {
  /** @type {Partial<CcAddonCredentialsItems>[]} */
  items: [
    {
      credentials: [{ code: 'ng', value: { status: 'disabled' } }],
      skeleton: true,
    },
  ],
  simulations: [
    storyWait(
      2000,
      /** @param {CcAddonCredentialsItems[]} components */
      ([component]) => {
        component.skeleton = false;
      },
    ),
    storyWait(
      2000,
      /** @param {CcAddonCredentialsItems[]} components */
      ([component]) => {
        component.credentials = [
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
      /** @param {CcAddonCredentialsItems[]} components */
      ([component]) => {
        component.credentials = [
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
  /** @type {Partial<CcAddonCredentialsItems>[]} */
  items: [
    {
      credentials: [{ code: 'ng', value: { status: 'disabled' } }],
      skeleton: true,
    },
  ],
  simulations: [
    storyWait(
      2000,
      /** @param {CcAddonCredentialsItems[]} components */
      ([component]) => {
        component.skeleton = false;
        component.credentials = [
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
      /** @param {CcAddonCredentialsItems[]} components */
      ([component]) => {
        const id = /** @type {AddonCredentialsItemsNetworkGroupEnabled} */ (component.credentials[0].value).id;
        component.credentials = [
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
      /** @param {CcAddonCredentialsItems[]} components */
      ([component]) => {
        component.credentials = [
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
