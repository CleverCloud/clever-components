export interface Loading {
  type: 'loading',
}

export interface Error<E> {
  type: 'error',
  error: E,
}

export interface Result<T> {
  type: 'loaded',
  data: T
}

export type CcEmailState = Loading | Error<'loading'> | Result<CcEmailData>;



export interface CcEmailData {
  primary:PrimaryEmailAddress;
  secondaryAddresses:SecondaryEmailAddress[];
}

export interface PrimaryEmailAddress {
  state?: 'sending-confirmation-email';
  address: EmailAddress;
}

export interface SecondaryEmailAddress {
  state?: 'marking-as-primary' | 'deleting';
  address: EmailAddress;
}

export interface EmailAddress {
  value: string;
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
