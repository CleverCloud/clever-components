import { EnvVar, EnvVarValidationMode } from '../common.types.js';

export type EnvVarFormState =
  | EnvVarFormStateLoading
  | EnvVarFormStateLoaded
  | EnvVarFormStateSaving
  | EnvVarFormStateError;

export interface EnvVarFormStateLoading {
  type: 'loading';
}

export interface EnvVarFormStateLoaded {
  type: 'loaded';
  variables: Array<EnvVar>;
  validationMode: EnvVarValidationMode;
}

export interface EnvVarFormStateSaving {
  type: 'saving';
  variables: Array<EnvVar>;
  validationMode: EnvVarValidationMode;
}

export interface EnvVarFormStateError {
  type: 'error';
}

type EnvVarFormContextType = 'env-var-app' | 'env-var-simple' | 'env-var-addon' | 'exposed-config' | 'config-provider';

export type EnvVarFormMode = 'SIMPLE' | 'EXPERT' | 'JSON';
