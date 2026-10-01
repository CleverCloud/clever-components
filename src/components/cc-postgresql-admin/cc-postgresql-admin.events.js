import { CcEvent } from '../../lib/events.js';

/**
 * Dispatched when killing all connections to the database is requested.
 * @extends {CcEvent<void>}
 */
export class CcPostgresqlConnectionsKillEvent extends CcEvent {
  static TYPE = 'cc-postgresql-connections-kill';

  constructor() {
    super(CcPostgresqlConnectionsKillEvent.TYPE);
  }
}

/**
 * Dispatched when a new database password is requested.
 * @extends {CcEvent<void>}
 */
export class CcPostgresqlPasswordResetEvent extends CcEvent {
  static TYPE = 'cc-postgresql-password-reset';

  constructor() {
    super(CcPostgresqlPasswordResetEvent.TYPE);
  }
}

/**
 * Dispatched when a database reset is requested.
 * @extends {CcEvent<void>}
 */
export class CcPostgresqlDatabaseResetEvent extends CcEvent {
  static TYPE = 'cc-postgresql-database-reset';

  constructor() {
    super(CcPostgresqlDatabaseResetEvent.TYPE);
  }
}

/**
 * Dispatched when the activation of a PostgreSQL extension is requested.
 * @extends {CcEvent<{extension: string}>}
 */
export class CcPostgresqlExtensionActivateEvent extends CcEvent {
  static TYPE = 'cc-postgresql-extension-activate';

  /**
   * @param {{extension: string}} detail
   */
  constructor(detail) {
    super(CcPostgresqlExtensionActivateEvent.TYPE, detail);
  }
}

/**
 * Dispatched when the creation of a read only user is requested.
 * @extends {CcEvent<void>}
 */
export class CcPostgresqlReadOnlyUserCreateEvent extends CcEvent {
  static TYPE = 'cc-postgresql-read-only-user-create';

  constructor() {
    super(CcPostgresqlReadOnlyUserCreateEvent.TYPE);
  }
}

/**
 * Dispatched when the promotion of a replica as a standalone server is requested.
 * @extends {CcEvent<void>}
 */
export class CcPostgresqlReplicaPromoteEvent extends CcEvent {
  static TYPE = 'cc-postgresql-replica-promote';

  constructor() {
    super(CcPostgresqlReplicaPromoteEvent.TYPE);
  }
}

/**
 * Dispatched when the generation of a direct hostname and port is requested.
 * @extends {CcEvent<void>}
 */
export class CcPostgresqlDirectHostGenerateEvent extends CcEvent {
  static TYPE = 'cc-postgresql-direct-host-generate';

  constructor() {
    super(CcPostgresqlDirectHostGenerateEvent.TYPE);
  }
}

/**
 * Dispatched when a reboot of the add-on instances is requested.
 * @extends {CcEvent<void>}
 */
export class CcPostgresqlInstancesRebootEvent extends CcEvent {
  static TYPE = 'cc-postgresql-instances-reboot';

  constructor() {
    super(CcPostgresqlInstancesRebootEvent.TYPE);
  }
}

/**
 * Dispatched when the database password has been changed.
 * @extends {CcEvent<void>}
 */
export class CcPostgresqlPasswordWasResetEvent extends CcEvent {
  static TYPE = 'cc-postgresql-password-was-reset';

  constructor() {
    super(CcPostgresqlPasswordWasResetEvent.TYPE);
  }
}

/**
 * Dispatched when a direct hostname and port have been generated.
 * @extends {CcEvent<void>}
 */
export class CcPostgresqlDirectHostWasGeneratedEvent extends CcEvent {
  static TYPE = 'cc-postgresql-direct-host-was-generated';

  constructor() {
    super(CcPostgresqlDirectHostWasGeneratedEvent.TYPE);
  }
}
