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
    docLink: {
      text: string;
      href: string;
    };
  };
};

export type TabName = 'default' | 'admin' | 'api' | 'direct' | 'elastic' | 'apm' | 'kibana';

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
