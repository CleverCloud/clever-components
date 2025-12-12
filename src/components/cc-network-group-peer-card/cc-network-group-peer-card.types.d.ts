// TODO: if external, we need to provide a link to download the config
export interface NetworkGroupPeer {
  id: string;
  label: string;
  publicKey: string;
  ip: string; // endpoint.ngTerm.host if CleverPeer | endpoint.ngIp if External peer TODO: CIDR
  type: 'ExternalPeer' | 'CleverPeer';
}
