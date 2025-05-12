export type TokenApiCreationFormState =
  | TokenApiCreationFormStateLoaded
  | TokenApiCreationFormStateCreating
  | TokenApiCreationFormStateLoading
  | TokenApiCreationFormStateError;

export type TokenApiCreationFormStateLoaded =
  | TokenApiCreationFormStateLoadedConfiguration
  | TokenApiCreationFormStateLoadedValidation
  | TokenApiCreationFormStateLoadedCopy;

export interface TokenApiCreationFormStateLoadedConfiguration {
  type: 'loaded';
  activeStep: 'configuration';
  values: FormValues;
  isMfaEnabled: boolean;
}

export interface TokenApiCreationFormStateLoadedValidation {
  type: 'loaded';
  activeStep: 'validation';
  values: FormValues;
  credentialsError?: 'password' | 'mfaCode' | null;
  isMfaEnabled: boolean;
}

export interface TokenApiCreationFormStateCreating {
  type: 'creating';
  activeStep: 'validation';
  values: FormValues;
  isMfaEnabled: boolean;
  crendetialsError?: null;
}

export interface TokenApiCreationFormStateLoadedCopy {
  type: 'loaded';
  activeStep: 'copy';
  token: string;
  /*
   * MFA status must be provided because the validation form is still visible during the transition from the 'validation' to 'copy' step
   * We don't want the form to go from password only to password + 2FA code or vice-versa
   */
  isMfaEnabled: boolean;
  /* Form values must be provided because they are visible during the transition from the 'validation' to 'copy' step */
  values: FormValues;
}

export interface TokenApiCreationFormStateLoading {
  type: 'loading';
}

export interface TokenApiCreationFormStateError {
  type: 'error';
}

export type ExpirationDuration = 'seven-days' | 'thirty-days' | 'sixty-days' | 'ninety-days' | 'one-year' | 'custom';

export interface FormValues {
  name: string;
  description: string;
  expirationDuration: ExpirationDuration;
  expirationDate: string;
  password: string;
  mfaCode: string;
}
