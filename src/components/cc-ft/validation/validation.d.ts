export type ValidationErrorCode = 'empty' | 'badType' | 'badEmail' | 'rangeUnderflow' | 'rangeOverflow';

export type Validation = ValidValidation | InvalidValidation;

export interface ValidValidation {
  valid: true;
}

export interface InvalidValidation {
  valid: false;
  code: ValidationErrorCode;
}
