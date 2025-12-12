import { NetworkGroupPeer } from '../cc-network-group-peer-card/cc-network-group-peer-card.types.js';

export type NetworkGroupLinkedResourcesState =
  | NetworkGroupLinkedResourcesStateLoaded
  | NetworkGroupLinkedResourcesStateUnlinking
  | NetworkGroupLinkedResourcesStateLoading
  | NetworkGroupLinkedResourcesStateError;

export interface NetworkGroupLinkedResourcesStateLoaded {
  type: 'loaded';
  memberList: NetworkGroupMember[];
}

export interface NetworkGroupLinkedResourcesStateUnlinking {
  type: 'unlinking';
  memberList: NetworkGroupMember[];
}

export interface NetworkGroupLinkedResourcesStateLoading {
  type: 'loading';
}

export interface NetworkGroupLinkedResourcesStateError {
  type: 'error';
}

export interface NetworkGroupMember {
  id: string;
  label: string;
  logo: {
    url: string;
    a11yName: string;
  };
  domainName: string;
  kind: 'APPLICATION' | 'EXTERNAL' | 'ADDON';
  peerList: NetworkGroupPeer[]; // could be an empty array
}
