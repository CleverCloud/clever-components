import { EnvVarValidationMode, Variable } from "../common.types";

type EnvVarEditorExpertState = EnvVarEditorExpertStateLoading | EnvVarEditorExpertStateLoaded;

interface EnvVarEditorExpertStateLoading {
  type: 'loading';
}

interface EnvVarEditorExpertStateLoaded {
  type: 'loaded';
  validationMode: EnvVarValidationMode;
  variables: Array<Variable>;
}
