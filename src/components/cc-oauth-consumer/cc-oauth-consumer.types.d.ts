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
  rights: Array<OauthConsumerRight>;
  key: string;
  secret: string;
}

export interface OauthConsumerRight {
  name: string;
  isEnabled: boolean;
}
