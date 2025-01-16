//# region state
interface EmailListStateLoading {
  type: 'loading';
}

interface EmailListStateError {
  type: 'error';
}

interface EmailListStateLoaded {
  type: 'loaded';
  emailList: EmailList;
}

export type EmailListState = EmailListStateLoading | EmailListStateError | EmailListStateLoaded;
//#endregion

//#region data model
interface EmailList {
  primaryAddress: PrimaryAddressState;
  secondaryAddresses: SecondaryAddressState[];
}

export interface PrimaryAddressState extends EmailAddress {
  type: 'idle' | 'sending-confirmation-email';
}

export interface SecondaryAddressState extends EmailAddress {
  type: 'idle' | 'marking-as-primary' | 'deleting';
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
