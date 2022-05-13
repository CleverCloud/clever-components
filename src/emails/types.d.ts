export type PrimaryModelErrorType = "sendingConfirmationEmail";
export type PrimaryModelStateType = "sendingConfirmationEmail";

export type SecondaryModelErrorType = "adding";
export type SecondaryModelStateType = "adding";

export type SecondaryAddressErrorType = "markingAsPrimary" | "deleting";
export type SecondaryAddressStateType = "markingAsPrimary" | "deleting";

export interface EmailModel {
  primary: null | 'loadingError' | PrimaryModel;
  secondary: null | 'loadingError' | SecondaryModel;
}

export interface PrimaryModel {
  address: EmailAddress;
  state: PrimaryModelStateType;
  error: PrimaryModelErrorType;
}

export interface SecondaryModel {
  addresses: SecondaryAddressModel[];
  state: SecondaryModelStateType;
  error: SecondaryModelErrorType;
}

export interface SecondaryAddressModel {
  address: EmailAddress;
  state: SecondaryAddressStateType;
  error: SecondaryAddressErrorType;
}


export interface EmailAddress {
  value: string;
  verified: boolean;
}
