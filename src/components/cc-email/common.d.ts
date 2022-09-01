//---------- MAIN STATE

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

// an object holding a state (typically a web component for which we have a smart component above)
export interface StateHolder<T> {
  state: State<T>;
}

// factory that helps create states
export interface StateFactory<T> {
  loading: () => Loading;
  error: () => Error;
  data: (data: T) => Result<T>;
}

// helper for mutating the state of a StateHolder
export interface StateMutator<T> {
  loading: () => void;
  error: () => void;
  data: (data: T | ((d:T) => T)) => void;
}


// a helper which will help for changing state, inspecting data and create some inner state helpers.
export interface StateHelper<T> {
  component: StateHolder<T>;
  mutator: StateMutator<T>;
  getDataAt: (path: string) => any|undefined;
  getData: () => T|undefined;
  createInnerStateHelper: <D, S>(path: string) => InnerStateHelper<D, S>;
  createInnerListStateHelper: <D, S>(path: string) => InnerListStateHelper<D, S>;
}


//---------- INNER STATE


// an inner state enumeration + a standard 'idle' state. 'idle' means a state where nothing happens. S should be a list of actions that can occur.
export type InnerStateType<S> = S | 'idle';
// the inner state is compound one state and some data
export interface InnerState<T, S> {
  state: InnerStateType<S>,
  data: T,
}

// a helper that will help creating, getting and setting state and data
export interface InnerStateHelper<T, S> {
  create: (data: T, state?: InnerStateType<S>) => InnerState<T, S>;
  get: () => InnerState<T, S>;
  getData: () => T;
  getState: () => InnerStateType<S>;
  set: (data: T, state?: InnerStateType<S>) => void;
  setData: (data: T) => void;
  setState: (state: InnerStateType<S>) => void;
  resetState: () => void;
}

// a type for pointing an item in a list
export type IndexOrPredicate<T> = number | ((data:T) => boolean);

// a helper that will help creating list of inner states, adding, removing and modifying inner states
export interface InnerListStateHelper<T, S> {
  create: (data: Array<T>, state?: InnerStateType<S>) => Array<InnerState<T, S>>;
  forItem: (indexOrPredicate: IndexOrPredicate<T>) => InnerStateHelper<T, S>;
  remove: (indexOrPredicate: IndexOrPredicate<T>) => void;
  // todo: add() method may be useful
}