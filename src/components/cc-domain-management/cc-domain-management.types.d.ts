export type DomainManagementFormState = DomainManagementFormStateIdle | DomainManagementFormStateAdding;

interface DomainManagementFormStateIdle {
  type: 'idle';
  domain: {
    value: string;
    error?: FormError | null;
  };
  pathPrefix: {
    value: string;
  };
}

interface DomainManagementFormStateAdding {
  type: 'adding';
  domain: {
    value: string;
    error?: null;
  };
  pathPrefix: {
    value: string;
  };
}

export type FormError = 'empty' | 'contains-path' | 'invalid-format' | 'invalid-wildcard';

export type DomainManagementListState = DomainManagementListStateLoaded | DomainManagementListStateLoading | DomainManagementListStateError;

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
  fqdn: string;
  isPrimary: boolean;
}

interface FormattedDomainInfo extends DomainInfo {
  type: DomainStateIdle['type'] | DomainStateMarkingPrimary['type'] | DomainStateDeleting['type'];
  domainName: string;
  pathPrefix: string;
  isHttpOnly: boolean;
  isTestOnly: boolean;
}

export type DomainManagementDnsInfoState = DomainManagementDnsInfoStateLoaded | DomainManagementDnsInfoStateLoading | DomainManagementDnsInfoStateError;

interface DomainManagementDnsInfoStateLoaded {
  type: 'loaded';
  cnameValue: string;
  aValues: string[];
}

interface DomainManagementDnsInfoStateLoading {
  type: 'loading';
}

interface DomainManagementDnsInfoStateError {
  type: 'error';
}
