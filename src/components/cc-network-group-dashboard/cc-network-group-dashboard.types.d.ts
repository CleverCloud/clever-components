export type NetworkGroupDashboardState =
  | NetworkGroupDashboardStateLoaded
  | NetworkGroupDashboardStateLoading
  | NetworkGroupDashboardStateDeleting
  | NetworkGroupDashboardStateError;

export interface NetworkGroupDashboardStateLoaded {
  type: 'loaded';
  id: string;
  name: string;
  creationDate: string;
  description: string;
  subnet: string;
  lastIp: string;
  numberOfMembers: number;
  numberOfPeers: number;
  tags: string[];
}

export interface NetworkGroupDashboardStateDeleting {
  type: 'deleting';
  id: string;
  name: string;
  creationDate: string;
  description: string;
  subnet: string;
  lastIp: string;
  numberOfMembers: number;
  numberOfPeers: number;
  tags: string[];
}

export interface NetworkGroupDashboardStateLoading {
  type: 'loading';
}

export interface NetworkGroupDashboardStateError {
  type: 'error';
}
