import { ZoneModeType, ZoneStateLoaded } from '../cc-zone/cc-zone.types.js';
import { Point, Zone } from '../common.types.js';

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

// FIXME: the `Point` type has a different type for `marker` & `tooltip` properties
// maybe we could add this as an alternative within the original `Point` interface?
export interface ZoneInputPoint extends Omit<Point, 'tooltip' | 'marker'> {
  marker: { tag: 'cc-map-marker-server'; state: ZonePointMarkerState; keyboard: false };
  tooltip: { tag: 'cc-zone'; state: ZoneStateLoaded; mode: ZoneModeType };
}

export type ZonePointMarkerState = 'selected' | 'hovered' | 'default';
