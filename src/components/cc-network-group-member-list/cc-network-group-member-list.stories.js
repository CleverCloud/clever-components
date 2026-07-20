import {
  memberDeletedAddon,
  memberDeletedApp,
  networkGroupMemberList,
  sampleSelectOptions,
} from '../../stories/fixtures/network-groups.js';
import { makeStory } from '../../stories/lib/make-story.js';
import './cc-network-group-member-list.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Network Group/<cc-network-group-member-list>',
  component: 'cc-network-group-member-list',
};

/**
 * @import { CcNetworkGroupMemberList } from './cc-network-group-member-list.js'
 * @import { CcNetworkGroupMemberCard } from '../cc-network-group-member-card/cc-network-group-member-card.js'
 */

const conf = {
  component: 'cc-network-group-member-list',
};

const networkGroupId = 'ng_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
const ownerId = 'orga_XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX';

export const defaultStory = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupMemberList>[]} */
  items: [
    {
      networkGroupId,
      ownerId,
      memberListState: {
        type: 'loaded',
        memberList: networkGroupMemberList,
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
      networkGroupId,
      ownerId,
      memberListState: { type: 'loading' },
      linkFormState: { type: 'loading' },
    },
  ],
});

export const loadingWithLinkForm = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupMemberList>[]} */
  items: [
    {
      networkGroupId,
      ownerId,
      memberListState: {
        type: 'loaded',
        memberList: networkGroupMemberList,
      },
      linkFormState: { type: 'loading' },
    },
  ],
});

export const error = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupMemberList>[]} */
  items: [
    {
      networkGroupId,
      ownerId,
      memberListState: { type: 'error' },
      linkFormState: { type: 'error' },
    },
  ],
});

export const dataLoadedWithNoMembers = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupMemberList>[]} */
  items: [
    {
      networkGroupId,
      ownerId,
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

export const dataLoadedWithLinkFormEmpty = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupMemberList>[]} */
  items: [
    {
      networkGroupId,
      ownerId,
      memberListState: {
        type: 'loaded',
        memberList: networkGroupMemberList,
      },
      linkFormState: {
        type: 'idle',
        selectOptions: [],
      },
    },
  ],
});

export const dataLoadedWithDeletedMembers = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupMemberList>[]} */
  items: [
    {
      networkGroupId,
      ownerId,
      memberListState: {
        type: 'loaded',
        memberList: [...networkGroupMemberList, memberDeletedApp, memberDeletedAddon],
      },
      linkFormState: {
        type: 'idle',
        selectOptions: sampleSelectOptions,
      },
    },
  ],
});

export const waitingWithLinkFormLinking = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupMemberList>[]} */
  items: [
    {
      networkGroupId,
      ownerId,
      memberListState: {
        type: 'loaded',
        memberList: networkGroupMemberList,
      },
      linkFormState: {
        type: 'linking',
        selectOptions: sampleSelectOptions,
      },
    },
  ],
});

export const waitingWithMemberListUnlinking = makeStory(conf, {
  docs: 'Shows the state when a member is being unlinked. The dialog is open with a waiting state, the targeted member shows a waiting state on its unlink button, while other members are disabled.',
  /** @type {Partial<CcNetworkGroupMemberList>[]} */
  items: [
    {
      networkGroupId,
      ownerId,
      memberListState: {
        type: 'loaded',
        memberList: networkGroupMemberList,
      },
      linkFormState: {
        type: 'idle',
        selectOptions: sampleSelectOptions,
      },
    },
  ],
  /** @param {CcNetworkGroupMemberList} component */
  onUpdateComplete: (component) => {
    /** @type {CcNetworkGroupMemberCard} */
    const memberCard = component.shadowRoot.querySelector('cc-network-group-member-card');
    memberCard.updateComplete.then(() => {
      // Click the unlink button to open the dialog
      const unlinkCcButton = memberCard.shadowRoot.querySelector('.unlink-btn');
      unlinkCcButton.shadowRoot.querySelector('button').click();
      // Then switch to unlinking state to show the waiting spinner
      component.memberListState = {
        type: 'unlinking',
        memberList: networkGroupMemberList,
      };
    });
  },
});
