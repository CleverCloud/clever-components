export type NetworkGroupPeer = NetworkGroupPeerClever | NetworkGroupPeerExternal;

interface BaseNetworkGroupPeer {
  id: string;
  label: string;
  publicKey: string;
  ip: string; // endpoint.ngTerm.host if CleverPeer | endpoint.ngIp if External peer
}

export interface NetworkGroupPeerExternal extends BaseNetworkGroupPeer {
  type: 'ExternalPeer';
  configLink?: string;
}
export interface NetworkGroupPeerClever extends BaseNetworkGroupPeer {
  type: 'CleverPeer';
}
