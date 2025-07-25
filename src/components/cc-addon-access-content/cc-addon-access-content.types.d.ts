export type AddonAccessContentItem =
  | {
      code: AddonAccessContentItemCode;
      value: string;
    }
  | AddonAccessContentItemNg;

export interface AddonAccessContentItemNg {
  code: 'ng';
  value:
    | AddonAccessContentItemNgDisabled
    | AddonAccessContentItemNgDisabling
    | AddonAccessContentItemNgEnabled
    | AddonAccessContentItemNgEnabling;
}

export interface AddonAccessContentItemNgDisabled {
  status: 'disabled';
}

export interface AddonAccessContentItemNgEnabled {
  status: 'enabled';
  id: string;
}

export interface AddonAccessContentItemNgDisabling {
  status: 'disabling';
  id: string;
}

export interface AddonAccessContentItemNgEnabling {
  status: 'enabling';
}

type AddonAccessContentItemCode =
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
  | 'tenant';
