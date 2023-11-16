import { Validator } from "../validation/validation.types.js";

export interface FieldDefinition {
  name: string;
  required: boolean;
  type: string;
  reset: any;
  validator: Validator;
  customErrorMessages: (code: string) => string;
}

export type FormState = 'idle' | 'submitting';

export interface FormValidation {
  valid: boolean;
  fields: Array<FormFieldValidation>;
}

export interface FormFieldValidation {
  fieldName: string;
  element: HTMLElement;
  value: any;
  valid: boolean;
  error: string;
}

export interface InputIO {
  valueProperty: string;
  bindEventName: string;
  submitEventName?: string;
}
