import { CcEvent } from '../../lib/events.js';

/**
 * Dispatched when a network group creation is requested.
 * @extends {CcEvent}
 */
export class CcNgEnable extends CcEvent {
  static TYPE = 'cc-ng-enable';

  constructor() {
    super(CcNgEnable.TYPE);
  }
}

/**
 * Dispatched when a network group deletion is requested.
 * @extends {CcEvent}
 */
export class CcNgDisable extends CcEvent {
  static TYPE = 'cc-ng-disable';

  constructor() {
    super(CcNgDisable.TYPE);
  }
}

/**
 * Dispatched when a secret renewal is requested.
 * @extends {CcEvent<string>}
 */
export class CcAddonCredentialsRenewSecret extends CcEvent {
  static TYPE = 'cc-addon-credentials-renew-secret';

  constructor() {
    super(CcAddonCredentialsRenewSecret.TYPE);
  }
}
