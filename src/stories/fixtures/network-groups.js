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

