import { CcEvent } from '../../lib/events.js';

/**
 * @extends {CcEvent<{name: string, publicKey: string}>}
 */
export class CcSshKeyListCreateEvent extends CcEvent {
  static TYPE = 'cc-create-ssh-key';

  /**
   * @param {{name: string, publicKey: string}} detail
   */
  constructor(detail) {
    super(CcSshKeyListCreateEvent.TYPE, detail);
  }
}

/**
 * @extends {CcEvent<{name: string}>}
 */
export class CcSshKeyListDeleteEvent extends CcEvent {
  static TYPE = 'cc-delete-ssh-key';

  /**
   * @param {{name: string}} detail
   */
  constructor(detail) {
    super(CcSshKeyListDeleteEvent.TYPE, detail);
  }
}

/**
 * @extends {CcEvent<{name: string, publicKey: string, fingerprint: string}>}
 */
export class CcSshKeyListImportEvent extends CcEvent {
  static TYPE = 'cc-import-ssh-key';

  /**
   * @param {{name: string, publicKey: string, fingerprint: string}} detail
   */
  constructor(detail) {
    super(CcSshKeyListImportEvent.TYPE, detail);
  }
}
