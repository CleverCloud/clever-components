import { NetworkGroupPeer } from '../cc-network-group-peer-card/cc-network-group-peer-card.types.js';

export interface NetworkGroupMember {
  id: string;
  label: string;
  logo: {
    url: string;
    a11yName: string;
  };
  domainName: string;
  kind: 'APPLICATION' | 'EXTERNAL' | 'ADDON';
  peerList: NetworkGroupPeer[];
  dashboardUrl?: string; // The member could be "EXTERNAL" and not have a dashboard URL
}
