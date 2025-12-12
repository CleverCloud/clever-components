import { makeStory } from '../../stories/lib/make-story.js';
import './cc-network-group-peer-card.js';

export default {
  tags: ['autodocs'],
  title: '🛠 NetworkGroups/<cc-network-group-peer-card>',
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
      },
    },
  ],
});
