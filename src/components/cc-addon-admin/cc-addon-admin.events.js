import { CcEvent } from '../../lib/events.js';

/**
 * Fires when the delete button is clicked.
 * @extends {CcEvent<void>}
 */
export class CcAddonDeleteEvent extends CcEvent {
  static TYPE = 'cc-addon-delete';

  constructor() {
    super(CcAddonDeleteEvent.TYPE, undefined);
  }
}

/**
 * Fires when the update name button is clicked.
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
 * Fires when the update tags button is clicked.
 * @extends {CcEvent<{tags: string[]}>}
 */
export class CcAddonTagsChangeEvent extends CcEvent {
  static TYPE = 'cc-addon-tags-change';

  /**
   * @param {{tags: string[]}} detail
   */
  constructor(detail) {
    super(CcAddonTagsChangeEvent.TYPE, detail);
  }
}
