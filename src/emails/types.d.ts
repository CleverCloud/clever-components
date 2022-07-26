export type CcEmailState = 'loading' | 'loaded' | 'error-loading'

export interface CcEmailData {
  primary:PrimaryEmailAddress;
  secondary:SecondaryEmailAddresses;
}

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
