export type DomainManagementFormState = DomainManagementFormStateIdle | DomainManagementFormStateAdding;

interface DomainManagementFormStateIdle {
  type: 'idle';
  domain: {
    value: string;
    error?: 'empty' | null;
  };
  path: {
    value: string;
  };
}

export type DomainManagementListState = DomainManagementListStateLoaded | DomainManagementListStateLoading | DomainManagementListStateError;

interface DomainManagementListStateLoaded {
  type: 'loaded';
  domains: Domain[];
}

interface DomainManagementListStateLoading {
  type: 'loading';
}

interface DomainManagementListStateError {
  type: 'error';
}

interface Domain {
  name: string;
  isPrimary: boolean;
  stateType: 'idle' | 'deleting' | 'marking-primary';
}
