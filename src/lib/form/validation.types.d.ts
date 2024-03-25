export type Validation = ValidValidation | InvalidValidation;

export interface ValidValidation {
  valid: true;
}

export interface InvalidValidation {
  valid: false;
  code: string;
}

export interface Validator {
  validate(value: any, formData?: Object): Validation;
}

export type ErrorMessage = null | string | Node;

export type ErrorMessageMap = {[code: string]: ErrorMessage | (() => ErrorMessage)};

export interface CompositeValidatorsBuilder {
  add(validator: Validator): CompositeValidatorsBuilder;
  build(): Validator;
}
