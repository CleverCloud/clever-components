export type NetworkGroupListState =
  | NetworkGroupListStateLoaded
  | NetworkGroupListStateLoading
  | NetworkGroupListStateError;

export interface NetworkGroupListStateLoaded {
  type: 'loaded';
  networkGroupList: NetworkGroup[];
}

export interface NetworkGroupListStateLoading {
  type: 'loading';
}

export interface NetworkGroupListStateError {
  type: 'error';
}

export interface NetworkGroup {
  id: string;
  name: string;
  description?: string;
  memberList: NetworkGroupMember[];
}
