export type TileInstancesState = TileInstancesStateLoading | TileInstancesStateLoaded | TileInstancesStateError;

export interface TileInstancesStateLoading {
  type: 'loading';
}

export interface TileInstancesStateLoaded {
  type: 'loaded';
  running: Array<InstanceState>;
  deploying: Array<InstanceState>;
}

export interface TileInstancesStateError {
  type: 'error';
}

export interface InstanceState {
  flavorName: string;
  count: number;
}
