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
  options: Array<Option>;
  key: string;
  secret: string;
}

interface Option {
  value: string;
  isEnable: boolean;
}
