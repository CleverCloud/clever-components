export type SessionTokensState = SessionTokensStateLoaded | SessionTokensStateLoading | SessionTokensStateError;

export interface SessionTokensStateLoaded {
  type: 'loaded';
  tokens: Array<SessionToken>;
}

export interface SessionTokensStateLoading {
  type: 'loading';
}

export interface SessionTokensStateError {
  type: 'error';
}

export interface SessionToken {
  id: string;
  creationDate: Date | string; // Date or string with ISO format with timezone information
  expirationDate: Date | string; // Date or string with ISO format with timezone information
  lastUsedDate: Date | string; // Date or string with ISO format with timezone information
}
