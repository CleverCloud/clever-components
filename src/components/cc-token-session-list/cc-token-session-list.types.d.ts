export type TokenSessionListState =
  | TokenSessionListStateLoaded
  | TokenSessionListStateLoading
  | TokenSessionListStateError
  | TokenSessionListStateRevokingAll;

export interface TokenSessionListStateLoaded {
  type: 'loaded';
  currentSessionToken: SessionToken;
  otherSessionTokens: Array<SessionTokenState>;
}

export interface TokenSessionListStateRevokingAll {
  type: 'revoking-all';
  currentSessionToken: SessionToken;
  otherSessionTokens: Array<SessionTokenStateRevoking>;
}

export interface TokenSessionListStateLoading {
  type: 'loading';
}

export interface TokenSessionListStateError {
  type: 'error';
}

export type SessionTokenState = SessionTokenStateIdle | SessionTokenStateRevoking;

export interface SessionTokenStateIdle extends SessionToken {
  type: 'idle';
}

interface SessionTokenStateRevoking extends SessionToken {
  type: 'revoking';
}

interface SessionToken {
  id: string;
  creationDate: Date;
  expirationDate: Date;
  lastUsedDate: Date;
  isCleverTeam: boolean;
}
