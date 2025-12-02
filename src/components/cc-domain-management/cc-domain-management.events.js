import { CcEvent } from '../../lib/events.js';

/**
 * @import { NewDomain, DomainInfo } from './cc-domain-management.types.js'
 */

/**
 * Dispatched when a domain addition is requested.
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
 * Dispatched when a domain deletion is requested.
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
 * Dispatched when a primary domain change is requested.
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

/**
 * Dispatched when the primary domain modification has been taken into account.
 * @extends {CcEvent<string>}
 */
export class CcDomainPrimaryChangeEvent extends CcEvent {
  static TYPE = 'cc-domain-primary-change';

  /**
   * @param {string} detail
   */
  constructor(detail) {
    super(CcDomainPrimaryChangeEvent.TYPE, detail);
  }
}
