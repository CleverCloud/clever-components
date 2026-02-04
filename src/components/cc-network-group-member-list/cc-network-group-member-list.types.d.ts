import { NetworkGroupMember } from '../cc-network-group-member-card/cc-network-group-member-card.types.js';
import { Option } from '../cc-select/cc-select.types.js';

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

export type NetworkGroupMemberLinkFormState =
  | NetworkGroupMemberLinkFormStateLoading
  | NetworkGroupMemberLinkFormStateIdle
  | NetworkGroupMemberLinkFormStateLinking
  | NetworkGroupMemberLinkFormStateError;

export interface NetworkGroupMemberLinkFormStateLoading {
  type: 'loading';
}

export interface NetworkGroupMemberLinkFormStateIdle {
  type: 'idle';
  selectOptions: Option[];
}

export interface NetworkGroupMemberLinkFormStateLinking {
  type: 'linking';
  selectOptions: Option[];
}

export interface NetworkGroupMemberLinkFormStateError {
  type: 'error';
}
