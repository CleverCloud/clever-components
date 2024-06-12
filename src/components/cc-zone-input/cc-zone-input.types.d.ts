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
  name: string;
  lat: number;             // Latitude
  lon: number;             // Longitude
  count?: number;          // Number of occurrences for this location (default: 1)
  delay?: number | string; // How long the point needs to stay (in ms), 'none' for a fixed point, (default: 1000)
  marker: { tag: 'cc-map-marker-server', state: ZonePointMarkerState, keyboard: false };
  tooltip: { tag: 'cc-zone', state: ZoneStateLoaded, mode: ZoneModeType };
  zIndexOffset: number;
}

export type ZonePointMarkerState = 'selected' | 'hovered' | 'default';
