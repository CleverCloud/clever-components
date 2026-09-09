import { PostgresqlNotices } from '../cc-postgresql-admin/cc-postgresql-admin.types.js';

export type PostgresqlNoticesState =
  | PostgresqlNoticesStateLoading
  | PostgresqlNoticesStateError
  | PostgresqlNoticesStateLoaded;

export interface PostgresqlNoticesStateLoading {
  type: 'loading';
}

export interface PostgresqlNoticesStateError {
  type: 'error';
}

export interface PostgresqlNoticesStateLoaded {
  type: 'loaded';
  notices: PostgresqlNotices;
}
