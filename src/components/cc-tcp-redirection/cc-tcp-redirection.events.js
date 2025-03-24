import { CcEvent } from '../../lib/events.js';

/**
 * @typedef {import('./cc-tcp-redirection.types.js').CreateTcpRedirection} CreateTcpRedirection
 * @typedef {import('./cc-tcp-redirection.types.js').DeleteTcpRedirection} DeleteTcpRedirection
 */

/**
 * Fires when the create button is clicked.
 * @extends {CcEvent<CreateTcpRedirection>}
 */
export class CcTcpRedirectionCreateEvent extends CcEvent {
  static TYPE = 'cc-tcp-redirection-create';

  /**
   * @param {CreateTcpRedirection} detail
   */
  constructor(detail) {
    super(CcTcpRedirectionCreateEvent.TYPE, detail);
  }
}

/**
 * Fires when the delete button is clicked.
 * @extends {CcEvent<DeleteTcpRedirection>}
 */
export class CcTcpRedirectionDeleteEvent extends CcEvent {
  static TYPE = 'cc-tcp-redirection-delete';

  /**
   * @param {DeleteTcpRedirection} detail
   */
  constructor(detail) {
    super(CcTcpRedirectionDeleteEvent.TYPE, detail);
  }
}
