import { makeStory } from '../../stories/lib/make-story.js';
import { networkGroupMembers, sampleSelectOptions } from '../../stories/fixtures/network-groups.js';
import './cc-network-group-member-list.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Network Group/<cc-network-group-member-list>',
  component: 'cc-network-group-member-list',
};

/**
 * @typedef {import('./cc-network-group-member-list.js').CcNetworkGroupMemberList} CcNetworkGroupMemberList
 */

const conf = {
  component: 'cc-network-group-member-list',
};

export const defaultStory = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupMemberList>[]} */
  items: [
    {
      memberListState: {
        type: 'loaded',
        memberList: networkGroupMembers,
      },
      linkFormState: {
        type: 'idle',
        selectOptions: sampleSelectOptions,
      },
    },
  ],
});

export const loading = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupMemberList>[]} */
  items: [
    {
      memberListState: { type: 'loading' },
      linkFormState: { type: 'loading' },
    },
  ],
});

export const error = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupMemberList>[]} */
  items: [
    {
      memberListState: { type: 'error' },
      linkFormState: { type: 'error' },
    },
  ],
});

export const dataLoadedWithNoMembers = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupMemberList>[]} */
  items: [
    {
      memberListState: {
        type: 'loaded',
        memberList: [],
      },
      linkFormState: {
        type: 'idle',
        selectOptions: sampleSelectOptions,
      },
    },
  ],
});

export const linkFormLoading = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupMemberList>[]} */
  items: [
    {
      memberListState: {
        type: 'loaded',
        memberList: networkGroupMembers,
      },
      linkFormState: { type: 'loading' },
    },
  ],
});

export const linkFormLinking = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupMemberList>[]} */
  items: [
    {
      memberListState: {
        type: 'loaded',
        memberList: networkGroupMembers,
      },
      linkFormState: {
        type: 'linking',
        selectOptions: sampleSelectOptions,
      },
    },
  ],
});

export const linkFormEmpty = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupMemberList>[]} */
  items: [
    {
      memberListState: {
        type: 'loaded',
        memberList: networkGroupMembers,
      },
      linkFormState: {
        type: 'idle',
        selectOptions: [],
      },
    },
  ],
});
