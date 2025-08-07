import { AddonPlan, AddonProvider, FormattedFeature } from '../common.types.js';

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
};

export interface BaseProperties {
  version?: AddonVersionState;
  plan?: string;
  features?: Array<FormattedFeature>;
  creationDate: string | number;
  openGrafanaLink?: string;
  openScalabilityLink?: string;
  linkedServices?: Array<LinkedService>;
}

interface LinkedService {
  type: 'addon' | 'app';
  name: string;
  logoUrl: string;
  link: string;
}

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

export interface KeycloakOperatorInfo {
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
    networkGroup: null;
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
