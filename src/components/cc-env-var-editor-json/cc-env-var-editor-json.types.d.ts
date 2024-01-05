import { EnvVarValidationMode, Variable } from "../common.types";

export type EnvVarEditorJsonState = EnvVarEditorJsonStateLoading | EnvVarEditorJsonStateLoaded;

interface EnvVarEditorJsonStateLoading {
  type: 'loading';
}

interface EnvVarEditorJsonStateLoaded {
  type: 'loaded';
  validationMode: EnvVarValidationMode;
  variables: Array<Variable>;
}
