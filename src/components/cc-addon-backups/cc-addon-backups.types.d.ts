export type AddonBackupsState = AddonBackupsStateLoaded | AddonBackupsStateLoading | AddonBackupsStateError;

export interface Backup {
  createdAt: Date;
  expiresAt: Date
  url: string;
  restoreCommand?: string;
  deleteCommand?: string;
}

type OverlayType = "restore" | "delete";

interface AddonBackupsStateLoaded {
  type: 'loaded';
  backups: Backup[];
  providerId: ProviderId;
  passwordForCommand: string;
}

interface AddonBackupsStateLoading {
  type: 'loading';
}

interface AddonBackupsStateError {
  type: 'error';
}

export interface SkeletonBackupsData {
  providerId: 'skeleton';
  backups: [SkeletonBackup, SkeletonBackup, SkeletonBackup, SkeletonBackup, SkeletonBackup];
}

export interface SkeletonBackup {
  createdAt: Date;
  expiresAt: Date;
  url: '';
  deleteCommand: 'skeleton';
}

export type ProviderId = 'es-addon' | 'es-addon-old' | 'postgresql-addon' | 'mysql-addon' | 'mongodb-addon' | 'redis-addon' | 'jenkins';
