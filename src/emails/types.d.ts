export type CcEmailState = 'loading' | 'loaded' | 'error-loading'

export interface PrimaryEmailAddress {
  state: null | 'sending-confirmation-email';
  address: EmailAddress;
}

export interface SecondaryEmailAddresses {
  state: null | 'adding';
  addresses: SecondaryEmailAddress[];
}

export interface SecondaryEmailAddress {
  state: null | 'marking-as-primary' | 'deleting';
  address: EmailAddress;
}

export interface EmailAddress {
  value: string;
  verified: boolean;
}


export interface Error {
  error: string;
}
export type Either<T,U> = T | U
export type Maybe<T> = Either<T, null>;
export type Async<T> = Either<T, 'loading'>;
export type Result<T> = Either<T, Error>;
export type State<T> = Async<Result<Maybe<T>>>;
//--
export type CcEmailState = State<{primary:PrimaryEmailAddress, secondary:SecondaryEmailAddresses}>;

