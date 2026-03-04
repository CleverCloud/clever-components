import { getAssetUrl } from '../../lib/assets-url.js';

/**
 * @import { NetworkGroupMember } from '../../components/cc-network-group-member-card/cc-network-group-member-card.types.js'
 * @import { NetworkGroupPeerExternal, NetworkGroupPeerClever } from '../../components/cc-network-group-peer-card/cc-network-group-peer-card.types.js'
 * @import { Option } from '../../components/cc-select/cc-select.types.js'
 */

/** @type {NetworkGroupPeerExternal} */
export const networkGroupExternalPeerWithConfigLink = {
  id: 'f6g7h8i9-6666-7777-8888-999900001111',
  label: 'Silent lynx',
  publicKey: '0987654321abcdefABCDEFghijklmnopqrstuvwx=',
  ip: '10.101.0.30',
  type: 'ExternalPeer',
  configLink: 'https://example.com/',
};

/** @type {NetworkGroupPeerClever} */
export const networkGroupCleverPeer = {
  id: 'a1b2c3d4-1111-2222-3333-444455556666',
  label: 'Swift fox',
  publicKey: 'aBcDeFgHiJkLmNoPqRsTuVwXyZ0123456789abcd=',
  ip: '10.101.0.10',
  type: 'CleverPeer',
};

/** @type {NetworkGroupMember[]} */
export const networkGroupMembers = [
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
    dashboardUrl: '/organisations/orga_XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/applications/app_6982c7ae-106e-449f-971e-1a8eb426bd67',
  },
  {
    id: 'addon_12345678-1234-1234-1234-123456789abc',
    label: 'PostgreSQL Production',
    domainName: 'addon_12345678-1234-1234-1234-123456789abc.m.ng_b625776f-8d36-495e-9088-02c22ebebf87.cc-ng.cloud',
    logo: {
      url: getAssetUrl('/logos/pgsql.svg'),
      a11yName: 'PostgreSQL',
    },
    kind: 'ADDON',
    peerList: [
      {
        id: '366469bd-42ec-46fc-b1be-5f24084c1683',
        label: 'Brave squirtle',
        publicKey: 'bVosHhRttfhy+sTrwWvSUhuVCNMoVdDXp+g9amBrSFE=',
        ip: '10.101.0.18',
        type: 'CleverPeer',
      },
    ],
    dashboardUrl: '/organisations/orga_XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/addons/addon_12345678-1234-1234-1234-123456789abc',
  },
  {
    id: 'external_c8916d58-1881-4bc1-a7ca-fc8052629f2c',
    label: 'Parent of flo-nixos',
    domainName: 'external_c8916d58-1881-4bc1-a7ca-fc8052629f2c.m.ng_b625776f-8d36-495e-9088-02c22ebebf87.cc-ng.cloud',
    kind: 'EXTERNAL',
    logo: {
      url: getAssetUrl('/logos/external-peer.svg'),
      a11yName: 'External',
    },
    peerList: [],
  },
  {
    id: 'external_d8916d58-1881-4bc1-a7ca-fc8052629f2d',
    label: 'External member with peers',
    domainName: 'external_d8916d58-1881-4bc1-a7ca-fc8052629f2d.m.ng_b625776f-8d36-495e-9088-02c22ebebf87.cc-ng.cloud',
    kind: 'EXTERNAL',
    logo: {
      url: getAssetUrl('/logos/external-peer.svg'),
      a11yName: 'External',
    },
    peerList: [
      {
        id: '7392f881-1abe-4729-94b7-ebc73342ed31',
        label: 'flo-nixos',
        publicKey: 'ZROGRLla8A5CdzpRcbD+mjWMFqUHMdSt3iCKeLMF4Qw=',
        ip: '10.101.0.20',
        type: 'ExternalPeer',
      },
      {
        id: '7392f881-1abe-4729-94b7-ebc73342ed32',
        label: 'flo-nixos-2',
        publicKey: 'ZROGRLla8A5CdzpRcbD+mjWMFqUHMdSt3iCKeLMF4Qw=',
        ip: '10.101.0.21',
        type: 'ExternalPeer',
      },
    ],
  },
];

/** @type {NetworkGroupMember} */
export const memberWithPeers = networkGroupMembers[0];

/** @type {NetworkGroupMember} */
export const memberAddon = networkGroupMembers[1];

/** @type {NetworkGroupMember} */
export const memberExternalWithoutPeers = networkGroupMembers[2];

/** @type {NetworkGroupMember} */
export const memberExternalWithPeers = networkGroupMembers[3];

/** @type {NetworkGroupMember} */
export const memberAppWithoutPeers = {
  id: 'app_a1b2c3d4-1111-2222-3333-444455556666',
  label: 'New Node App',
  domainName: 'app_a1b2c3d4-1111-2222-3333-444455556666.m.ng_b625776f-8d36-495e-9088-02c22ebebf87.cc-ng.cloud',
  logo: {
    url: getAssetUrl('/logos/nodejs.svg'),
    a11yName: 'Node.js',
  },
  kind: 'APPLICATION',
  peerList: [],
  dashboardUrl: '/organisations/orga_XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/applications/app_a1b2c3d4-1111-2222-3333-444455556666',
};

/** @type {NetworkGroupMember} */
export const memberAddonWithoutPeers = {
  id: 'addon_b2c3d4e5-2222-3333-4444-555566667777',
  label: 'Redis Cache',
  domainName: 'addon_b2c3d4e5-2222-3333-4444-555566667777.m.ng_b625776f-8d36-495e-9088-02c22ebebf87.cc-ng.cloud',
  logo: {
    url: getAssetUrl('/logos/redis.svg'),
    a11yName: 'Redis',
  },
  kind: 'ADDON',
  peerList: [],
  dashboardUrl: '/organisations/orga_XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/addons/addon_b2c3d4e5-2222-3333-4444-555566667777',
};

/** @type {NetworkGroupMember} */
export const memberWithoutDashboardUrl = {
  id: 'external_e8916d58-1881-4bc1-a7ca-fc8052629f2e',
  label: 'External member without dashboard',
  domainName: 'external_e8916d58.m.ng_b625776f.cc-ng.cloud',
  kind: 'EXTERNAL',
  logo: {
    url: getAssetUrl('/logos/external-peer.svg'),
    a11yName: 'External',
  },
  peerList: memberExternalWithPeers.peerList,
};

/** @type {Option[]} */
export const sampleSelectOptions = [
  { label: 'My Node App (Application)', value: 'app_123' },
  { label: 'My PHP App (Application)', value: 'app_456' },
  { label: 'PostgreSQL Database (Add-on)', value: 'addon_789' },
  { label: 'Redis Cache (Add-on)', value: 'addon_abc' },
];

/** @type {Option[]} */
export const networkGroupSelectOptions = [
  {
    label: 'Delta Network Group',
    value: 'ng_00000001-0000-0000-0000-000000000001',
  },
  {
    label: 'Alpha Network Group',
    value: 'ng_00000002-0000-0000-0000-000000000002',
  },
  {
    label: 'Beta Network Group',
    value: 'ng_00000003-0000-0000-0000-000000000003',
  },
  {
    label: 'Gamma Network Group',
    value: 'ng_00000004-0000-0000-0000-000000000004',
  },
  {
    label: 'Epsilon Network Group',
    value: 'ng_00000005-0000-0000-0000-000000000005',
  },
  {
    label: 'Zeta Network Group',
    value: 'ng_00000006-0000-0000-0000-000000000006',
  },
  {
    label: 'Eta Network Group',
    value: 'ng_00000007-0000-0000-0000-000000000007',
  },
  {
    label: 'Theta Network Group',
    value: 'ng_00000008-0000-0000-0000-000000000008',
  },
  {
    label: 'Iota Network Group',
    value: 'ng_00000009-0000-0000-0000-000000000009',
  },
  {
    label: 'Kappa Network Group',
    value: 'ng_00000010-0000-0000-0000-000000000010',
  },
  {
    label: 'Lambda Network Group',
    value: 'ng_00000011-0000-0000-0000-000000000011',
  },
  {
    label: 'Mu Network Group',
    value: 'ng_00000012-0000-0000-0000-000000000012',
  },
];

