export type TokenOauthListState =
  | TokenOauthListStateLoaded
  | TokenOauthListStateLoading
  | TokenOauthListStateError
  | TokenOauthListStateRevokingAll;

export interface TokenOauthListStateLoaded {
  type: 'loaded';
  oauthTokens: Array<OauthTokenState>;
}

export interface TokenOauthListStateRevokingAll {
  type: 'revoking-all';
  oauthTokens: Array<OauthTokenStateRevoking>;
}

export interface TokenOauthListStateLoading {
  type: 'loading';
}

export interface TokenOauthListStateError {
  type: 'error';
}

export type OauthTokenState = OauthTokenStateIdle | OauthTokenStateRevoking;

export interface OauthTokenStateIdle extends OauthToken {
  type: 'idle';
}

export interface OauthTokenStateRevoking extends OauthToken {
  type: 'revoking';
}

export interface OauthToken {
  id: string;
  consumerName: string;
  creationDate: Date;
  expirationDate: Date;
  lastUsedDate: Date;
  imageUrl: string;
}
