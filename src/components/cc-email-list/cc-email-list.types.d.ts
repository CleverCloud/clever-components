//# region state
interface EmailListStateLoading {
  state: 'loading';
}

interface EmailListStateError {
  state: 'error';
}

interface EmailListStateLoaded {
  state: 'loaded';
  value: EmailList;
}

export type EmailListState = EmailListStateLoading | EmailListStateError | EmailListStateLoaded;
//#endregion

//#region data model
interface EmailList {
  primaryAddress: PrimaryAddressState;
  secondaryAddresses: SecondaryAddressState[];
}

export interface PrimaryAddressState extends EmailAddress {
  state: 'idle' | 'sending-confirmation-email';
}

export interface SecondaryAddressState extends EmailAddress {
  state: 'idle' | 'marking-as-primary' | 'deleting';
}

interface EmailAddress {
  address: string;
  verified: boolean;
}
//#endregion

export interface AddEmailFormState {
  type: 'idle' | 'adding';
  errors?: {
    email: AddEmailError;
  };
}

export type AddEmailError = 'invalid' | 'already-defined' | 'used';
