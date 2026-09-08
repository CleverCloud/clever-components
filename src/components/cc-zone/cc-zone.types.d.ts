import { Zone } from '@clevercloud/client/cc-api-commands/zone/zone.types.js';

export type ZoneState = ZoneStateLoaded | ZoneStateLoading;

export interface ZoneStateLoaded extends Zone {
  type: 'loaded';
}

export interface ZoneStateLoading {
  type: 'loading';
}

export type ZoneModeType = 'default' | 'small' | 'small-infra';
