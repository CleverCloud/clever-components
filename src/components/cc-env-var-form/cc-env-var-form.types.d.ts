import { EnvVarValidationMode, Variable } from "../common.types";

export type EnvVarFormState = EnvVarFormStateLoading | EnvVarFormStateLoaded | EnvVarFormStateSaving | EnvVarFormStateError;

interface EnvVarFormStateLoading {
  type: 'loading';
}

interface EnvVarFormStateLoaded {
  type: 'loaded';
  variables: Array<Variable>;
  validationMode: EnvVarValidationMode;
}

interface EnvVarFormStateSaving {
  type: 'saving';
  variables: Array<Variable>;
  validationMode: EnvVarValidationMode;
}

interface EnvVarFormStateError {
  type: 'error';
}

type EnvVarFormContextType = "env-var" | "env-var-simple" | "env-var-addon" | "exposed-config" | "config-provider";
