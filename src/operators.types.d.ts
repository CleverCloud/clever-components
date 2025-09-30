export interface RawOperator {
  resourceId: string;
  addonId: string;
  name: string;
  ownerId: string;
  plan: string;
  version: string;
  appVersion: string;
  accessUrl: string;
  availableVersions: string[];
  resources: {
    entrypoint: string;
    [key: string]: string;
  };
  features: {
    networkGroup?: string;
  };
  envVars: Record<string, string>;
}

export interface OperatorVersionInfo {
  available: string[];
  installed: string;
  latest: string;
  needUpdate: boolean;
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

export interface OtoroshiOperatorInfo {
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
    redisId: string;
  };
  features: {
    networkGroup: null;
  };
  envVars: {
    ADMIN_API_CLIENT_ID: string;
    ADMIN_API_CLIENT_SECRET: string;
    ADMIN_API_EXPOSED_SUBDOMAIN: string;
    ADMIN_API_GROUP: string;
    ADMIN_API_SERVICE_ID: string;
    ADMIN_API_TARGET_SUBDOMAIN: string;
    APP_BACKOFFICE_SUBDOMAIN: string;
    APP_DOMAIN: string;
    APP_ENV: string;
    APP_PRIVATEAPPS_SUBDOMAIN: string;
    APP_ROOT_SCHEME: string;
    APP_STORAGE: string;
    CC_JAR_PATH: string;
    CC_JAVA_VERSION: string;
    CC_OTOROSHI_API_URL: string;
    CC_OTOROSHI_INITIAL_ADMIN_LOGIN: string;
    CC_OTOROSHI_INITIAL_ADMIN_PASSWORD: string;
    CC_OTOROSHI_SSO_URL: string;
    CC_OTOROSHI_VERSION: string;
    CC_PRE_BUILD_HOOK: string;
    CC_RUN_COMMAND: string;
    CLAIM_SHAREDKEY: string;
    OTOROSHI_ANONYMOUS_REPORTING_ENABLED: string;
    OTOROSHI_CHECK_FOR_UPDATES: string;
    OTOROSHI_EXPOSED_PORTS_HTTP: string;
    OTOROSHI_EXPOSED_PORTS_HTTPS: string;
    OTOROSHI_INSTANCE_LOGO: string;
    OTOROSHI_INSTANCE_NAME: string;
    OTOROSHI_REDIS_LETTUCE_URI: string;
    OTOROSHI_ROUTE_BASE_DOMAIN: string;
    OTOROSHI_SECRET: string;
    PLAY_CRYPTO_SECRET: string;
    PORT: string;
    SESSION_DOMAIN: string;
    SESSION_SECURE_ONLY: string;
  };
}
