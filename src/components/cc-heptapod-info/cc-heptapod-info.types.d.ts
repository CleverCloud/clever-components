export type HeptapodInfoState =
  | HeptapodInfoStateLoaded
  | HeptapodInfoStateLoading
  | HeptapodInfoStateError
  | HeptapodInfoStateNotUsed;

export interface HeptapodInfoStateLoaded {
  type: 'loaded';
  statistics: Statistics;
}

export interface HeptapodInfoStateLoading {
  type: 'loading';
}

export interface HeptapodInfoStateError {
  type: 'error';
}

export interface HeptapodInfoStateNotUsed {
  type: 'not-used';
}

export interface Statistics {
  privateActiveUsers: number;
  publicActiveUsers: number;
  storage: number;
  price: number;
}
