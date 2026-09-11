import { AddonCredential } from '../cc-addon-credentials-content/cc-addon-credentials-content.types.js';

export type AddonCredentialsState =
  | AddonCredentialsStateLoading
  | AddonCredentialsStateError
  | AddonCredentialsStateLoaded
  | AddonCredentialsStateWaiting;

export interface AddonCredentialsStateLoading {
  type: 'loading';
  tabs: Tabs;
}

export interface AddonCredentialsStateLoaded {
  type: 'loaded';
  tabs: Tabs;
}

export interface AddonCredentialsStateError {
  type: 'error';
}

export interface AddonCredentialsStateWaiting {
  type: 'waiting';
  tabs: Tabs;
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
