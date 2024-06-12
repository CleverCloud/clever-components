import { App, AppStatus, Zone } from '../common.types.js';

export type HeaderAppState = HeaderAppStateLoaded | HeaderAppStateLoading | HeaderAppStateError;

export interface HeaderAppStateLoaded extends App {
  type: 'loaded';
  status: AppStatus;
  runningCommit?: string | null;
  startingCommit?: string | null;
  zone: Zone;
}

export interface HeaderAppStateLoading {
  type: 'loading';
}

export interface HeaderAppStateError {
  type: 'error';
}

export type LastUserAction = 'start'|'restart'|'cancel'|'stop';
