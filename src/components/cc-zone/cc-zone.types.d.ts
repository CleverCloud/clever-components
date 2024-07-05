import { Zone } from '../common.types.js';

export type ZoneState = ZoneStateLoaded | ZoneStateLoading;

export interface ZoneStateLoaded extends Zone {
  type: 'loaded';
}

export interface ZoneStateLoading {
  type: 'loading';
}

export type ZoneModeType = 'default' | 'small' | 'small-infra';
