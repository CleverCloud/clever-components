import { CcEvent } from '../../lib/events.js';

/**
 * @typedef {import('./cc-domain-management.types.js').NewDomain} NewDomain
 * @typedef {import('./cc-domain-management.types.js').DomainInfo} DomainInfo
 */

/**
 * Fires when a domain is added.
 * @extends {CcEvent<NewDomain>}
 */
export class CcDomainAddEvent extends CcEvent {
  static TYPE = 'cc-domain-add';

  /**
   * @param {NewDomain} detail
   */
  constructor(detail) {
    super(CcDomainAddEvent.TYPE, detail);
  }
}

/**
 * Fires when a domain is deleted.
 * @extends {CcEvent<DomainInfo>}
 */
export class CcDomainDeleteEvent extends CcEvent {
  static TYPE = 'cc-domain-delete';

  /**
   * @param {DomainInfo} detail
   */
  constructor(detail) {
    super(CcDomainDeleteEvent.TYPE, detail);
  }
}

/**
 * Fires when a domain is marked as primary.
 * @extends {CcEvent<DomainInfo>}
 */
export class CcDomainMarkAsPrimaryEvent extends CcEvent {
  static TYPE = 'cc-domain-mark-as-primary';

  /**
   * @param {DomainInfo} detail
   */
  constructor(detail) {
    super(CcDomainMarkAsPrimaryEvent.TYPE, detail);
  }
}
