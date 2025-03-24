import { CcEvent } from '../../lib/events.js';

/**
 * @typedef {import('./cc-ssh-key-list.types.js').NewKey} NewKey
 * @typedef {import('./cc-ssh-key-list.types.js').GithubSshKey} GithubSshKey
 */

/**
 * Fires when clicking the creation form submit button.
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
 * Fires when clicking a personal key deletion button.
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
 * Fires when clicking a GitHub key import button.
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
