export type TokenApiCreationFormState =
  | TokenApiCreationFormStateLoaded
  | TokenApiCreationFormStateCreating
  | TokenApiCreationFormStateLoading
  | TokenApiCreationFormStateError;

export type TokenApiCreationFormStateLoaded =
  | TokenApiCreationFormStateLoadedConfiguration
  | TokenApiCreationFormStateLoadedValidation
  | TokenApiCreationFormStateLoadedCreated;

export interface TokenApiCreationFormStateLoadedConfiguration {
  type: 'loaded';
  activeStep: 'configuration';
  values?: {
    name?: string;
    description?: string;
    expirationDuration?: ExpirationDuration;
    expirationDate?: string;
  };
  isMfaEnabled: boolean;
}

export interface TokenApiCreationFormStateLoadedValidation {
  type: 'loaded';
  activeStep: 'validation';
  isWaiting?: boolean;
  values?: {
    name?: string;
    description?: string;
    expirationDuration?: ExpirationDuration;
    expirationDate?: string;
    password?: string;
    mfaCode?: string;
  };
  credentialsError?: 'password' | 'mfaCode' | null;
  isMfaEnabled: boolean;
}

export interface TokenApiCreationFormStateCreating {
  type: 'creating';
  activeStep: 'validation';
  values?: {
    name?: string;
    description?: string;
    expirationDuration?: ExpirationDuration;
    expirationDate?: string;
    password?: string;
    mfaCode?: string;
  };
  isMfaEnabled: boolean;
  crendetialsError?: null;
}

export interface TokenApiCreationFormStateLoadedCreated {
  type: 'loaded';
  activeStep: 'created';
  isWaiting?: false;
  token: string;
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
