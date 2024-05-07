export type RequestsData = [
  number, // Start timestamp in milliseconds. Expected to be rounded to the hour of its respective TZ.
  number, // End timestamp in milliseconds. Expected to be rounded to the hour of its respective TZ.
  number, // Number of request during this time window.
]

export type TileRequestsState = TileRequestsStateLoaded | TileRequestsStateLoading | TileRequestsStateError;

export interface TileRequestsStateLoaded {
  type: 'loaded';
  data: Array<RequestsData>;
}

export interface TileRequestsStateLoading  {
  type: 'loading';
}

export interface TileRequestsStateError {
  type: 'error';
}
