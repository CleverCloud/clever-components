import { AddonAccessInfo } from '../cc-addon-access-info/cc-addon-access-info.types.js';
import { AddonPlan, AddonProvider } from '../common.types.js';

export type CcAddonAccessUniqueState =
  | CcAddonAccessUniqueStateLoading
  | CcAddonAccessUniqueStateLoadingWithTabs
  | CcAddonAccessUniqueStateError
  | CcAddonAccessUniqueStateLoaded
  | CcAddonAccessUniqueStateLoadedWithTabs;

export interface CcAddonAccessUniqueStateLoading {
  type: 'loading';
  content?: Array<AddonAccessInfo>;
  cliCommand?: string;
}

export interface CcAddonAccessUniqueStateLoadingWithTabs {
  type: 'loading-with-tabs';
  tabs?: TabbedContent;
  cliCommand?: string;
}

type TabbedContent = {
  [key in TabName]?: Array<AddonAccessInfo>;
};

export interface CcAddonAccessUniqueStateLoadedWithTabs {
  type: 'loaded-with-tabs';
  tabs: TabbedContent;
  cliCommand?: string;
}

export interface CcAddonAccessUniqueStateLoaded {
  type: 'loaded';
  content: Array<AddonAccessInfo>;
  cliCommand?: string;
}

export interface CcAddonAccessUniqueStateError {
  type: 'error';
}

export type TabName = 'default' | 'api' | 'direct' | 'elastic' | 'apm' | 'kibana';

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
