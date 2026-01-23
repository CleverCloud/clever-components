import { getAssetUrl } from '../../lib/assets-url.js';
import { makeStory } from '../../stories/lib/make-story.js';
import './cc-network-group-member-card.js';

export default {
  tags: ['autodocs'],
  title: '🛠 NetworkGroups/<cc-network-group-member-card>',
  component: 'cc-network-group-member-card',
};

/**
 * @typedef {import('./cc-network-group-member-card.js').CcNetworkGroupMemberCard} CcNetworkGroupMemberCard
 * @typedef {import('./cc-network-group-member-card.types.js').NetworkGroupMember} NetworkGroupMember
 */

const conf = {
  component: 'cc-network-group-member-card',
};

/** @type {NetworkGroupMember} */
const memberWithPeers = {
  id: 'app_6982c7ae-106e-449f-971e-1a8eb426bd67',
  label: 'app_6982c7ae-106e-449f-971e-1a8eb426bd67',
  domainName: 'app_6982c7ae-106e-449f-971e-1a8eb426bd67.m.ng_b625776f-8d36-495e-9088-02c22ebebf87.cc-ng.cloud',
  logo: {
    url: getAssetUrl('/logos/nodejs.svg'),
    a11yName: 'Node.js',
  },
  kind: 'APPLICATION',
  peerList: [
    {
      id: '166469bd-42ec-46fc-b1be-5f24084c1681',
      label: 'Sturdy helioptile',
      publicKey: 'rVosHhRttfhy+sTrwWvSUhuVCNMoVdDXp+g9amBrSFE=',
      ip: '10.101.0.16',
      type: 'CleverPeer',
    },
    {
      id: '266469bd-42ec-46fc-b1be-5f24084c1682',
      label: 'Swift pikachu',
      publicKey: 'aVosHhRttfhy+sTrwWvSUhuVCNMoVdDXp+g9amBrSFE=',
      ip: '10.101.0.17',
      type: 'CleverPeer',
    },
  ],
  dashboardUrl: 'https://console.clever-cloud.com/app/app_6982c7ae-106e-449f-971e-1a8eb426bd67',
};

/** @type {NetworkGroupMember} */
const memberWithoutPeers = {
  id: 'external_c8916d58-1881-4bc1-a7ca-fc8052629f2c',
  label: 'Parent of flo-nixos',
  domainName: 'external_c8916d58-1881-4bc1-a7ca-fc8052629f2c.m.ng_b625776f-8d36-495e-9088-02c22ebebf87.cc-ng.cloud',
  kind: 'EXTERNAL',
  logo: {
    url: getAssetUrl('/logos/jenkins.svg'),
    a11yName: 'External member',
  },
  peerList: [],
};

/** @type {NetworkGroupMember} */
const memberWithoutDashboardUrl = {
  id: 'external_d8916d58-1881-4bc1-a7ca-fc8052629f2d',
  label: 'External member without dashboard',
  domainName: 'external_d8916d58.m.ng_b625776f.cc-ng.cloud',
  kind: 'EXTERNAL',
  logo: {
    url: getAssetUrl('/logos/jenkins.svg'),
    a11yName: 'External member',
  },
  peerList: [],
};

export const defaultStory = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupMemberCard>[]} */
  items: [
    {
      state: {
        type: 'idle',
        member: memberWithPeers,
      },
      open: true,
    },
  ],
});

export const withPeersCollapsed = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupMemberCard>[]} */
  items: [
    {
      state: {
        type: 'idle',
        member: memberWithPeers,
      },
      open: false,
    },
  ],
});

export const withoutPeers = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupMemberCard>[]} */
  items: [
    {
      state: {
        type: 'idle',
        member: memberWithoutPeers,
      },
    },
  ],
});

export const withoutDashboardUrl = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupMemberCard>[]} */
  items: [
    {
      state: {
        type: 'idle',
        member: memberWithoutDashboardUrl,
      },
    },
  ],
});

export const unlinking = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupMemberCard>[]} */
  items: [
    {
      state: {
        type: 'unlinking',
        member: memberWithPeers,
      },
      open: true,
    },
  ],
});

export const disabled = makeStory(conf, {
  docs: 'The card is disabled when another member is being unlinked.',
  /** @type {Partial<CcNetworkGroupMemberCard>[]} */
  items: [
    {
      state: {
        type: 'idle',
        member: memberWithPeers,
      },
      disabled: true,
      open: true,
    },
  ],
});

export const multipleCards = makeStory(conf, {
  docs: 'Multiple cards to show how they look in a list context.',
  /** @type {Partial<CcNetworkGroupMemberCard>[]} */
  items: [
    {
      state: {
        type: 'idle',
        member: memberWithPeers,
      },
      open: true,
    },
    {
      state: {
        type: 'idle',
        member: memberWithoutPeers,
      },
    },
    {
      state: {
        type: 'idle',
        member: {
          ...memberWithPeers,
          id: 'app_another',
          label: 'Another application with peers',
        },
      },
      open: false,
    },
  ],
});
