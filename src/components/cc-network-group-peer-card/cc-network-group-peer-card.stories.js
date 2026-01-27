import { makeStory } from '../../stories/lib/make-story.js';
import './cc-network-group-peer-card.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Network Group/<cc-network-group-peer-card>',
  component: 'cc-network-group-peer-card',
};

/**
 * @import { CcNetworkGroupPeerCard } from './cc-network-group-peer-card.js'
 */

const conf = {
  component: 'cc-network-group-peer-card',
};

export const defaultStory = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupPeerCard>[]} */
  items: [
    {
      peer: {
        id: 'a1b2c3d4-1111-2222-3333-444455556666',
        label: 'Swift fox',
        publicKey: 'aBcDeFgHiJkLmNoPqRsTuVwXyZ0123456789abcd=',
        ip: '192.168.1.100',
        type: 'CleverPeer',
      },
    },
  ],
});

export const externalPeer = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupPeerCard>[]} */
  items: [
    {
      peer: {
        id: 'z9y8x7w6-5555-6666-7777-888899990000',
        label: 'External Peer',
        publicKey: 'ZXhhbXBsZVB1YmxpY0tleQ==',
        ip: '192.168.1.100',
        type: 'ExternalPeer',
      },
    },
  ],
});
