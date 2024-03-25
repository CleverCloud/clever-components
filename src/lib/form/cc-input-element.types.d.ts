import { ErrorMessageMap, Validator } from "./validation.types";
import { InputData } from "./form.types";

export interface InputElementSettings {
  valuePropertyName: string;
  resetValuePropertyName?: string;
  inputDataProvider?: Provider<InputData>;
  inputSelector: string;
  errorSelector?: string;
  validationSettingsProvider?: Provider<ValidationSettings>;
  reactiveValidationProperties?: string[];
}

export interface ValidationSettings {
  errorMessages: ErrorMessageMap;
  validator: Validator;
}

type Provider<T> = () => T;
