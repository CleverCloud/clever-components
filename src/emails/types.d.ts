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
  secondary:SecondaryEmailAddresses;
}

export interface PrimaryEmailAddress {
  state?: 'sending-confirmation-email';
  address: EmailAddress;
}

export interface SecondaryEmailAddresses {
  state?: 'adding';
  addresses: SecondaryEmailAddress[];
}

export interface SecondaryEmailAddress {
  state?: 'marking-as-primary' | 'deleting';
  address: EmailAddress;
}

export interface EmailAddress {
  value: string;
  verified: boolean;
}
