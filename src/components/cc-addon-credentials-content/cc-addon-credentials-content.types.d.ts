export type AddonCredential =
  | {
      code: AddonCredentialCode;
      value: string;
    }
  | AddonCredentialNg;

export interface AddonCredentialNg {
  code: 'ng';
  kind: 'standard' | 'multi-instances';
  value: AddonCredentialNgDisabled | AddonCredentialNgDisabling | AddonCredentialNgEnabled | AddonCredentialNgEnabling;
}

export interface AddonCredentialNgDisabled {
  status: 'disabled';
}

export interface AddonCredentialNgEnabled {
  status: 'enabled';
  id: string;
}

export interface AddonCredentialNgDisabling {
  status: 'disabling';
  id: string;
}

export interface AddonCredentialNgEnabling {
  status: 'enabling';
}

type AddonCredentialCode =
  | 'user'
  | 'password'
  | 'api-client-user'
  | 'api-client-secret'
  | 'api-url'
  | 'api-key'
  | 'api-password'
  | 'initial-password'
  | 'host'
  | 'port'
  | 'token'
  | 'direct-host'
  | 'direct-port'
  | 'direct-uri'
  | 'database-name'
  | 'cluster-full-name'
  | 'uri'
  | 'tenant-namespace'
  | 'initial-user'
  | 'open-api-url'
  | 'url'
  | 'httpUrl';
