export type TokenApiCreationFormState =
  | TokenApiCreationFormStateIdle
  | TokenApiCreationFormStateCreating
  | TokenApiCreationFormStateLoading;

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

export type CreationStep = 'config' | 'validate' | 'copy';
