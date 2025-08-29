import { CcEvent } from '../../lib/events.js';

/**
 * Dispatch when an addon restart is requested.
 * @extends {CcEvent}
 */
export class CcAddonRestartEvent extends CcEvent {
  static TYPE = 'cc-addon-restart';

  constructor() {
    super(CcAddonRestartEvent.TYPE);
  }
}

/**
 * Dispatch when an addon rebuild is requested.
 * @extends {CcEvent}
 */
export class CcAddonRebuildEvent extends CcEvent {
  static TYPE = 'cc-addon-rebuild';

  constructor() {
    super(CcAddonRebuildEvent.TYPE);
  }
}
