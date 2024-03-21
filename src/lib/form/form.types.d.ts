import { Validation } from "../validation/validation.types";
import { EventWithTarget } from "../events.types";

export type InputData = null | File | string | FormData;

export interface FormTransaction<InputName extends string, ErrorCode, State> {
  setState(state: State): FormTransaction<InputName, ErrorCode, State>;
  addError(inputName: InputName, error: ErrorCode): FormTransaction<InputName, ErrorCode, State>;
  commit(): Promise<void>;
}

export interface NativeInputElement extends HTMLInputElement {
  name: string;
  setCustomValidity(error: string): void;
  readonly willValidate: boolean;
  checkValidity(): boolean;
  reportValidity(): boolean;
  readonly validationMessage: string;
  readonly validity: ValidityState;
}

export type HTMLFormElementEvent = EventWithTarget<HTMLFormElement>;

export type FormValidation = Array<{
  name: string;
  validation: Validation;
}>;
