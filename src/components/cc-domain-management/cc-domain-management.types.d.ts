export type DomainManagementFormState = DomainManagementFormStateIdle | DomainManagementFormStateAdding;

interface DomainManagementFormStateIdle {
  type: 'idle';
  hostname: {
    value: string;
    error?: FormError | null;
  };
  pathPrefix: {
    value: string;
  };
}

interface DomainManagementFormStateAdding {
  type: 'adding';
  hostname: {
    value: string;
    error?: null;
  };
  pathPrefix: {
    value: string;
  };
}

export type FormError = { code: 'empty' | 'invalid-format' | 'invalid-wildcard' } | HostnameContainsPathError;

interface HostnameContainsPathError {
  code: 'hostname-contains-path';
  pathWithinHostname: string;
}

export type DomainManagementListState =
  | DomainManagementListStateLoaded
  | DomainManagementListStateLoading
  | DomainManagementListStateError;

export interface DomainManagementListStateLoaded {
  type: 'loaded';
  domains: DomainState[];
}

export interface DomainManagementListStateLoading {
  type: 'loading';
}

export interface DomainManagementListStateError {
  type: 'error';
}

export type DomainState = DomainStateIdle | DomainStateDeleting | DomainStateMarkingPrimary;

export interface DomainStateIdle extends DomainInfo {
  type: 'idle';
}

interface DomainStateDeleting extends DomainInfo {
  type: 'deleting';
}

interface DomainStateMarkingPrimary extends DomainInfo {
  type: 'marking-primary';
}

interface DomainInfo {
  id: string;
  hostname: string;
  pathPrefix: string;
  isWildcard: boolean;
  isPrimary: boolean;
}

interface FormattedDomainInfo extends DomainInfo {
  type: DomainStateIdle['type'] | DomainStateMarkingPrimary['type'] | DomainStateDeleting['type'];
  isHttpOnly: boolean;
  isTestingOnly: boolean;
}

export type DomainManagementDnsInfoState =
  | DomainManagementDnsInfoStateLoaded
  | DomainManagementDnsInfoStateLoading
  | DomainManagementDnsInfoStateError;

interface DomainManagementDnsInfoStateLoaded {
  type: 'loaded';
  cnameRecord: string;
  aRecords: string[];
}

interface DomainManagementDnsInfoStateLoading {
  type: 'loading';
}

interface DomainManagementDnsInfoStateError {
  type: 'error';
}
