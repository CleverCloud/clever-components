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

/** @type {NetworkGroup[]} */
export const linkedNetworkGroupList = [
  {
    id: 'ng_8f7c2a1b-4e5d-6f7a-8b9c-0d1e2f3a4b5c',
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
    id: 'ng_1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
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
    id: 'ng_7b6c5d4e-3f2a-1b0c-9d8e-7f6a5b4c3d2e',
    name: 'Gamma Group',
    peerList: [
      {
        ...networkGroupExternalPeerWithConfigLink,
        configLink: null,
      },
    ],
    dashboardUrl: '#',
  },
];

/** @type {Option[]} */
export const networkGroupSelectOptions = [
  {
    label: 'Delta Network Group',
    value: 'ng_9a8b7c6d-5e4f-3a2b-1c0d-9e8f7a6b5c4d',
  },
  {
    label: 'Alpha Network Group',
    value: 'ng_8f7c2a1b-4e5d-6f7a-8b9c-0d1e2f3a4b5c',
  },
  {
    label: 'Beta Network Group',
    value: 'ng_1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
  },
  {
    label: 'Gamma Network Group',
    value: 'ng_7b6c5d4e-3f2a-1b0c-9d8e-7f6a5b4c3d2e',
  },
  {
    label: 'Epsilon Network Group',
    value: 'ng_2c3d4e5f-6a7b-8c9d-0e1f-2a3b4c5d6e7f',
  },
  {
    label: 'Zeta Network Group',
    value: 'ng_3d4e5f6a-7b8c-9d0e-1f2a-3b4c5d6e7f8a',
  },
  {
    label: 'Eta Network Group',
    value: 'ng_4e5f6a7b-8c9d-0e1f-2a3b-4c5d6e7f8a9b',
  },
  {
    label: 'Theta Network Group',
    value: 'ng_5f6a7b8c-9d0e-1f2a-3b4c-5d6e7f8a9b0c',
  },
  {
    label: 'Iota Network Group',
    value: 'ng_6a7b8c9d-0e1f-2a3b-4c5d-6e7f8a9b0c1d',
  },
  {
    label: 'Kappa Network Group',
    value: 'ng_7b8c9d0e-1f2a-3b4c-5d6e-7f8a9b0c1d2e',
  },
  {
    label: 'Lambda Network Group',
    value: 'ng_8c9d0e1f-2a3b-4c5d-6e7f-8a9b0c1d2e3f',
  },
  {
    label: 'Mu Network Group',
    value: 'ng_9d0e1f2a-3b4c-5d6e-7f8a-9b0c1d2e3f4a',
  },
];

