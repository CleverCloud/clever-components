import { EnvVarValidationMode, Variable } from "../common.types";

type EnvVarEditorSimpleState = EnvVarEditorSimpleStateLoading | EnvVarEditorSimpleStateLoaded;

interface EnvVarEditorSimpleStateLoading {
  type: 'loading';
}

interface EnvVarEditorSimpleStateLoaded {
  type: 'loaded';
  validationMode: EnvVarValidationMode;
  variables: Array<Variable>;
}
