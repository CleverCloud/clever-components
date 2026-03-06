import {
  networkGroupCleverPeer,
  networkGroupExternalPeerWithConfigLink,
} from '../../stories/fixtures/network-groups.js';
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
      peer: networkGroupCleverPeer,
    },
  ],
});

export const externalPeer = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupPeerCard>[]} */
  items: [
    {
      peer: networkGroupExternalPeerWithConfigLink,
    },
  ],
});

export const externalPeerWithoutConfigLink = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupPeerCard>[]} */
  items: [
    {
      peer: {
        ...networkGroupExternalPeerWithConfigLink,
        configLink: null,
      },
    },
  ],
});
