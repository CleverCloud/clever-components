export type OauthConsumerState = OauthConsumerStateLoading | OauthConsumerStateError | OauthConsumerStateLoaded;

interface OauthConsumerStateLoading {
  type: 'loading';
}

interface OauthConsumerStateError {
  type: 'error';
}

interface OauthConsumerStateLoaded {
  type: 'loaded';
  name: string;
  homePageUrl: string;
  appBaseUrl: string;
  description: string;
  image: string;
  rights: Array<Right>;
  key: string;
  secret: string;
}

interface Right {
  value: string;
  isEnable: boolean;
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
