import { CcEvent } from '../../lib/events.js';

/**
 * Dispatched when an add-on version update was requested.
 * @extends {CcEvent<string>}
 */
export class CcAddonVersionChangeEvent extends CcEvent {
  static TYPE = 'cc-addon-version-change';

  /** @param {string} targetVersion */
  constructor(targetVersion) {
    super(CcAddonVersionChangeEvent.TYPE, targetVersion);
  }
}
