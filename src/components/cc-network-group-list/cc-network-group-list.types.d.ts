import { NetworkGroupPeer } from '../cc-network-group-peer-card/cc-network-group-peer-card.types.js';
import { Option } from '../cc-select/cc-select.types.js';

export type NetworkGroupListState =
  | NetworkGroupListStateLoading
  | NetworkGroupListStateError
  | NetworkGroupListStateUnsupported
  | NetworkGroupListStateLoaded;

export interface NetworkGroupListStateLoading {
  type: 'loading';
}

export interface NetworkGroupListStateError {
  type: 'error';
}

export interface NetworkGroupListStateUnsupported {
  type: 'unsupported';
  addonMigrationScreenUrl: string;
}

export interface NetworkGroupListStateLoaded {
  type: 'loaded';
  linkFormState: NetworkGroupLinkFormState;
  listState: NetworkGroupLinkedListState;
}

export type NetworkGroupLinkFormState =
  | NetworkGroupLinkFormStateIdle
  | NetworkGroupLinkFormStateLinking
  | NetworkGroupLinkFormStateEmpty;

export interface NetworkGroupLinkFormStateIdle {
  type: 'idle';
  selectOptions: Option[];
}

export interface NetworkGroupLinkFormStateLinking {
  type: 'linking';
  selectOptions: Option[];
}

export interface NetworkGroupLinkFormStateEmpty {
  type: 'empty';
  networkGroupDashboardUrl: string;
}

export type NetworkGroupLinkedListState = NetworkGroupLinkedListStateLoaded | NetworkGroupLinkedListStateUnlinking;

export interface NetworkGroupLinkedListStateLoaded {
  type: 'loaded';
  linkedNetworkGroupList: NetworkGroup[];
}

export interface NetworkGroupLinkedListStateUnlinking {
  type: 'unlinking';
  linkedNetworkGroupList: NetworkGroup[];
}

export interface NetworkGroup {
  id: string;
  name: string;
  peerList: NetworkGroupPeer[];
  dashboardUrl: string;
}
