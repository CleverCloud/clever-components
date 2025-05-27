export type TokenApiUpdateFormState =
  | TokenApiUpdateFormStateLoading
  | TokenApiUpdateFormStateError
  | TokenApiUpdateFormStateLoaded
  | TokenApiUpdateFormStateUpdating;

export interface TokenApiUpdateFormStateLoading {
  type: 'loading';
}

export interface TokenApiUpdateFormStateError {
  type: 'error';
}

type FormValues = {
  name: string;
  description?: string;
};

export interface TokenApiUpdateFormStateLoaded {
  type: 'loaded';
  values: FormValues;
}

export interface TokenApiUpdateFormStateUpdating {
  type: 'updating';
  values: FormValues;
}

export type CcTokenChangePayload = Required<FormValues>;
