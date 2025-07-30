import { BASE_ADDON_ACCESS_ITEMS } from '../../stories/fixtures/addon-access-data.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import './cc-addon-access-content.js';

export default {
  tags: ['autodocs'],
  title: '🚧 Beta/🛠 Addon dashboards/<cc-addon-access-content-beta>',
  component: 'cc-addon-access-content-beta',
};

const conf = {
  component: 'cc-addon-access-content-beta',
};

/**
 * @typedef {import('./cc-addon-access-content.js').CcAddonAccessContent} CcAddonAccessItems
 * @typedef {import('./cc-addon-access-content.types.js').AddonAccessContentItemNgEnabled} AddonAccessItemsNetworkGroupEnabled
 */

export const defaultStory = makeStory(conf, {
  /** @type {Partial<CcAddonAccessItems>[]} */
  items: [
    {
      contentItems: BASE_ADDON_ACCESS_ITEMS,
    },
  ],
});

export const skeleton = makeStory(conf, {
  /** @type {Partial<CcAddonAccessItems>[]} */
  items: [
    {
      contentItems: BASE_ADDON_ACCESS_ITEMS,
      skeleton: true,
    },
  ],
});

export const dataLoadedWithNetworkGroupEnabled = makeStory(conf, {
  /** @type {Partial<CcAddonAccessItems>[]} */
  items: [
    {
      contentItems: [
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
      contentItems: [
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
      contentItems: [
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
      contentItems: [
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
      contentItems: BASE_ADDON_ACCESS_ITEMS,
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
      contentItems: [{ code: 'ng', value: { status: 'disabled' } }],
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
        component.contentItems = [
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
        component.contentItems = [
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
      contentItems: [{ code: 'ng', value: { status: 'disabled' } }],
      skeleton: true,
    },
  ],
  simulations: [
    storyWait(
      2000,
      /** @param {CcAddonAccessItems[]} components */
      ([component]) => {
        component.skeleton = false;
        component.contentItems = [
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
        const id = /** @type {AddonAccessItemsNetworkGroupEnabled} */ (component.contentItems[0].value).id;
        component.contentItems = [
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
        component.contentItems = [
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
