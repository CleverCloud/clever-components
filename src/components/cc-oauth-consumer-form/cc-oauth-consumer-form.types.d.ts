export type OAuthConsumerFormState =
  | OAuthConsumerFormStateIdleCreate
  | OAuthConsumerFormStateCreating
  | OAuthConsumerFormStateIdleUpdate
  | OAuthConsumerFormStateUpdating
  | OAuthConsumerFormStateDeleting
  | OAuthConsumerFormLoading
  | OAuthConsumerFormStateError;

export interface OAuthConsumerFormStateIdleCreate {
  type: 'idle-create';
}

export interface OAuthConsumerFormStateCreating {
  type: 'creating';
}

export interface OAuthConsumerFormStateIdleUpdate {
  type: 'idle-update';
  values?: {
    name: string;
    homePageUrl: string;
    appBaseUrl: string;
    description: string;
    image: string;
    rights: Array<Right>;
  };
}

export interface OAuthConsumerFormStateUpdating {
  type: 'updating';
  values?: {
    name: string;
    homePageUrl: string;
    appBaseUrl: string;
    description: string;
    image: string;
    rights: Array<Right>;
  };
}

export interface OAuthConsumerFormStateDeleting {
  type: 'deleting';
  values?: {
    name: string;
    homePageUrl: string;
    appBaseUrl: string;
    description: string;
    image: string;
    rights: Array<Right>;
  };
}

export interface OAuthConsumerFormLoading {
  type: 'loading';
}

export interface OAuthConsumerFormStateError {
  type: 'error';
}

export interface NewOauthConsumer {
  name: string;
  homePageUrl: string;
  appBaseUrl: string;
  description: string;
  image: string;
  rights: Array<Right>;
}

interface Right {
  value: string;
  isEnable: boolean;
}
