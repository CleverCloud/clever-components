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

interface PrimaryAddressState extends EmailAddress {
  state: 'idle' | 'sending-confirmation-email';
}

interface SecondaryAddressState extends EmailAddress {
  state: 'idle' | 'marking-as-primary' | 'deleting';
}

interface EmailAddress {
  address: string;
  verified: boolean;
}
//#endregion

//#region add form
export interface AddEmailFormState {
  state: 'idle' | 'adding';
  address: AddressFormField;
}

interface AddressFormField {
  value: string;
  error?: AddressFormFieldError;
}

type AddressFormFieldError = 'empty' | 'invalid' | 'already-defined' | 'used';
//#endregion
