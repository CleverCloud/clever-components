import { makeStory } from '../../stories/lib/make-story.js';
import { linkedNetworkGroupList, networkGroupMembers } from '../../stories/fixtures/network-groups.js';
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
      peer: linkedNetworkGroupList[0].peerList[0],
    },
  ],
});

export const externalPeer = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupPeerCard>[]} */
  items: [
    {
      peer: networkGroupMembers[2].peerList[0],
    },
  ],
});
