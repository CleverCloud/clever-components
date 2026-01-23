import { NetworkGroupMember } from '../cc-network-group-member-card/cc-network-group-member-card.types.js';

// Re-export NetworkGroupMember for backward compatibility
export { NetworkGroupMember } from '../cc-network-group-member-card/cc-network-group-member-card.types.js';

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
