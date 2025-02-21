export interface OptionSchema {
  format: string;
  defaultValue?: RawValue;
  optional: boolean;
  secret?: boolean;
  tags?: Array<string>;
  documentation: Doc;
}

export interface Validator {
  validate(value: RawValue): ValidationError | ValidationSuccess;
  documentation: Doc;
}

export type ValidationError = { type: 'error'; message: string };
export type ValidationSuccess = { type: 'success'; value: any };

export type Doc = string | Record<string, string>;

export type RawValue = string | number | boolean;

export interface ValueSource {
  source: string;
  schema: OptionSchema;
  value: any;
}
