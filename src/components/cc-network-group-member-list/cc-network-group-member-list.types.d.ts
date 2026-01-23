import { NetworkGroupMember } from '../cc-network-group-member-card/cc-network-group-member-card.types.js';

// Re-export NetworkGroupMember for backward compatibility
export { NetworkGroupMember } from '../cc-network-group-member-card/cc-network-group-member-card.types.js';

export type NetworkGroupMemberListState =
  | NetworkGroupMemberListStateLoaded
  | NetworkGroupMemberListStateUnlinking
  | NetworkGroupMemberListStateLoading
  | NetworkGroupMemberListStateError;

export interface NetworkGroupMemberListStateLoaded {
  type: 'loaded';
  memberList: NetworkGroupMember[];
}

export interface NetworkGroupMemberListStateUnlinking {
  type: 'unlinking';
  memberList: NetworkGroupMember[];
}

export interface NetworkGroupMemberListStateLoading {
  type: 'loading';
}

export interface NetworkGroupMemberListStateError {
  type: 'error';
}
