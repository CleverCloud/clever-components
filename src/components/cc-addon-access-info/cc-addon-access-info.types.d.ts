export type AddonAccessInfo = AddonAccessInfoRaw | AddonAccessInfoNetworkGroup;

export interface AddonAccessInfoRaw {
  code: AccessInfoLabel;
  value: string;
}

export interface AddonAccessInfoNetworkGroup {
  code: 'ng';
  value:
    | {
        isEnabled: true;
        id: string;
      }
    | { isEnabled: false };
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
