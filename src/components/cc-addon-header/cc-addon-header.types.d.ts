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
  configLink?: string;
}

interface OpenLink {
  url: string;
  name: string;
}

export type DeploymentStatus = 'deploying' | 'active' | 'failed';

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
