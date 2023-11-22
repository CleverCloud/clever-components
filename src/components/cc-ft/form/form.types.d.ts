import { Validator, Validation } from "../validation/validation.types.js";

export interface FieldDefinition {
  name: string;
  required: boolean;
  type: string;
  reset: any;
  validator?: Validator;
  customErrorMessages?: (code: string) => string;
}

export type FormState = 'idle' | 'submitting';

export type FormValidation = FormValidationValid | FormValidationInvalid;

export interface FormValidationValid {
  valid: true;
}

export interface FormValidationInvalid {
  valid: false;
  fields: {[fieldName: string]: Validation};
}

export interface InputIO {
  valueProperty: string;
  bindEventName: string;
  submitEventName?: string;
}
