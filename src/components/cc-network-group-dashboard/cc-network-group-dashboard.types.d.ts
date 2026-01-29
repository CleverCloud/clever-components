import { AddonHeaderBaseProperties } from '../cc-addon-header/cc-addon-header.types.js';
import { AddonInfoStateBaseProperties } from '../cc-addon-info/cc-addon-info.types.js';

export interface NetworkGroupDashboardHeaderProperties extends Pick<AddonHeaderBaseProperties, 'id' | 'name'> {}

export interface NetworkGroupDashboardInfoProperties
  extends Pick<AddonInfoStateBaseProperties, 'subnet' | 'lastIp' | 'numberOfMembers' | 'numberOfPeers'> {}

export type NetworkGroupDashboardState =
  | NetworkGroupDashboardStateLoaded
  | NetworkGroupDashboardStateLoading
  | NetworkGroupDashboardStateDeleting
  | NetworkGroupDashboardStateError;

export interface NetworkGroupDashboardStateLoaded
  extends NetworkGroupDashboardHeaderProperties,
    NetworkGroupDashboardInfoProperties {
  type: 'loaded';
}

export interface NetworkGroupDashboardStateDeleting
  extends NetworkGroupDashboardHeaderProperties,
    NetworkGroupDashboardInfoProperties {
  type: 'deleting';
}

export interface NetworkGroupDashboardStateLoading {
  type: 'loading';
}

export interface NetworkGroupDashboardStateError {
  type: 'error';
}
