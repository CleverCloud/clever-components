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
  isLinkedToGitHub?: boolean;
}

export interface TokenApiListStateResettingPassword {
  type: 'resetting-password';
  isLinkedToGitHub?: boolean;
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
