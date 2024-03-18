export type InputData = null | File | string | FormData;

export interface IFormHelper<InputName extends string, ErrorCode, State> {
  reset();
  get state(): State;
  setState(state: State);
  beginTransaction(): FormTransaction<InputName, ErrorCode, State>;
}

export interface FormTransaction<InputName extends string, ErrorCode, State> {
  setState(state: State): FormTransaction<InputName, ErrorCode, State>;
  addError(inputName: InputName, error: ErrorCode): FormTransaction<InputName, ErrorCode, State>;
  commit(): Promise<void>;
}

