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

// TODO: if external, we need to provide a link to download the config
export interface NetworkGroupPeer {
  id: string;
  label: string;
  publicKey: string;
  ip: string; // endpoint.ngTerm.host if CleverPeer | endpoint.ngIp if External peer TODO: CIDR
  type: 'ExternalPeer' | 'CleverPeer';
}
