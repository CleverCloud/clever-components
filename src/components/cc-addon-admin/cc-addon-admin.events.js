import { CcEvent } from '../../lib/events.js';

/**
 * Dispatched when an addon deletion is requested.
 * @extends {CcEvent}
 */
export class CcAddonDeleteEvent extends CcEvent {
  static TYPE = 'cc-addon-delete';

  constructor() {
    super(CcAddonDeleteEvent.TYPE);
  }
}

/**
 * Dispatched when an addon name change is requested.
 * @extends {CcEvent<{name: string}>}
 */
export class CcAddonNameChangeEvent extends CcEvent {
  static TYPE = 'cc-addon-name-change';

  /**
   * @param {{name: string}} detail
   */
  constructor(detail) {
    super(CcAddonNameChangeEvent.TYPE, detail);
  }
}

/**
 * Dispatched when an addon tags change is requested.
 * @extends {CcEvent<{tags: Array<string>}>}
 */
export class CcAddonTagsChangeEvent extends CcEvent {
  static TYPE = 'cc-addon-tags-change';

  /**
   * @param {{tags: Array<string>}} detail
   */
  constructor(detail) {
    super(CcAddonTagsChangeEvent.TYPE, detail);
  }
}
