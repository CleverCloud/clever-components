import { ZoneItem } from '../cc-ct-zone-select/cc-ct-zone-select.types.js';

export type ZoneListState = ZoneListStateLoaded | ZoneListStateLoading | ZoneListStateError;

export interface ZoneListStateLoaded {
  type: 'loaded';
  zoneItems: Array<ZoneItem>;
}

export interface ZoneListStateLoading {
  type: 'loading';
}

export interface ZoneListStateError {
  type: 'error';
}

