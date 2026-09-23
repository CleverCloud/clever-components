export type PostgresqlAdminState = PostgresqlAdminStateLoading | PostgresqlAdminStateError | PostgresqlAdminStateLoaded;

export interface PostgresqlAdminStateLoading {
  type: 'loading';
}

export interface PostgresqlAdminStateError {
  type: 'error';
}

export interface PostgresqlAdminStateLoaded {
  type: 'loaded';
  capabilities: PostgresqlCapabilities;
  connections: PostgresqlConnectionsState;
  readOnlyUsers: Array<PostgresqlReadOnlyUser>;
  /** The action currently being performed, `null` when the component is idle. */
  runningAction: PostgresqlAdminAction | null;
}

export type PostgresqlAdminAction =
  | 'kill-connections'
  | 'reset-password'
  | 'reset-database'
  | 'activate-extension'
  | 'add-read-only-user'
  | 'promote-replica'
  | 'generate-direct-host'
  | 'reboot-instances';

export type PostgresqlConnectionsState = { type: 'loading' } | { type: 'error' } | { type: 'loaded'; count: number };

export interface PostgresqlCapabilities {
  killConnections: boolean;
  resetPassword: boolean;
  resetDatabase: boolean;
  activateExtension: boolean;
  addReadOnlyUser: boolean;
  generateDirectHost: boolean;
  rebootInstances: boolean;
  promoteReplica: boolean;
  requestReplication: boolean;
}

export interface PostgresqlReadOnlyUser {
  user: string;
  password: string;
}

/** Payloads returned by the PostgreSQL add-on provider API. */
export interface PostgresqlDashboard {
  id: string;
  addonId: string;
  ownerId?: string;
  plan: string;
  planKind: 'shared' | 'dedicated';
  zone: string;
  status: string;
  creationDate: string;
  version: string;
  cluster?: {
    label: string;
    version: string;
  };
  role: 'primary' | 'replica';
  encrypted: boolean;
  ferretDBEnabled: boolean;
  credentials: PostgresqlCredentials;
  readOnlyUsers: Array<PostgresqlReadOnlyUser>;
  capabilities: PostgresqlCapabilities;
  notices: PostgresqlNotices;
}

export interface PostgresqlCredentials {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  uri: string;
  direct?: PostgresqlDirectCredentials;
  ferretDB?: PostgresqlFerretDBCredentials;
}

export interface PostgresqlDirectCredentials {
  host: string;
  port: number;
  uri: string;
}

export interface PostgresqlFerretDBCredentials {
  host: string;
  port: number;
  uri: string;
  direct?: PostgresqlDirectCredentials;
}

export interface PostgresqlNotices {
  quotaExceeded: boolean;
  missingCredentials: boolean;
  endOfLife?: {
    version: string;
    eolDate: string;
  };
}

export interface PostgresqlConnections {
  count: number;
}

export interface PostgresqlReadOnlyUsers {
  readOnlyUsers: Array<PostgresqlReadOnlyUser>;
}
