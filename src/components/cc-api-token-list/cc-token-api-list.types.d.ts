export type TokenApiListState =
  | TokenApiListStateLoading
  | TokenApiListStateError
  | TokenApiListStateLoaded
  | TokenApiListStateCreating;

export interface TokenApiListStateLoading {
  type: 'loading';
}

export interface TokenApiListStateError {
  type: 'error';
}

export interface TokenApiListStateLoaded {
  type: 'loaded';
  tokens: TokenApiState[];
}

export interface TokenApiListStateCreating {
  type: 'creating';
}

export type TokenApiState = TokenApiStateIdle | TokenApiStateRevoking;

export interface TokenApiStateIdle extends ApiToken {
  type: 'idle';
}

export interface TokenApiStateRevoking extends ApiToken {
  type: 'revoking';
}

export interface ApiToken {
  id: string;
  creationDate: string;
  expirationDate: string;
  name: string;
  description?: string;
}

export type TokenApiStateWithExpirationWarning = TokenApiState & {
  isExpirationClose: boolean;
};
