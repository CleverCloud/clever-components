import {
  memberAddonWithPeers,
  memberAddonWithoutPeers,
  memberAppWithPeers,
  memberAppWithoutPeers,
  memberExternalWithoutDashboardUrl,
  memberExternalWithoutPeers,
} from '../../stories/fixtures/network-groups.js';
import { makeStory } from '../../stories/lib/make-story.js';
import './cc-network-group-member-card.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Network Group/<cc-network-group-member-card>',
  component: 'cc-network-group-member-card',
};

/**
 * @import { CcNetworkGroupMemberCard } from './cc-network-group-member-card.js'
 */

const conf = {
  component: 'cc-network-group-member-card',
};

export const defaultStory = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupMemberCard>[]} */
  items: [
    {
      member: memberAppWithPeers,
      isOpen: true,
    },
  ],
});

export const withPeersCollapsed = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupMemberCard>[]} */
  items: [
    {
      member: memberAppWithPeers,
      isOpen: false,
    },
  ],
});

export const applicationWithoutPeers = makeStory(conf, {
  docs: 'An application member that has no peers yet.',
  /** @type {Partial<CcNetworkGroupMemberCard>[]} */
  items: [
    {
      member: memberAppWithoutPeers,
    },
  ],
});

export const addonWithoutPeers = makeStory(conf, {
  docs: 'An add-on member that has no peers yet.',
  /** @type {Partial<CcNetworkGroupMemberCard>[]} */
  items: [
    {
      member: memberAddonWithoutPeers,
    },
  ],
});

export const externalWithoutPeers = makeStory(conf, {
  docs: 'An external member that has no peers yet.',
  /** @type {Partial<CcNetworkGroupMemberCard>[]} */
  items: [
    {
      member: memberExternalWithoutPeers,
    },
  ],
});

export const withoutDashboardUrl = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupMemberCard>[]} */
  items: [
    {
      member: memberExternalWithoutDashboardUrl,
    },
  ],
});

export const unlinking = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupMemberCard>[]} */
  items: [
    {
      member: memberAppWithPeers,
      isUnlinking: true,
      isOpen: true,
    },
  ],
});

export const disabled = makeStory(conf, {
  docs: 'The card is disabled when another member is being unlinked.',
  /** @type {Partial<CcNetworkGroupMemberCard>[]} */
  items: [
    {
      member: memberAppWithPeers,
      isDisabled: true,
      isOpen: true,
    },
  ],
});

export const addon = makeStory(conf, {
  docs: 'An add-on member with a dashboard link showing "Add-on Overview".',
  /** @type {Partial<CcNetworkGroupMemberCard>[]} */
  items: [
    {
      member: memberAddonWithPeers,
      isOpen: true,
    },
  ],
});

export const multipleCards = makeStory(conf, {
  docs: 'Multiple cards to show how they look in a list context with different kinds (application, add-on, external).',
  /** @type {Partial<CcNetworkGroupMemberCard>[]} */
  items: [
    {
      member: memberAppWithPeers,
      isOpen: true,
    },
    {
      member: memberAddonWithPeers,
      isOpen: true,
    },
    {
      member: memberExternalWithoutPeers,
    },
  ],
});
