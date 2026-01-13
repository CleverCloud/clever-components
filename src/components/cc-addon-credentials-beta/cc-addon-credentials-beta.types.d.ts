import { AddonCredential } from '../cc-addon-credentials-content/cc-addon-credentials-content.types.js';
import { AddonPlan, AddonProvider } from '../common.types.js';

export type AddonCredentialsBetaState =
  | AddonCredentialsBetaStateLoading
  | AddonCredentialsBetaStateError
  | AddonCredentialsBetaStateLoaded;

export interface AddonCredentialsBetaStateLoading {
  type: 'loading';
  tabs: Tabs;
}

export interface AddonCredentialsBetaStateLoaded {
  type: 'loaded';
  tabs: Tabs;
}

export interface AddonCredentialsBetaStateError {
  type: 'error';
}

type Tabs = {
  [key in TabName & string]?: {
    content: Array<AddonCredential>;
    docLink?: {
      text: string;
      href: string;
    };
  };
};

export type TabName = 'default' | 'admin' | 'api' | 'apm' | 'cli' | 'direct' | 'elastic' | 'kibana';

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

export interface PulsarClusterInfo {
  id: string;
  url: string;
  pulsar_port: number;
  pulsar_tls_port: number;
  web_port: number;
  web_tls_port: number;
  version: string;
  available: true;
  zone: string;
  support_cold_storage: true;
  supported_plans: Array<string>;
}
