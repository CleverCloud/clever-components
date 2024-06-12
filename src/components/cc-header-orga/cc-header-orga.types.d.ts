export type HeaderOrgaState = HeaderOrgaStateLoaded | HeaderOrgaStateLoading | HeaderOrgaStateError;

export interface HeaderOrgaStateLoaded {
  type: 'loaded';
  name: string;
  avatar?: string;
  cleverEnterprise?: boolean;
  emergencyNumber?: string;
}

export interface HeaderOrgaStateLoading {
  type: 'loading';
}

export interface HeaderOrgaStateError {
  type: 'error';
}
