export type TokenApiListState = TokenApiListStateLoading | TokenApiListStateError | TokenApiListStateLoaded;

export interface TokenApiListStateLoading {
  type: 'loading';
}

export interface TokenApiListStateError {
  type: 'error';
}

export interface TokenApiListStateLoaded {
  type: 'loaded';
  apiTokens: TokenApiState[];
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

export interface RawApiToken {
  apiTokenId: string;
  userId: string;
  creationDate: string; // ISO
  expirationDate: string; // ISO
  ip: string;
  name: string;
  description?: string;
}
