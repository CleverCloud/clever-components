import { ErrorMessage, Validator } from "../lib/validation/validation.types";

export interface WithElementInternalsSettings {
  valuePropertyName: string;
  resetValuePropertyName?: string;
  formDataProvider?: Provider<File | string | FormData | null>;
  inputSelector: string;
  errorSelector?: string;
  validationSettingsProvider?: Provider<ValidationSettings>;
  reactiveValidationProperties?: string[];
}

export interface ValidationSettings {
  errorMessages: {[code: string]: ErrorMessage};
  validator: Validator;
}

type Provider<T> = () => T;