import { CcEvent } from '../../lib/events.js';

/**
 * @import { CellarBucketSort } from './cc-cellar-bucket-list.types.js';
 */

/**
 * Dispatched when a Cellar bucket creation is requested.
 * @extends {CcEvent<string>}
 */
export class CcCellarBucketCreateEvent extends CcEvent {
  static TYPE = 'cc-cellar-bucket-create';

  /**
   * @param {string} details
   */
  constructor(details) {
    super(CcCellarBucketCreateEvent.TYPE, details);
  }
}

/**
 * Dispatched when a Cellar bucket creation has been performed successfully.
 * @extends {CcEvent<string>}
 */
export class CcCellarBucketCreatedEvent extends CcEvent {
  static TYPE = 'cc-cellar-bucket-created';

  /**
   * @param {string} details
   */
  constructor(details) {
    super(CcCellarBucketCreatedEvent.TYPE, details);
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

/**
 * Dispatched when a Cellar bucket filtering is requested.
 * @extends {CcEvent<string>}
 */
export class CcCellarBucketFilterEvent extends CcEvent {
  static TYPE = 'cc-cellar-bucket-filter';

  /**
   * @param {string} details
   */
  constructor(details) {
    super(CcCellarBucketFilterEvent.TYPE, details);
  }
}

/**
 * Dispatched when a Cellar bucket filtering is requested.
 * @extends {CcEvent<CellarBucketSort>}
 */
export class CcCellarBucketSortEvent extends CcEvent {
  static TYPE = 'cc-cellar-bucket-sort';

  /**
   * @param {CellarBucketSort} details
   */
  constructor(details) {
    super(CcCellarBucketSortEvent.TYPE, details);
  }
}
