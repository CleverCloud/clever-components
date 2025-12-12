import { makeStory } from '../../stories/lib/make-story.js';
import './cc-network-group-list.js';

export default {
  tags: ['autodocs'],
  title: '🛠 NetworkGroups/<cc-network-group-list>',
  component: 'cc-network-group-list',
};

/**
 * @import { CcNetworkGroupList } from './cc-network-group-list.js'
 * @import { NetworkGroup } from './cc-network-group-list.types.js'
 * @import { Option } from '../cc-select/cc-select.types.js'
 */

const conf = {
  component: 'cc-network-group-list',
};

/** @type {NetworkGroup[]} */
const baseLinkedNetworkGroupList = [
  {
    id: 'ng_XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',
    name: 'Alpha Network Group',
    peerList: [
      {
        id: 'a1b2c3d4-1111-2222-3333-444455556666',
        label: 'Swift fox',
        publicKey: 'aBcDeFgHiJkLmNoPqRsTuVwXyZ0123456789abcd=',
        ip: '10.101.0.10', // TODO: CIDR
        type: 'CleverPeer',
      },
      {
        id: 'b2c3d4e5-2222-3333-4444-555566667777',
        label: 'Brave otter',
        publicKey: 'zYxWvUtSrQpOnMlKjIhGfEdCbA9876543210zyxw=',
        ip: '10.101.0.11', // TODO: CIDR
        type: 'CleverPeer',
      },
      {
        id: 'c3d4e5f6-3333-4444-5555-666677778888',
        label: 'Gentle panda',
        publicKey: '1234567890abcdefABCDEFghijklmnopqrstuvwx=',
        ip: '10.101.0.12', // TODO: CIDR
        type: 'CleverPeer',
      },
    ],
    dashboardUrl: '#',
  },
  {
    id: 'ng_XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',
    name: 'Beta Mesh Group',
    peerList: [
      {
        id: 'd4e5f6g7-4444-5555-6666-777788889999',
        label: 'Clever dolphin',
        publicKey: 'abcdef1234567890ghijklmnopqrstuvwxABCDEF=',
        ip: '10.101.0.20', // TODO: CIDR
        type: 'CleverPeer',
      },
      {
        id: 'e5f6g7h8-5555-6666-7777-888899990000',
        label: 'Mighty eagle',
        publicKey: 'fedcba0987654321lkjihgfedcbazyxwvutsrqpo=',
        ip: '10.101.0.21', // TODO: CIDR
        type: 'CleverPeer',
      },
    ],
    dashboardUrl: '#',
  },
  {
    id: 'ng_XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',
    name: 'Gamma Peer Group',
    peerList: [
      {
        id: 'f6g7h8i9-6666-7777-8888-999900001111',
        label: 'Silent lynx',
        publicKey: '0987654321abcdefABCDEFghijklmnopqrstuvwx=',
        ip: '10.101.0.30', // TODO: CIDR
        type: 'CleverPeer',
      },
    ],
    dashboardUrl: '#',
  },
];

/** @type {Option[]} */
const baseNetworkGroupList = [
  {
    label: 'ng_XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',
    value: 'Delta Network Group',
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

export const defaultStory = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupList>[]} */
  items: [
    {
      linkFormState: {
        type: 'idle',
        selectOptions: baseNetworkGroupList,
      },
      listState: {
        type: 'loaded',
        linkedNetworkGroupList: baseLinkedNetworkGroupList,
      },
    },
  ],
});

export const dataLoadedWithEmpty = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupList>[]} */
  items: [
    {
      linkFormState: {
        type: 'idle',
        selectOptions: baseNetworkGroupList,
      },
      listState: {
        type: 'loaded',
        linkedNetworkGroupList: [],
      },
    },
  ],
});

export const loading = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupList>[]} */
  items: [
    {
      linkFormState: { type: 'loading' },
      listState: { type: 'loading' },
    },
  ],
});

export const error = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupList>[]} */
  items: [
    {
      linkFormState: { type: 'error' },
      listState: { type: 'error' },
    },
  ],
});
