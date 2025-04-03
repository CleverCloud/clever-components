export type TokenOauthListState =
  | TokenOauthListStateLoaded
  | TokenOauthListStateLoading
  | TokenOauthListStateError
  | TokenOauthListStateRevokingAll;

export interface TokenOauthListStateLoaded {
  type: 'loaded';
  oauthTokens: Array<TokenOauthState>;
}

export interface TokenOauthListStateRevokingAll {
  type: 'revoking-all';
  oauthTokens: Array<TokenOauthStateRevoking | TokenOauthStateCurrent>;
}

export interface TokenOauthListStateLoading {
  type: 'loading';
}

export interface TokenOauthListStateError {
  type: 'error';
}

export type TokenOauthState = TokenOauthStateIdle | TokenOauthStateRevoking | TokenOauthStateCurrent;

export interface TokenOauthStateIdle extends TokenOauth {
  type: 'idle';
}

export interface TokenOauthStateCurrent extends TokenOauth {
  type: 'current';
}

interface TokenOauthStateRevoking extends TokenOauth {
  type: 'revoking';
}

interface TokenOauth {
  id: string;
  consumerName: string;
  creationDate: Date;
  expirationDate: Date;
  lastUsedDate: Date;
  imageUrl: string;
}

export type TokenOauthStateWithExpirationWarning = TokenOauthState & {
  isExpirationClose: boolean;
};
