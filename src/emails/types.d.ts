export type PrimaryModelErrorType = "sendingConfirmationEmail";
export type PrimaryModelStateType = "sendingConfirmationEmail";

export type SecondaryModelErrorType = "adding";
export type SecondaryModelStateType = "adding";

export type SecondaryAddressErrorType = "markingAsPrimary" | "deleting";
export type SecondaryAddressStateType = "markingAsPrimary" | "deleting";

export interface GenericModel<S, E> {
  state: S;
  error: E;
}

export interface EmailAddressModel<S, E> extends GenericModel<S, E> {
  address: EmailAddress;
}

export interface EmailModel {
  primaryModel: null | 'loadingError' | PrimaryModel;
  secondaryModel: null | 'loadingError' | SecondaryModel;
}

export interface PrimaryModel extends EmailAddressModel<PrimaryModelStateType, PrimaryModelErrorType> {
}

export interface EmailAddress {
  value: string;
  verified: boolean;
}

export interface SecondaryModel extends GenericModel<SecondaryModelStateType, SecondaryModelErrorType> {
  addresses: EmailAddressModel<SecondaryAddressStateType, SecondaryAddressErrorType>[];
}