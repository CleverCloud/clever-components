import { FormattedFeature, RawAddonProvider } from '../common.types.js';

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
  version?: AddonVersionState;
  plan?: string;
  features?: Array<FormattedFeature>;
  creationDate: string | number;
  role?: string;
  openGrafanaLink?: string;
  openScalabilityLink?: string;
  linkedServices?: Array<LinkedService>;
  docUrlLink?: string;
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

interface AddonPlan {
  name: string;
  features?: {
    name: string;
    type: 'BOOLEAN' | 'BOOLEAN_SHARED' | 'NUMBER_CPU_RUNTIME' | 'OBJECT' | 'SHARED' | 'BYTES' | 'NUMBER' | 'STRING';
    value: string;
    computable_value: string;
    name_code: string;
  }[];
}

export type AddonProvider = Pick<RawAddonProvider, 'id' | 'name' | 'logoUrl'>;

// Copies from cc-header-addon-beta, will need to mutualize
export interface RawAddon {
  id: string;
  name: string;
  realId: string;
  region: string;
  zoneId: string;
  provider: AddonProvider;
  plan: AddonPlan;
  creationDate: number;
  configKeys: string[];
}

export interface ElasticAddonInfo {
  id: string;
  app_id: string;
  plan: string;
  zone: string;
  config: {
    host: string;
    user: string;
    password: string;
    apm_user: string;
    apm_password: string;
    apm_auth_token: string;
    kibana_user: string;
    kibana_password: string;
  };
  owner_id: string;
  version: string;
  backups: {
    kibana_snapshots_url: string;
  };
  kibana_application: string;
  apm_application: string;
  services: [
    {
      name: string;
      enabled: boolean;
    },
  ];
  features: [
    {
      name: string;
      enabled: boolean;
    },
  ];
}

export interface PulsarProviderInfo {
  id: string;
  owner_id: string;
  tenant: string;
  namespace: string;
  cluster_id: string;
  token: string;
  creation_date: string;
  ask_for_deletion_date?: string;
  deletion_date?: string;
  status: string;
  plan: string;
  cold_storage_id: string;
  cold_storage_linked: boolean;
  cold_storage_must_be_provided: boolean;
}

export interface JenkinsProviderInfo {
  id: string;
  app_id: string;
  owner_id: string;
  plan: string;
  zone: string;
  creation_date: string;
  status: string;
  host: string;
  user: string;
  password: string;
  version: string;
  features: [
    {
      name: string;
      enabled: boolean;
    },
  ];
}
