import { Zone } from '@clevercloud/client/cc-api-commands/zone/zone.types.js';
import { MapPoint } from '../cc-map/cc-map.types.js';
import { ZoneModeType, ZoneStateLoaded } from '../cc-zone/cc-zone.types.js';

export type ZoneInputState = ZoneInputStateLoaded | ZoneInputStateLoading | ZoneInputStateError;

export interface ZoneInputStateLoaded {
  type: 'loaded';
  zones: Zone[];
}

export interface ZoneInputStateLoading {
  type: 'loading';
}

export interface ZoneInputStateError {
  type: 'error';
}

export interface ZoneInputPoint extends MapPoint {
  marker: { tag: 'cc-map-marker-server'; state: ZonePointMarkerState; keyboard: false };
  tooltip: { tag: 'cc-zone'; state: ZoneStateLoaded; mode: ZoneModeType };
}

export type ZonePointMarkerState = 'selected' | 'hovered' | 'default';
