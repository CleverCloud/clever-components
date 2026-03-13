import { NetworkGroupPeer } from '../cc-network-group-peer-card/cc-network-group-peer-card.types.js';

export type NetworkGroupMember = NetworkGroupMemberClever | NetworkGroupMemberExternal;

interface NetworkGroupMemberBaseProperties {
  id: string;
  label: string;
  logo: {
    url: string;
    a11yName: string;
  };
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
