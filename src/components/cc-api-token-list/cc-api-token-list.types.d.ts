export type ApiTokensState =
  | ApiTokensStateLoading
  | ApiTokensStateError
  | ApiTokensStateLoaded
  | ApiTokensStateCreating;

export interface ApiTokensStateLoading {
  type: 'loading';
}

export interface ApiTokensStateError {
  type: 'error';
}

export interface ApiTokensStateLoaded {
  type: 'loaded';
  tokens: ApiTokenState[];
}

export interface ApiTokensStateCreating {
  type: 'creating';
}

export type ApiTokenState = ApiTokenStateIdle | ApiTokenStateRevoking;

export interface ApiTokenStateIdle extends ApiToken {
  type: 'idle';
}

export interface ApiTokenStateRevoking extends ApiToken {
  type: 'revoking';
}

export interface ApiToken {
  id: string;
  creationDate: string;
  expirationDate: string;
  name: string;
  description?: string;
}

export type ApiTokenStateWithExpirationWarning = ApiTokenState & {
  isExpirationClose: boolean;
};
