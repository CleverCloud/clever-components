import { NetworkGroupPeer } from '../cc-network-group-peer-card/cc-network-group-peer-card.types.js';

export type NetworkGroupMember = NetworkGroupMemberClever | NetworkGroupMemberExternal | NetworkGroupMemberDeleted;

export interface NetworkGroupMemberLogo {
  url: string;
  a11yName: string;
}

interface NetworkGroupMemberBaseProperties {
  id: string;
  label: string;
  logo: NetworkGroupMemberLogo;
  domainName: string;
  peerList: NetworkGroupPeer[];
}

export interface NetworkGroupMemberClever extends NetworkGroupMemberBaseProperties {
  kind: 'APPLICATION' | 'ADDON';
  dashboardUrl: string;
}

export interface NetworkGroupMemberExternal extends NetworkGroupMemberBaseProperties {
  kind: 'EXTERNAL';
}

export interface NetworkGroupMemberDeleted {
  kind: 'DELETED';
  id: string;
  label: string;
}
