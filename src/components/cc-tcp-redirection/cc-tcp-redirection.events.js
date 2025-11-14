import { CcEvent } from '../../lib/events.js';

/**
 * @import { CreateTcpRedirection, DeleteTcpRedirection } from './cc-tcp-redirection.types.js'
 */

/**
 * Dispatched when a tcp redirection creation is requested.
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
 * Dispatched when a tcp redirection deletion is requested.
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
