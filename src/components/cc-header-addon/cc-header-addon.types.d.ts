import { Addon, Zone } from '../common.types.js';

export type HeaderAddonState =
  | HeaderAddonStateLoaded
  | HeaderAddonStateLoadedWithVersion
  | HeaderAddonStateLoading
  | HeaderAddonStateError;

export interface HeaderAddonStateLoaded extends Addon {
  type: 'loaded';
  hasVersion: false;
  zone: Zone;
}

export interface HeaderAddonStateLoadedWithVersion extends Addon {
  type: 'loaded';
  hasVersion: true;
  version: string;
  zone: Zone;
}

export interface HeaderAddonStateLoading {
  type: 'loading';
  hasVersion: boolean;
}

export interface HeaderAddonStateError {
  type: 'error';
  hasVersion: boolean;
}
