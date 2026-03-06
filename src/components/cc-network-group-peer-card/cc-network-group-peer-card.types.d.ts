export type NetworkGroupPeer = NetworkGroupPeerClever | NetworkGroupPeerExternal;

interface BaseNetworkGroupPeer {
  id: string;
  label: string;
  publicKey: string;
  ip: string; // endpoint.ngTerm.host if CleverPeer | endpoint.ngIp if External peer
  configLink?: string;
}

export interface NetworkGroupPeerExternal extends BaseNetworkGroupPeer {
  type: 'ExternalPeer';
}
export interface NetworkGroupPeerClever extends BaseNetworkGroupPeer {
  type: 'CleverPeer';
}
