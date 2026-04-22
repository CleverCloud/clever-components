import { linkedNetworkGroupList, networkGroupSelectOptions } from '../../stories/fixtures/network-groups.js';
import { makeStory } from '../../stories/lib/make-story.js';
import './cc-network-group-list.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Network Group/<cc-network-group-list>',
  component: 'cc-network-group-list',
};

/**
 * @import { CcNetworkGroupList } from './cc-network-group-list.js'
 * @import { NetworkGroupListStateLoaded } from './cc-network-group-list.types.js';
 */

const RESOURCE_ID = 'app_XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX';

const conf = {
  component: 'cc-network-group-list',
};

export const defaultStory = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupList>[]} */
  items: [
    {
      resourceId: RESOURCE_ID,
      state: {
        type: 'loaded',
        linkFormState: {
          type: 'idle',
          selectOptions: networkGroupSelectOptions,
        },
        listState: {
          type: 'loaded',
          linkedNetworkGroupList,
        },
      },
    },
  ],
});

export const dataLoadedWithEmpty = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupList>[]} */
  items: [
    {
      resourceId: RESOURCE_ID,
      state: {
        type: 'loaded',
        linkFormState: {
          type: 'idle',
          selectOptions: networkGroupSelectOptions,
        },
        listState: {
          type: 'loaded',
          linkedNetworkGroupList: [],
        },
      },
    },
  ],
});

export const dataLoadedWithNoNetworkGroupToLink = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupList>[]} */
  items: [
    {
      resourceId: RESOURCE_ID,
      state: {
        type: 'loaded',
        linkFormState: {
          type: 'empty',
          networkGroupDashboardUrl: '/network-groups/new',
        },
        listState: {
          type: 'loaded',
          linkedNetworkGroupList: [],
        },
      },
    },
  ],
});

export const loading = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupList>[]} */
  items: [
    {
      resourceId: RESOURCE_ID,
      state: { type: 'loading' },
    },
  ],
});

export const error = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupList>[]} */
  items: [
    {
      resourceId: RESOURCE_ID,
      state: { type: 'error' },
    },
  ],
});

export const unsupported = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupList>[]} */
  items: [
    {
      resourceId: RESOURCE_ID,
      state: {
        type: 'unsupported',
        addonMigrationScreenUrl: '/addons/migrate',
      },
    },
  ],
});

export const waitingWithLinking = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupList>[]} */
  items: [
    {
      resourceId: RESOURCE_ID,
      state: {
        type: 'loaded',
        linkFormState: {
          type: 'linking',
          selectOptions: networkGroupSelectOptions,
        },
        listState: {
          type: 'loaded',
          linkedNetworkGroupList,
        },
      },
    },
  ],
});

export const waitingWithUnlinking = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupList>[]} */
  items: [
    {
      resourceId: RESOURCE_ID,
      state: {
        type: 'loaded',
        linkFormState: {
          type: 'idle',
          selectOptions: networkGroupSelectOptions,
        },
        listState: {
          type: 'loaded',
          linkedNetworkGroupList,
        },
      },
    },
  ],
  /** @param {CcNetworkGroupList & { state: NetworkGroupListStateLoaded }} component */
  onUpdateComplete(component) {
    const ccButton = component.shadowRoot.querySelector('cc-button.unlink-btn');
    ccButton.shadowRoot.querySelector('button').click();
    component.state = /** @type {NetworkGroupListStateLoaded} */ {
      ...component.state,
      listState: {
        ...component.state.listState,
        type: 'unlinking',
      },
    };
  },
});
