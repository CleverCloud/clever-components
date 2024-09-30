export type AddonBackupsState = AddonBackupsStateLoaded | AddonBackupsStateLoading | AddonBackupsStateError;

export interface AddonBackupsStateLoaded {
  type: 'loaded';
  backups: Backup[];
  providerId: ProviderId;
  passwordForCommand: string;
}

export interface AddonBackupsStateLoading {
  type: 'loading';
}

export interface AddonBackupsStateError {
  type: 'error';
}

export interface Backup {
  createdAt: string | number; // date as a string or timestamp
  expiresAt?: string | number; // date as a string or timestamp
  url: string;
  restoreCommand?: string;
  deleteCommand?: string;
}

export type OverlayType = 'restore' | 'delete';

export type ProviderId =
  | 'es-addon'
  | 'es-addon-old'
  | 'postgresql-addon'
  | 'mysql-addon'
  | 'mongodb-addon'
  | 'redis-addon'
  | 'jenkins';
