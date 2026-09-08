import { FormattedFeature } from '../common.types.js';

export type AddonInfoState = AddonInfoStateLoaded | AddonInfoStateLoading | AddonInfoStateError;

export interface AddonInfoStateLoaded extends AddonInfoStateBaseProperties {
  type: 'loaded';
}

export interface AddonInfoStateLoading extends AddonInfoStateBaseProperties {
  type: 'loading';
}

export interface AddonInfoStateError {
  type: 'error';
}

export interface AddonInfoStateBaseProperties {
  description?: string;
  version?: AddonVersionState;
  plan?: string;
  subnet?: string;
  lastIp?: string;
  numberOfMembers?: number;
  numberOfPeers?: number;
  specifications?: Array<FormattedFeature>;
  encryption?: boolean;
  creationDate?: string | number;
  role?: string;
  openGrafanaLink?: string;
  openScalabilityLink?: string;
  linkedServices?: Array<LinkedService>;
  totalContent?: {
    buckets: number;
    objects: number;
  };
  traffic?: {
    inbound: number;
    outbound: number;
  };
  usedSpaces?: {
    size: number;
  };
}

export type AddonVersionState =
  | AddonVersionStateUpToDate
  | AddonVersionStateRequestingUpdate
  | AddonVersionStateUpdateAvailable;

export interface AddonVersionStateUpToDate extends AddonVersion {
  stateType: 'up-to-date';
}

export interface AddonVersionStateRequestingUpdate extends AddonVersion {
  stateType: 'requesting-update';
  available: Array<string>;
  changelogLink: string;
}

export interface AddonVersionStateUpdateAvailable extends AddonVersion {
  stateType: 'update-available';
  available: Array<string>;
  changelogLink: string;
}

export type AddonVersion = {
  installed: string;
  latest: string;
};

export interface LinkedService {
  type: 'addon' | 'app';
  name: string;
  logoUrl: string;
  link: string;
}
