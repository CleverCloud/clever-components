export type HeaderOrgaState = HeaderOrgaStateLoaded | HeaderOrgaStateLoading | HeaderOrgaStateError;

interface HeaderOrgaStateLoaded {
  state: 'loaded';
  name: string;
  avatar?: string;
  cleverEnterprise?: boolean;
  emergencyNumber?: number; 
}

interface HeaderOrgaStateLoading {
  state: 'loading';
}

interface HeaderOrgaStateError {
  state: 'error';
}