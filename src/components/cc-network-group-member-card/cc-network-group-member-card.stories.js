import {
  memberAddon,
  memberAddonWithoutPeers,
  memberAppWithoutPeers,
  memberExternalWithoutPeers,
  memberExternalWithPeers,
  memberWithoutDashboardUrl,
  memberWithPeers,
} from '../../stories/fixtures/network-groups.js';
import { makeStory } from '../../stories/lib/make-story.js';
import './cc-network-group-member-card.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Network Group/<cc-network-group-member-card>',
  component: 'cc-network-group-member-card',
};

/** @import { CcNetworkGroupMemberCard } from './cc-network-group-member-card.js' */

const conf = {
  component: 'cc-network-group-member-card',
};

export const defaultStory = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupMemberCard>[]} */
  items: [
    {
      member: memberWithPeers,
      isOpen: true,
    },
  ],
});

export const withPeersCollapsed = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupMemberCard>[]} */
  items: [
    {
      member: memberAddon,
      isOpen: false,
    },
  ],
});

export const applicationWithoutPeers = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupMemberCard>[]} */
  items: [
    {
      member: memberAppWithoutPeers,
    },
  ],
});

export const addonWithoutPeers = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupMemberCard>[]} */
  items: [
    {
      member: memberAddonWithoutPeers,
    },
  ],
});

export const externalWithoutPeers = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupMemberCard>[]} */
  items: [
    {
      member: memberExternalWithoutPeers,
    },
  ],
});

export const externalWithPeers = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupMemberCard>[]} */
  items: [
    {
      member: memberExternalWithPeers,
      isOpen: true,
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
      isOpen: true,
    },
  ],
});

export const disabled = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupMemberCard>[]} */
  items: [
    {
      member: memberWithPeers,
      isDisabled: true,
      isOpen: true,
    },
  ],
});

export const addon = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupMemberCard>[]} */
  items: [
    {
      member: memberAddon,
      isOpen: true,
    },
  ],
});

export const multipleCards = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupMemberCard>[]} */
  items: [
    {
      member: memberWithPeers,
      isOpen: true,
    },
    {
      member: memberAddon,
      isOpen: true,
    },
    {
      member: memberExternalWithPeers,
      isOpen: true,
    },
  ],
});
