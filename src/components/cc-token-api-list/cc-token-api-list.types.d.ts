export type TokenApiListState =
  | TokenApiListStateLoading
  | TokenApiListStateError
  | TokenApiListStateLoaded
  | TokenApiListStateNoPassword
  | TokenApiListStateResettingPassword;

export interface TokenApiListStateLoading {
  type: 'loading';
}

export interface TokenApiListStateError {
  type: 'error';
}

export interface TokenApiListStateLoaded {
  type: 'loaded';
  apiTokens: ApiTokenState[];
}

export interface TokenApiListStateNoPassword {
  type: 'no-password';
}

export interface TokenApiListStateResettingPassword {
  type: 'resetting-password';
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
  creationDate: Date;
  expirationDate: Date;
  name: string;
  description?: string;
  isExpired: boolean;
}

export interface RawApiToken {
  apiTokenId: string;
  userId: string;
  creationDate: string; // ISO
  expirationDate: string; // ISO
  ip: string;
  name: string;
  description?: string;
  state: 'ACTIVE' | 'EXPIRED';
}
