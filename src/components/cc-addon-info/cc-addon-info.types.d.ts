import { FormattedFeature } from "../common.types.js";

export type CcAddonInfoState = CcAddonInfoStateLoaded | CcAddonInfoStateLoading | CcAddonInfoStateError;

export interface CcAddonInfoStateLoaded extends BaseProperties {
  type: 'loaded';
}

export interface CcAddonInfoStateLoading extends BaseProperties {
  type: 'loading';
}

export interface CcAddonInfoStateError {
  type: 'error';
}

export type AddonVersion = {
    installed: string;
    available: string[];
    changelogLink: string;
};

export interface BaseProperties {
  version?: AddonVersion;
  plan?: string;
  features?: Array<FormattedFeature>
  creationDate: string;
  openGrafanaLink?: string;
  openScalabilityLink?: string;
  linkedServices?: Array<LinkedService>;
}

interface LinkedService {
  type: 'add-on' | 'app';
  name: string;
  logoUrl: string;
  link: string;
}
