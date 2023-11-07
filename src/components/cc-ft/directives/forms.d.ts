import {Validation} from "../validation/validation";

export interface FieldDefinition {
  name: string;
  required: boolean;
  type: string;
  reset: any;
  validator: Validator;
  customErrorMessages: (code: string) => string;
}

export interface Validator {
  validate: (value: any) => Validation;
  getErrorMessage: (code: string) => string;
}
