import { getAssetUrl } from '../../lib/assets-url.js';
import { makeStory } from '../../stories/lib/make-story.js';
import './cc-network-group-linked-resources.js';

export default {
  tags: ['autodocs'],
  title: '🛠 NetworkGroups/<cc-network-group-linked-resources>',
  component: 'cc-network-group-linked-resources',
};

/**
 * @typedef {import('./cc-network-group-linked-resources.js').CcNetworkGroupLinkedResources} CcNetworkGroupLinkedResources
 * @typedef {import('./cc-network-group-linked-resources.types.js').NetworkGroupMember} NetworkGroupMember
 */

const conf = {
  component: 'cc-network-group-linked-resources',
};

/** @type {NetworkGroupMember[]} */
const networkGroupMembers = [
  {
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
        ip: '10.101.0.16', // TODO: CIDR
        type: 'CleverPeer',
      },
      {
        id: '166469bd-42ec-46fc-b1be-5f24084c1681',
        label: 'Sturdy helioptile',
        publicKey: 'rVosHhRttfhy+sTrwWvSUhuVCNMoVdDXp+g9amBrSFE=',
        ip: '10.101.0.17', // TODO: CIDR
        type: 'CleverPeer',
      },
    ],
  },
  {
    id: 'external_c8916d58-1881-4bc1-a7ca-fc8052629f2c',
    label: 'Parent of flo-nixos',
    domainName: 'external_c8916d58-1881-4bc1-a7ca-fc8052629f2c.m.ng_b625776f-8d36-495e-9088-02c22ebebf87.cc-ng.cloud',
    kind: 'EXTERNAL',
    logo: {
      url: getAssetUrl('/logos/jenkins.svg'), // FIXME: we need a logo to represent external members
      a11yName: 'Node.js',
    },
    peerList: [],
  },
  {
    id: 'external_c8916d58-1881-4bc1-a7ca-fc8052629f2c',
    label: 'Parent of flo-nixos',
    domainName: 'external_c8916d58-1881-4bc1-a7ca-fc8052629f2c.m.ng_b625776f-8d36-495e-9088-02c22ebebf87.cc-ng.cloud',
    kind: 'EXTERNAL',
    logo: {
      url: getAssetUrl('/logos/jenkins.svg'), // FIXME: we need a logo to represent external members
      a11yName: 'Node.js',
    },
    peerList: [
      {
        id: '7392f881-1abe-4729-94b7-ebc73342ed31',
        label: 'flo-nixos',
        publicKey: 'ZROGRLla8A5CdzpRcbD+mjWMFqUHMdSt3iCKeLMF4Qw=',
        ip: '10.101.0.20', // TODO: CIDR
        type: 'ExternalPeer',
      },
      {
        id: '7392f881-1abe-4729-94b7-ebc73342ed31',
        label: 'flo-nixos',
        publicKey: 'ZROGRLla8A5CdzpRcbD+mjWMFqUHMdSt3iCKeLMF4Qw=',
        ip: '10.101.0.21', // TODO: CIDR
        type: 'ExternalPeer',
      },
    ],
  },
];

export const defaultStory = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupLinkedResources>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        memberList: networkGroupMembers,
      },
    },
  ],
});

export const loading = makeStory(conf, {
  items: [{ state: { type: 'loading' } }],
});

export const error = makeStory(conf, {
  items: [{ state: { type: 'error' } }],
});

export const dataLoadedWithNoMembers = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupLinkedResources>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        memberList: [],
      },
    },
  ],
});
