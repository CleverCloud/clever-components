export type EmailsState = EmailsStateLoading | EmailsStateLoaded | EmailsStateErrorLoading;

interface EmailsStateLoading {
  state: 'loading';
}

interface EmailsStateLoaded {
  state: 'loaded';
  primary: PrimaryEmailAddressState;
  secondary: SecondaryEmailAddressState[];
}

interface EmailsStateErrorLoading {
  state: 'error-loading';
}

// TODO technically, 'sending-confirmation' can only happen when verified is false
export interface PrimaryEmailAddressState {
  state: 'idle' | 'sending-confirmation';
  address: string;
  verified: boolean;
}

export interface SecondaryEmailAddressState {
  state: 'idle' | 'marking-as-primary' | 'deleting';
  address: string;
  // Do we have this in the API ?
  // verified: boolean;
}

export interface NewEmailFormState {
  state: 'idle' | 'adding';
  address: EmailFormField;
}

interface EmailFormField {
  value: string;
  error?: 'empty' | 'invalid' | 'already-defined' | 'used';
}

// We could also flatten the field as there's only one value but not very future proof

// OR THIS BUT IT'S TOO VERBOSE FOR NOTHING

// export type EmailFormField = EmailFormFieldIdle | EmailFormFieldError;
//
// interface EmailFormFieldIdle {
//   state: 'idle';
//   value: string;
// }
//
// interface EmailFormFieldError {
//   state: 'error';
//   value: string;
//   error: 'empty' | 'invalid' | 'already-defined' | 'used';
// }

//
//
//
//
//
//
//
//
//
//
//
//
//
//

// import {InnerState, State} from "./common";
//
// export type CcEmailState = State<CcEmailData>;
//
// export interface CcEmailData {
//   primary: InnerState<EmailAddress, PrimaryState>;
//   secondaryAddresses: InnerState<EmailAddress, SecondaryState>[];
// }
//
// export type PrimaryState = 'sending-confirmation-email'
// export type SecondaryState = 'marking-as-primary' | 'deleting'
//
// export interface EmailAddress {
//   address: string;
//   verified: boolean;
// }
//
// export type FormError = 'empty'|'invalid'|'already-defined'|'used';
// export interface FormData {
//   input: string;
//   error?: FormError;
// }
//
// export interface FormIdle {
//   type: 'idle',
//   input: string,
//   error?: FormError,
// }
// export interface FormBusy<A> {
//   type: A,
//   input: string,
// }
// export type FormState = FormIdle | FormBusy<'adding'>;
