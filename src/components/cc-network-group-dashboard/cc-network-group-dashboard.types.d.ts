export type NetworkGroupDashboardState =
  | NetworkGroupDashboardStateLoaded
  | NetworkGroupDashboardStateLoading
  | NetworkGroupDashboardStateDeleting
  | NetworkGroupDashboardStateError;

interface NetworkGroupDashboardBaseProperties {
  id: string;
  name: string;
  description: string;
  subnet: string;
  lastIp: string;
  numberOfMembers: number;
  numberOfPeers: number;
}

export interface NetworkGroupDashboardStateLoaded extends NetworkGroupDashboardBaseProperties {
  type: 'loaded';
}

export interface NetworkGroupDashboardStateDeleting extends NetworkGroupDashboardBaseProperties {
  type: 'deleting';
}

export interface NetworkGroupDashboardStateLoading {
  type: 'loading';
}

export interface NetworkGroupDashboardStateError {
  type: 'error';
}
