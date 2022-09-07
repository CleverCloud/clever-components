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
