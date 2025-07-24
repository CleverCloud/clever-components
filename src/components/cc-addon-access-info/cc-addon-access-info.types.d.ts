export type AddonAccessInfo = AddonAccessInfoRaw | AddonAccessInfoNetworkGroup;

export interface AddonAccessInfoRaw {
  code: AccessInfoLabel;
  value: string;
}

export interface AddonAccessInfoNetworkGroup {
  code: 'ng';
  value:
    | AddonInfoNetworkGroupDisabled
    | AddonInfoNetworkGroupDisabling
    | AddonInfoNetworkGroupEnabled
    | AddonInfoNetworkGroupEnabling;
}

export interface AddonInfoNetworkGroupDisabled {
  status: 'disabled';
}

export interface AddonInfoNetworkGroupEnabled {
  status: 'enabled';
  id: string;
}

export interface AddonInfoNetworkGroupDisabling {
  status: 'disabling';
  id: string;
}

export interface AddonInfoNetworkGroupEnabling {
  status: 'enabling';
}

type AccessInfoLabel =
  | 'user'
  | 'password'
  | 'apiClientUser'
  | 'apiClientSecret'
  | 'apiUrl'
  | 'apiKey'
  | 'apiPassword'
  | 'host'
  | 'port'
  | 'token'
  | 'directHost'
  | 'directPort'
  | 'directUri'
  | 'databaseName'
  | 'clusterFullName'
  | 'uri'
  | 'tenant';
