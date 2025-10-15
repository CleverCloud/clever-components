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
