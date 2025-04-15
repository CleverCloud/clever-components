import { CcEvent } from '../../lib/events.js';

/**
 * @typedef {import('./cc-ssh-key-list.types.js').NewKey} NewKey
 * @typedef {import('./cc-ssh-key-list.types.js').GithubSshKey} GithubSshKey
 */

/**
 * Dispatched when an ssh key creation is requested.
 * @extends {CcEvent<NewKey>}
 */
export class CcSshKeyCreateEvent extends CcEvent {
  static TYPE = 'cc-ssh-key-create';

  /**
   * @param {NewKey} detail
   */
  constructor(detail) {
    super(CcSshKeyCreateEvent.TYPE, detail);
  }
}

/**
 * Dispatched when an ssh key deletion is requested.
 * @extends {CcEvent<{name: string}>}
 */
export class CcSshKeyDeleteEvent extends CcEvent {
  static TYPE = 'cc-ssh-key-delete';

  /**
   * @param {{name: string}} detail
   */
  constructor(detail) {
    super(CcSshKeyDeleteEvent.TYPE, detail);
  }
}

/**
 * Dispatched when a GitHub ssh key import is requested.
 * @extends {CcEvent<GithubSshKey>}
 */
export class CcSshKeyImportEvent extends CcEvent {
  static TYPE = 'cc-ssh-key-import';

  /**
   * @param {GithubSshKey} detail
   */
  constructor(detail) {
    super(CcSshKeyImportEvent.TYPE, detail);
  }
}
