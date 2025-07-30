import { ZoneStateLoaded } from '../cc-zone/cc-zone.types.js';
import { AddonPlan, AddonProvider } from '../common.types.js';

interface BaseProperties {
  providerName: string;
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
}

interface OpenLink {
  url: string;
  name: string;
}

export interface CcHeaderAddonBetaStateLoading extends OptionalProperties {
  type: 'loading';
}

export interface CcHeaderAddonBetaStateLoaded extends BaseProperties, OptionalProperties {
  type: 'loaded';
}

export interface CcHeaderAddonBetaStateError {
  type: 'error';
}

export interface CcHeaderAddonBetaStateRestarting extends BaseProperties, OptionalProperties {
  type: 'restarting';
}

export interface CcHeaderAddonBetaStateRebuilding extends BaseProperties, OptionalProperties {
  type: 'rebuilding';
}

export type CcHeaderAddonBetaState =
  | CcHeaderAddonBetaStateLoading
  | CcHeaderAddonBetaStateLoaded
  | CcHeaderAddonBetaStateError
  | CcHeaderAddonBetaStateRestarting
  | CcHeaderAddonBetaStateRebuilding;

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

export interface RawOperator {
  resourceId: string;
  addonId: string;
  name: string;
  ownerId: string;
  plan: string;
  version: string;
  javaVersion: string;
  accessUrl: string;
  availableVersions: string[];
  resources: {
    entrypoint: string;
    fsbucketId: string;
    pgsqlId: string;
  };
  features: {
    networkGroup?: string;
  };
  envVars: {
    CC_KEYCLOAK_ADMIN: string;
    CC_RUN_COMMAND: string;
    CC_KEYCLOAK_DB_POOL_INITIAL_SIZE: string;
    CC_METRICS_PROMETHEUS_PATH: string;
    CC_JAVA_VERSION: string;
    CC_PRE_RUN_HOOK: string;
    CC_METRICS_PROMETHEUS_PORT: string;
    CC_POST_BUILD_HOOK: string;
    CC_KEYCLOAK_REALMS: string;
    CC_KEYCLOAK_HOSTNAME: string;
    CC_FS_BUCKET: string;
    CC_KEYCLOAK_ADMIN_DEFAULT_PASSWORD: string;
    CC_KEYCLOAK_VERSION: string;
    CC_KEYCLOAK_DB_POOL_MAX_SIZE: string;
  };
}
