import { ZoneStateLoaded } from '../cc-zone/cc-zone.types.js';
import { AddonPlan, AddonProvider } from '../common.types.js';

export type CcAddonHeaderState =
  | CcAddonHeaderStateLoading
  | CcAddonHeaderStateLoaded
  | CcAddonHeaderStateError
  | CcAddonHeaderStateRestarting
  | CcAddonHeaderStateRebuilding;

interface BaseProperties {
  providerId: string;
  providerLogoUrl: string;
  name: string;
  id: string;
  zone: ZoneStateLoaded;
}

interface OptionalProperties {
  logsUrl?: string;
  openLinks?: Array<OpenLink>;
  actions?: {
    restart: boolean;
    rebuildAndRestart: boolean;
  };
  productStatus?: string;
  deploymentStatus?: DeploymentStatus;
  configLink?: {
    href: string;
    fileName: string;
  };
}

interface OpenLink {
  url: string;
  name: string;
}

export type DeploymentStatus = 'deploying' | 'active' | 'failed' | 'deleted';

export interface CcAddonHeaderStateLoading extends OptionalProperties {
  type: 'loading';
}

export interface CcAddonHeaderStateLoaded extends BaseProperties, OptionalProperties {
  type: 'loaded';
}

export interface CcAddonHeaderStateError {
  type: 'error';
}

export interface CcAddonHeaderStateRestarting extends BaseProperties, OptionalProperties {
  type: 'restarting';
}

export interface CcAddonHeaderStateRebuilding extends BaseProperties, OptionalProperties {
  type: 'rebuilding';
}

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

export type Addon = BaseProperties & OptionalProperties;

export interface KubeInfo {
  id: string;
  tenantId: string;
  name: string;
  description?: string | null;
  tag?: string | null;
  status: string;
  creationDate: string;
  version: string;
}

export interface ElasticProviderInfo {
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

export interface MateriaKvInfo {
  id: string;
  clusterId: string;
  ownerId: string;
  kind: string;
  plan: string;
  host: string;
  port: number;
  token: string;
  tokenId: string;
  status: string;
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
