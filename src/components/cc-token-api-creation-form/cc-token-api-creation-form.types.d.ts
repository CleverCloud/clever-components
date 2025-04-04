export type TokenApiCreationFormState =
  | TokenApiCreationFormStateIdle
  | TokenApiCreationFormStateCreating
  | TokenApiCreationFormStateLoading
  | TokenApiCreationFormStateError;

export interface TokenApiCreationFormStateIdle {
  type: 'idle';
  isMfaEnabled: boolean;
}

export interface TokenApiCreationFormStateCreating {
  type: 'creating';
  isMfaEnabled: boolean;
}

export interface TokenApiCreationFormStateLoading {
  type: 'loading';
}

export interface TokenApiCreationFormStateError {
  type: 'error';
}

export type TokenApiCreationStep = 'config' | 'validate' | 'copy';

export type ExpirationDuration = 'seven-days' | 'thirty-days' | 'sixty-days' | 'ninety-days' | 'one-year' | 'custom';
