interface BackupDetails {
  providerId: string;
  passwordForCommand: string;
  list: Backup[];
}

interface Backup {
  createdAt: Date;
  expiresAt: Date
  url: string;
  restoreCommand?: string;
  deleteCommand?: string;
}

type OverlayType = "restore" | "delete";
