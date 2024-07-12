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
  createdAt: Date;
  expiresAt?: Date;
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
