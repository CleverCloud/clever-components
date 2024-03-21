import { ErrorMessageMap, Validator } from "../lib/validation/validation.types";
import { InputData } from "../lib/form/form.types";

export interface WithElementInternalsSettings {
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
