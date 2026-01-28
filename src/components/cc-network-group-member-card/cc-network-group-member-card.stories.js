import { makeStory } from '../../stories/lib/make-story.js';
import { memberWithPeers, memberWithoutPeers, memberWithoutDashboardUrl } from '../../stories/fixtures/network-groups.js';
import './cc-network-group-member-card.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Network Group/<cc-network-group-member-card>',
  component: 'cc-network-group-member-card',
};

/**
 * @typedef {import('./cc-network-group-member-card.js').CcNetworkGroupMemberCard} CcNetworkGroupMemberCard
 */

const conf = {
  component: 'cc-network-group-member-card',
};

export const defaultStory = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupMemberCard>[]} */
  items: [
    {
      member: memberWithPeers,
      open: true,
    },
  ],
});

export const withPeersCollapsed = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupMemberCard>[]} */
  items: [
    {
      member: memberWithPeers,
      open: false,
    },
  ],
});

export const withoutPeers = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupMemberCard>[]} */
  items: [
    {
      member: memberWithoutPeers,
    },
  ],
});

export const withoutDashboardUrl = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupMemberCard>[]} */
  items: [
    {
      member: memberWithoutDashboardUrl,
    },
  ],
});

export const unlinking = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupMemberCard>[]} */
  items: [
    {
      member: memberWithPeers,
      isUnlinking: true,
      open: true,
    },
  ],
});

export const disabled = makeStory(conf, {
  docs: 'The card is disabled when another member is being unlinked.',
  /** @type {Partial<CcNetworkGroupMemberCard>[]} */
  items: [
    {
      member: memberWithPeers,
      isDisabled: true,
      open: true,
    },
  ],
});

export const multipleCards = makeStory(conf, {
  docs: 'Multiple cards to show how they look in a list context.',
  /** @type {Partial<CcNetworkGroupMemberCard>[]} */
  items: [
    {
      member: memberWithPeers,
      open: true,
    },
    {
      member: memberWithoutPeers,
    },
    {
      member: {
        ...memberWithPeers,
        id: 'app_another',
        label: 'Another application with peers',
      },
      open: false,
    },
  ],
});
