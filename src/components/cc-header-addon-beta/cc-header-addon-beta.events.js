import { CcEvent } from '../../lib/events.js';

/**
 * Dispatch when an addon restart is requested.
 * @extends {CcEvent}
 */
export class CcHeaderAddonBetaRestartEvent extends CcEvent {
  static TYPE = 'cc-header-addon-beta-restart';
}
