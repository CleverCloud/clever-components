export interface BackupDetails {
  providerId: string;
  passwordForCommand: string;
  list: Backup[];
}

export interface Backup {
  createdAt: Date;
  expiresAt: Date
  url: string;
  restoreCommand?: string;
  deleteCommand?: string;
}

export type OverlayType = "restore" | "delete";
