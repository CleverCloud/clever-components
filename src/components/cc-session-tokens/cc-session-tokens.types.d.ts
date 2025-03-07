export type SessionTokensState = SessionTokensStateLoaded | SessionTokensStateLoading | SessionTokensStateError;

export interface SessionTokensStateLoaded {
  type: 'loaded';
  tokens: Array<SessionTokenState>;
}

export interface SessionTokensStateLoading {
  type: 'loading';
}

export interface SessionTokensStateError {
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
  creationDate: number | string; // timestamp as number or string with ISO format with timezone information
  expirationDate: number | string; // timestamp as number or string with ISO format with timezone information
  lastUsedDate: number | string; // timestamp as number or string with ISO format with timezone information
  isCurrentSession: boolean;
  // TODO: isCleverTeam
}

export type SessionTokenStateWitExpiresSoon = SessionTokenState & {
  expiresSoon: boolean;
};
