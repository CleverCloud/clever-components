export type OauthConsumerFormState =
  | OauthConsumerFormStateIdleCreate
  | OauthConsumerFormStateCreating
  | OauthConsumerFormStateIdleUpdate
  | OauthConsumerFormStateUpdating
  | OauthConsumerFormStateDeleting
  | OauthConsumerFormStateLoading
  | OauthConsumerFormStateError;

export interface OauthConsumerFormStateIdleCreate {
  type: 'idle-create';
}

export interface OauthConsumerFormStateCreating {
  type: 'creating';
}

export interface OauthConsumerFormStateIdleUpdate extends OauthConsumer {
  type: 'idle-update';
}

export interface OauthConsumerFormStateUpdating extends OauthConsumer {
  type: 'updating';
}

export interface OauthConsumerFormStateDeleting extends OauthConsumer {
  type: 'deleting';
}

export interface OauthConsumerFormStateLoading {
  type: 'loading';
}

export interface OauthConsumerFormStateError {
  type: 'error';
}

export interface OauthConsumer {
  name: string;
  homePageUrl: string;
  appBaseUrl: string;
  description: string;
  image: string;
  rights: Array<OauthConsumerRight>;
}

export interface OauthConsumerRight {
  name: string;
  isEnabled: boolean;
}
