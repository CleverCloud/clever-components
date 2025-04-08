export type TokenApiCreationFormState =
  | TokenApiCreationFormStateIdle
  | TokenApiCreationFormStateCreating
  | TokenApiCreationFormStateCreated
  | TokenApiCreationFormStateLoading
  | TokenApiCreationFormStateError;

export interface TokenApiCreationFormStateIdle {
  type: 'idle';
  isMfaEnabled: boolean;
  hasCredentialsError: boolean;
}

export interface TokenApiCreationFormStateCreating {
  type: 'creating';
  isMfaEnabled: boolean;
  hasCredentialsError: false;
}

export interface TokenApiCreationFormStateCreated {
  type: 'created';
  token: string;
}

export interface TokenApiCreationFormStateLoading {
  type: 'loading';
}

export interface TokenApiCreationFormStateError {
  type: 'error';
}

export type TokenApiCreationStep = 'config' | 'validate' | 'copy';

export type ExpirationDuration = 'seven-days' | 'thirty-days' | 'sixty-days' | 'ninety-days' | 'one-year' | 'custom';
