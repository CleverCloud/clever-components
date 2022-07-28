export interface Loading {
  type: 'loading',
}

export interface Error {
  type: 'error',
}

export interface Result<T> {
  type: 'loaded',
  data: T
}

export type State<T> = Loading | Error | Result<T>;

export interface StateMutator<D> {
  loading: () => void;
  error: () => void;
  data: (data: D | ((d:D) => D)) => void;
}

export interface StateFactory<D> {
  loading: () => Loading;
  error: () => Error;
  data: (data: D) => Result<D>;
}