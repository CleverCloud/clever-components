import {InnerState, State} from "./common";

export type CcEmailState = State<CcEmailData>;

export interface CcEmailData {
  primary: InnerState<EmailAddress, PrimaryState>;
  secondaryAddresses: InnerState<EmailAddress, SecondaryState>[];
}

export type PrimaryState = 'sending-confirmation-email'
export type SecondaryState = 'marking-as-primary' | 'deleting'

export interface EmailAddress {
  address: string;
  verified: boolean;
}

export type FormError = 'empty'|'invalid'|'already-defined'|'used';
export interface FormData {
  input: string;
  error?: FormError;
}

export interface FormIdle {
  type: 'idle',
  input: string,
  error?: FormError,
}
export interface FormBusy<A> {
  type: A,
  input: string,
}
export type FormState = FormIdle | FormBusy<'adding'>;
