export type ContextRedirectionType = "user" | "admin";

export type RedirectionFormState =
  RedirectionFormStateLoading
  | RedirectionFormStateLoaded
  | RedirectionFormStateWaiting;

interface RedirectionFormStateLoading {
  state: 'loading';
}

interface RedirectionFormStateLoaded {
  state: 'loaded';
  value: RedirectionState[];
}

interface RedirectionFormStateWaiting {
  state: 'error-loading';
}

export type RedirectionState = RedirectionStateLoading | RedirectionStateLoaded | RedirectionStateWaiting;

interface RedirectionStateLoading {
  state: 'loading';
}

interface RedirectionStateLoaded {
  state: 'loaded';
  namespace: string;
  private: boolean;
  sourcePort?: number;
}

interface RedirectionStateWaiting {
  state: 'waiting';
  namespace: string;
  private: boolean;
  sourcePort?: number;
}
