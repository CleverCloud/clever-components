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

export interface TokenApiUpdateFormStateLoaded {
  type: 'loaded';
  values: {
    name: string;
    description?: string;
  };
}

export interface TokenApiUpdateFormStateUpdating {
  type: 'updating';
  values: {
    name: string;
    description?: string;
  };
}

export type CcTokenChangePayload = Required<TokenApiUpdateFormStateLoaded['values']>;
