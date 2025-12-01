import { CcEvent } from '../../lib/events.js';

/**
 * Dispatched when a Cellar bucket creation is requested.
 * @extends {CcEvent<{bucketName: string}>}
 */
export class CcCellarBucketCreateEvent extends CcEvent {
  static TYPE = 'cc-cellar-bucket-create';

  /**
   * @param {{bucketName: string}} details
   */
  constructor(details) {
    super(CcCellarBucketCreateEvent.TYPE, details);
  }
}

/**
 * Dispatched when a Cellar bucket detail show is requested.
 * @extends {CcEvent<string>}
 */
export class CcCellarBucketShowEvent extends CcEvent {
  static TYPE = 'cc-cellar-bucket-show';

  /**
   * @param {string} details
   */
  constructor(details) {
    super(CcCellarBucketShowEvent.TYPE, details);
  }
}

/**
 * Dispatched when the current Cellar bucket details hide is requested.
 * @extends {CcEvent}
 */
export class CcCellarBucketHideEvent extends CcEvent {
  static TYPE = 'cc-cellar-bucket-hide';

  constructor() {
    super(CcCellarBucketHideEvent.TYPE);
  }
}

/**
 * Dispatched when a Cellar bucket deletion is requested.
 * @extends {CcEvent<string>}
 */
export class CcCellarBucketDeleteEvent extends CcEvent {
  static TYPE = 'cc-cellar-bucket-delete';

  /**
   * @param {string} details
   */
  constructor(details) {
    super(CcCellarBucketDeleteEvent.TYPE, details);
  }
}
