export type Validity = ValidValidity | InvalidValidity;

export interface ValidValidity {
  valid: true;
}

export interface InvalidValidity {
  valid: false;
  code: string;
}

export interface Validator {
  validate(value: any, formData?: Object): Validity;
}

export type ErrorMessage = null | string | Node;

export type ErrorMessageMap = { [code: string]: ErrorMessage | (() => ErrorMessage) };
