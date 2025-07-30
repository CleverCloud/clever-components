import { AddonAccessContentItem } from '../cc-addon-access-content/cc-addon-access-content.types.js';
import { AddonPlan, AddonProvider } from '../common.types.js';

export type CcAddonAccessState = CcAddonAccessStateLoading | CcAddonAccessStateError | CcAddonAccessStateLoaded;

export interface CcAddonAccessStateLoading {
  type: 'loading';
  tabs: Tabs;
}

type Tabs = {
  [key in TabName & string]?: Array<AddonAccessContentItem>;
};

export interface CcAddonAccessStateLoaded {
  type: 'loaded';
  tabs: Tabs;
}

export interface CcAddonAccessStateError {
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
