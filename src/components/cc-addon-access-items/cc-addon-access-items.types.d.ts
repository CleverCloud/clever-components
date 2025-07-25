export type AddonAccessItem =
  | {
      code: AddonAccessItemCode;
      value: string;
    }
  | AddonAccessItemNetworkGroup;

export interface AddonAccessItemNetworkGroup {
  code: 'ng';
  value:
    | AddonAccessItemNetworkGroupDisabled
    | AddonAccessitemsNetworkGroupDisabling
    | AddonAccessItemsNetworkGroupEnabled
    | AddonAccessItemsNetworkGroupEnabling;
}

export interface AddonAccessItemNetworkGroupDisabled {
  status: 'disabled';
}

export interface AddonAccessItemsNetworkGroupEnabled {
  status: 'enabled';
  id: string;
}

export interface AddonAccessitemsNetworkGroupDisabling {
  status: 'disabling';
  id: string;
}

export interface AddonAccessItemsNetworkGroupEnabling {
  status: 'enabling';
}

type AddonAccessItemCode =
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
