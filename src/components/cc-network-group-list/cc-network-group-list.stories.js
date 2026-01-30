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
 */

const conf = {
  component: 'cc-network-group-list',
};

export const defaultStory = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupList>[]} */
  items: [
    {
      linkFormState: {
        type: 'idle',
        selectOptions: networkGroupSelectOptions,
      },
      listState: {
        type: 'loaded',
        linkedNetworkGroupList,
      },
    },
  ],
});

export const dataLoadedWithEmpty = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupList>[]} */
  items: [
    {
      linkFormState: {
        type: 'idle',
        selectOptions: networkGroupSelectOptions,
      },
      listState: {
        type: 'loaded',
        linkedNetworkGroupList: [],
      },
    },
  ],
});

export const dataLoadedWithNoNetworkGroupToLink = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupList>[]} */
  items: [
    {
      linkFormState: {
        type: 'idle',
        selectOptions: [],
      },
      listState: {
        type: 'loaded',
        linkedNetworkGroupList: [],
      },
    },
  ],
});

export const loading = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupList>[]} */
  items: [
    {
      linkFormState: { type: 'loading' },
      listState: { type: 'loading' },
    },
  ],
});

export const linkFormLinking = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupList>[]} */
  items: [
    {
      linkFormState: {
        type: 'linking',
        selectOptions: networkGroupSelectOptions,
      },
      listState: {
        type: 'loaded',
        linkedNetworkGroupList,
      },
    },
  ],
});

export const error = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupList>[]} */
  items: [
    {
      linkFormState: { type: 'error' },
      listState: { type: 'error' },
    },
  ],
});
