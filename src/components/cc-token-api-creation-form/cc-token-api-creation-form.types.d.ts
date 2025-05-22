export type TokenApiCreationFormState =
  | TokenApiCreationFormStateLoaded
  | TokenApiCreationFormStateCreating
  | TokenApiCreationFormStateLoading
  | TokenApiCreationFormStateError;

export type TokenApiCreationFormStateLoaded =
  | TokenApiCreationFormStateLoadedConfiguration
  | TokenApiCreationFormStateLoadedValidation
  | TokenApiCreationFormStateLoadedCopy;

export interface TokenApiCreationFormStateLoadedConfiguration extends FormValuesAndMfaStatus {
  type: 'loaded';
  activeStep: 'configuration';
}

export interface TokenApiCreationFormStateLoadedValidation extends FormValuesAndMfaStatus {
  type: 'loaded';
  activeStep: 'validation';
  credentialsError?: 'password' | 'mfaCode' | null;
}

export interface TokenApiCreationFormStateCreating extends FormValuesAndMfaStatus {
  type: 'creating';
  activeStep: 'validation';
  credentialsError?: null;
}

/*
 * MFA status must be provided because the validation form is still visible during the transition from the 'validation' to 'copy' step
 * We don't want the form to go from password only to password + 2FA code or vice-versa
 * Form values must be provided because they are visible during the transition from the 'validation' to 'copy' step
 */
export interface TokenApiCreationFormStateLoadedCopy extends FormValuesAndMfaStatus {
  type: 'loaded';
  activeStep: 'copy';
  token: string;
}

export interface TokenApiCreationFormStateLoading {
  type: 'loading';
}

export interface TokenApiCreationFormStateError {
  type: 'error';
}

export type Expiration = ExpirationPreset | ExpirationCustom;

export interface ExpirationPreset {
  type: 'preset';
  preset: 'seven-days' | 'thirty-days' | 'sixty-days' | 'ninety-days' | 'one-year';
}

export interface ExpirationCustom {
  type: 'custom';
  /** ISO format */
  date: string;
}

interface FormValuesAndMfaStatus {
  values: FormValues;
  isMfaEnabled: boolean;
}

export interface FormValues {
  name: string;
  description: string;
  expiration: Expiration;
  password: string;
  mfaCode: string;
}

export interface NewToken {
  name: string;
  description: string;
  /** ISO format */
  expirationDate: string;
  password: string;
  mfaCode: string;
}

type ExpirationDurationOptions = ExpirationPreset['preset'] | ExpirationCustom['type'];
