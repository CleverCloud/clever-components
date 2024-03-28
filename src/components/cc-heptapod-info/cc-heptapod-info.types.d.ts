export type HeptapodInfoState = HeptapodInfoStateLoaded | HeptapodInfoStateLoading | HeptapodInfoStateError | HeptapodInfoStateNotUsed;

interface Statistics {
  privateActiveUsers: number;
  publicActiveUsers: number;
  storage: number;
  price: number;
}

interface HeptapodInfoStateLoaded {
  type : 'loaded';
  statistics: Statistics;
}

interface HeptapodInfoStateLoading {
  type : 'loading';
}

interface HeptapodInfoStateError {
  type : 'error';
}

interface HeptapodInfoStateNotUsed{
  type : 'not-used';
}


