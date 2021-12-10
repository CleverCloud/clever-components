export type ContextType = "env-var" | "env-var-simple" | "env-var-addon" | "exposed-config";

export type ErrorType = "saving" | "loading";

export type EnvType = "addon" | "app";

export interface Service {
  name: string,
  variables?: Variable[],
}

export interface Variable {
  name: string,
  value: string,
}

export interface ParseError {
  line: number,
  msg: string,
}

export interface ParserOptions {
  mode: string,
}

export interface VariableName {
  name: string,
}
