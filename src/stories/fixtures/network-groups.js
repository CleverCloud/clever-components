/**
 * @import { NetworkGroup } from '../../components/cc-network-group-list/cc-network-group-list.types.js'
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

/** @type {NetworkGroupMember} */
export const memberAppWithPeers = {
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
};

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
export const memberAddonWithPeers = {
  id: 'addon_12345678-1234-1234-1234-123456789abc',
  label: 'PostgreSQL Production',
  domainName: 'addon_12345678-1234-1234-1234-123456789abc.m.ng_b625776f-8d36-495e-9088-02c22ebebf87.cc-ng.cloud',
  logo: {
    url: getAssetUrl('/logos/postgresql.svg'),
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
export const memberExternalWithPeers = {
  id: 'external_d8916d58-1881-4bc1-a7ca-fc8052629f2d',
  label: 'External member with peers',
  domainName: 'external_d8916d58-1881-4bc1-a7ca-fc8052629f2d.m.ng_b625776f-8d36-495e-9088-02c22ebebf87.cc-ng.cloud',
  kind: 'EXTERNAL',
  logo: {
    url: getAssetUrl('/logos/external-resource.svg'),
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
};

/** @type {NetworkGroupMember} */
export const memberExternalWithoutPeers = {
  id: 'external_c8916d58-1881-4bc1-a7ca-fc8052629f2c',
  label: 'Parent of flo-nixos',
  domainName: 'external_c8916d58-1881-4bc1-a7ca-fc8052629f2c.m.ng_b625776f-8d36-495e-9088-02c22ebebf87.cc-ng.cloud',
  kind: 'EXTERNAL',
  logo: {
    url: getAssetUrl('/logos/external-resource.svg'),
    a11yName: 'External',
  },
  peerList: [],
};

/** @type {NetworkGroupMember} */
export const memberExternalWithoutDashboardUrl = {
  id: 'external_e8916d58-1881-4bc1-a7ca-fc8052629f2e',
  label: 'External member without dashboard',
  domainName: 'external_e8916d58.m.ng_b625776f.cc-ng.cloud',
  kind: 'EXTERNAL',
  logo: {
    url: getAssetUrl('/logos/external-resource.svg'),
    a11yName: 'External',
  },
  peerList: [],
};

/** @type {NetworkGroup[]} */
export const linkedNetworkGroupList = [
  {
    id: 'ng_XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',
    name: 'Alpha Network Group',
    dashboardUrl: '#',
    peerList: [
      networkGroupCleverPeer,
      {
        id: 'b2c3d4e5-2222-3333-4444-555566667777',
        label: 'Brave otter',
        publicKey: 'zYxWvUtSrQpOnMlKjIhGfEdCbA9876543210zyxw=',
        ip: '10.101.0.11',
        type: 'CleverPeer',
      },
      {
        id: 'c3d4e5f6-3333-4444-5555-666677778888',
        label: 'Gentle panda',
        publicKey: '1234567890abcdefABCDEFghijklmnopqrstuvwx=',
        ip: '10.101.0.12',
        type: 'CleverPeer',
      },
    ],
  },
  {
    id: 'ng_YYYYYYYY-YYYY-YYYY-YYYY-YYYYYYYYYYYY',
    name: 'Beta Mesh Group',
    dashboardUrl: '#',
    peerList: [
      {
        id: 'd4e5f6g7-4444-5555-6666-777788889999',
        label: 'Clever dolphin',
        publicKey: 'abcdef1234567890ghijklmnopqrstuvwxABCDEF=',
        ip: '10.101.0.20',
        type: 'CleverPeer',
      },
      {
        id: 'e5f6g7h8-5555-6666-7777-888899990000',
        label: 'Mighty eagle',
        publicKey: 'fedcba0987654321lkjihgfedcbazyxwvutsrqpo=',
        ip: '10.101.0.21',
        type: 'CleverPeer',
      },
    ],
  },
  {
    id: 'ng_ZZZZZZZZ-ZZZZ-ZZZZ-ZZZZ-ZZZZZZZZZZZZ',
    name: 'Gamma Group',
    peerList: [
      networkGroupExternalPeerWithConfigLink,
    ],
    dashboardUrl: '#',
  },
];

/** @type {Option[]} */
export const networkGroupSelectOptions = [
  {
    label: 'Delta Network Group',
    value: 'ng_XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',
  },
  {
    label: 'Alpha Network Group',
    value: 'ng_XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',
  },
  {
    label: 'Beta Network Group',
    value: 'ng_XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',
  },
  {
    label: 'Gamma Network Group',
    value: 'ng_XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',
  },
  {
    label: 'Epsilon Network Group',
    value: 'ng_XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',
  },
  {
    label: 'Zeta Network Group',
    value: 'ng_XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',
  },
  {
    label: 'Eta Network Group',
    value: 'ng_XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',
  },
  {
    label: 'Theta Network Group',
    value: 'ng_XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',
  },
  {
    label: 'Iota Network Group',
    value: 'ng_XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',
  },
  {
    label: 'Kappa Network Group',
    value: 'ng_XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',
  },
  {
    label: 'Lambda Network Group',
    value: 'ng_XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',
  },
  {
    label: 'Mu Network Group',
    value: 'ng_XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',
  },
];

