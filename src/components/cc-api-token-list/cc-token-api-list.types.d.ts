export type TokenApiListState =
  | TokenApiListStateLoading
  | TokenApiListStateError
  | TokenApiListStateLoaded
  | TokenApiListStateRevokingAll;

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

export interface TokenApiListStateRevokingAll {
  type: 'revoking-all';
  tokens: TokenApiStateRevoking[];
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
  creationDate: Date;
  expirationDate: Date;
  name: string;
  description?: string;
}
