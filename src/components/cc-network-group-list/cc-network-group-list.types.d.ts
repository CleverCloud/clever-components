import { NetworkGroupPeer } from '../cc-network-group-peer-card/cc-network-group-peer-card.types.js';
import { Option } from '../cc-select/cc-select.types.js';

export type NetworkGroupLinkFormState =
  | NetworkGroupLinkFormStateIdle
  | NetworkGroupLinkFormStateLoading
  | NetworkGroupLinkFormStateLinking
  | NetworkGroupLinkFormStateError;

export interface NetworkGroupLinkFormStateIdle {
  type: 'idle';
  selectOptions: Option[];
}

export interface NetworkGroupLinkFormStateLoading {
  type: 'loading';
}

export interface NetworkGroupLinkFormStateLinking {
  type: 'linking';
  selectOptions: Option[];
}

export interface NetworkGroupLinkFormStateError {
  type: 'error';
}

export type NetworkGroupListState =
  | NetworkGroupListStateLoaded
  | NetworkGroupListStateLinking
  | NetworkGroupListStateLoading
  | NetworkGroupListStateError;

export interface NetworkGroupListStateLoaded {
  type: 'loaded';
  linkedNetworkGroupList: NetworkGroup[];
}

export interface NetworkGroupListStateLoading {
  type: 'loading';
}

export interface NetworkGroupListStateError {
  type: 'error';
}

export interface NetworkGroupListStateLinking {
  type: 'linking';
  linkedNetworkGroupList: NetworkGroup[];
}

export interface NetworkGroup {
  id: string;
  name: string;
  peerList: NetworkGroupPeer[];
  dashboardUrl: string;
}
